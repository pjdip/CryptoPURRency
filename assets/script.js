var portfolio = [];
var coinSearchBaseURL = "https://api.coingecko.com/api/v3/coins/";
var coinSearchEndURL = "?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true&sparkline=true";
var supportedCoinsURL = "https://api.coingecko.com/api/v3/coins/list";
var coinSupported;

var happyGiphyURL = "https://api.giphy.com/v1/gifs/search?api_key=6Legl3aRJS1kacPW7P9jmdcU7C4c4Q48&rating=g&limit=50&q='cat+celebration'";
var sadGiphyURL = "https://api.giphy.com/v1/gifs/search?api_key=6Legl3aRJS1kacPW7P9jmdcU7C4c4Q48&rating=g&limit=50&q='scared+cat'";

var topURL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d";
var defiURL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=decentralized_finance_defi&order=market_cap_desc&per_page=25&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d";
var globalURL = "https://api.coingecko.com/api/v3/global";

// Api call to grab global cryptocurrency market data
$.ajax({url: globalURL, method: "GET"}).then(function(resp) {
    $("#cap").text("$" + resp.data.total_market_cap.usd.toLocaleString().slice(0,-4));
    $("#deltaCap").text(resp.data.market_cap_change_percentage_24h_usd.toFixed(2) + "%");
    percentColor(resp.data.market_cap_change_percentage_24h_usd, $("#deltaCap"));
    $("#vol").text("$" + resp.data.total_volume.usd.toLocaleString().slice(0,-4));
    $("#btcDom").text(resp.data.market_cap_percentage.btc.toFixed(2) + "%");
    $("#ethDom").text(resp.data.market_cap_percentage.eth.toFixed(2) + "%");
});

// Alter the color of a jQuery object depending on the percent argument
function percentColor(percent, jObj) {
    if (percent > 0) {
        jObj.attr("style", "color: green;")
    } else if (percent < 0) {
        jObj.attr("style", "color: red;")
    }
}

// Creating coin object prototype
class Coin {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }
}

// Takes an HTML element id and HIDES the element from the user if it is visible
function hide(visibleID) {
    document.getElementById(visibleID).classList.remove("reveal");
    document.getElementById(visibleID).classList.add("hide");
}

// Takes an HTML element id and REVEALS the element to the user if it is hidden
function reveal(hiddenID) {
    document.getElementById(hiddenID).classList.remove("hide");
    document.getElementById(hiddenID).classList.add("reveal");
}

// Hides/reveals a bunch of elements on click event
$("#home").on("click", function(event) {
    event.preventDefault();
    hide("portfolioDisplay");
    reveal("topDisplay");
    hide("coinDataDisplay");
    hide("defiDisplay");
});

// Hides/reveals a bunch of stuff on click event
// Have to render the table after the element is revealed or the graphs get messed up
$("#defi").on("click", function(event) {
    event.preventDefault();
    hide("portfolioDisplay");
    hide("topDisplay");
    hide("coinDataDisplay");
    reveal("defiDisplay");
    renderTable(defiURL, "#defiBody");
});

// Grabs a random coin from the supported list and displays the data
$("#randomCoin").on("click", function(event) {
    event.preventDefault();
    $.ajax({url: supportedCoinsURL, method: "GET"}).then(function(response) {
        randCoinIndex = Math.floor(Math.random() * response.length);
        renderCoinData(response[randCoinIndex].id);
    });
});

// This function does double duty by finding the index of a pre-existing object in an array
// or returning -1 if the object with the searched property is not already in the array
// (like the built-in IndexOf() method)
// It takes in an array of similar objects, a property of those objects, and a searched item
// If the searched item is found to be equivalent to the property of one of the objects
// the function returns the index of that object
// If the object with the given property does not exist in the array, function return -1
function IndexOfArrayObject(array, objProperty, searched) {
    for(var i = 0; i < array.length; i++) {
        if (array[i][objProperty] === searched) {
            return i;
        }
    }
    return -1;
}

// Takes a coingecko coin-ID and generates html from api-retreived data
function renderCoinData(coinID) {

    // Empty all the things
    $("#coinIMG").empty(), $("#coinName").empty();
    $("#coinSymbol").empty(), $("#currentPrice").empty();
    $("#projectHomepage").empty(), $("#projectDescription").empty();
    $("#marketCap").empty(), $("#tradingVolume").empty();
    $("#maxSupply").empty(), $("#circulatingSupply").empty();
    $("#ATH").empty(), $("#ATHdate").empty();

    // Create queryURL and make ajax call to generate lots of things
    var queryURL = coinSearchBaseURL + coinID + coinSearchEndURL;
    $.ajax({url: queryURL, method: "GET"}).then(function(response) {
        $("#coinIMG").attr("src", response.image.thumb);
        $("#coinName").text(response.name).attr("data-coinID", response.id);
        $("#coinSymbol").text("(" + response.symbol + ")");
        $("#currentPrice").text("Current Price: $" + response.market_data.current_price.usd.toLocaleString());

        // Check if a coin is in the portfolio to adjust portfolio button text
        var myCoin = new Coin(response.name, response.id);
        var indX = IndexOfArrayObject(portfolio, "id", myCoin.id);
        if (indX !== -1) {
            $("#portfolioToggle").text("Remove from Portfolio").attr("class", "block md:inline md:float-right rounded-md");;
        } else {
            $("#portfolioToggle").text("Add to Portfolio").attr("class", "block md:inline md:float-right rounded-md");;
        }

        $("#projectHomepage").text(response.links.homepage[0]).attr("href", response.links.homepage[0]);

        // Parse the description string and then append it to the html
        var descriptionString = response.description.en;
        var parsedDescription = jQuery.parseHTML(descriptionString);
        
        parsedDescription.forEach(function(item) {
            $("#projectDescription").append(item);
        });

        $("#marketCap").text("$" + response.market_data.market_cap.usd.toLocaleString());
        $("#tradingVolume").text("$" + response.market_data.total_volume.usd.toLocaleString());

        renderGifs(response.market_data.price_change_percentage_24h, "#24h");
        renderGifs(response.market_data.price_change_percentage_30d, "#30d");
        renderGifs(response.market_data.price_change_percentage_200d, "#200d");
        renderGifs(response.market_data.price_change_percentage_1y, "#1y");

        percentColor(response.market_data.price_change_percentage_24h, $("#24h"));
        percentColor(response.market_data.price_change_percentage_30d, $("#30d"));
        percentColor(response.market_data.price_change_percentage_200d, $("#200d"));
        percentColor(response.market_data.price_change_percentage_1y, $("#1y"));

        $("#24h").text(response.market_data.price_change_percentage_24h);
        $("#30d").text(response.market_data.price_change_percentage_30d);
        $("#200d").text(response.market_data.price_change_percentage_200d);
        $("#1y").text(response.market_data.price_change_percentage_1y);

        // Some coins do not have a maximum supply, check if this is the case or not
        if (response.market_data.max_supply !== null) {
            $("#maxSupply").text(response.market_data.max_supply.toLocaleString());
        } else {
            $("#maxSupply").text("there is no defined maximum supply for this coin");
        }

        $("#circulatingSupply").text(response.market_data.circulating_supply.toLocaleString());
        $("#ATH").text("$" + response.market_data.ath.usd.toLocaleString() + " on " + response.market_data.ath_date.usd.slice(0, 10));
    });

    renderGraph(priceURL(coinID, 1, "hourly"), "24h");
    renderGraph(priceURL(coinID, 30, "daily"), "30d");
    renderGraph(priceURL(coinID, 200, "daily"), "200d");
    renderGraph(priceURL(coinID, 365, "daily"), "1y");

    hide("portfolioDisplay");
    hide("defiDisplay");
    hide("topDisplay");
    reveal("coinDataDisplay");
}

// Generates a gif based on percent change of a coin's value and append to provided html element ID
function renderGifs(percent, htmlID) {
    var kittyIMG = $("<img>");
    if (percent > 0) {
        $.ajax({url: happyGiphyURL, method: "GET"}).then(function(resp1) {
            var randCat = Math.floor(Math.random() * resp1.data.length);
            kittyIMG.attr("src", resp1.data[randCat].images.fixed_height.url).attr("class", "text-center");
            $(htmlID).append(kittyIMG);
        });        
    } else if (percent < 0) {
        $.ajax({url: sadGiphyURL, method: "GET"}).then(function(resp2) {
            var randCat2 = Math.floor(Math.random() * resp2.data.length);
            kittyIMG.attr("src", resp2.data[randCat2].images.fixed_height.url).attr("class", "text-center");
            $(htmlID).append(kittyIMG);
        });
    }
}

// Returns a constructed URL for a price api call based on provided arguments
function priceURL(coinID, days, interval) {
    return coinSearchBaseURL + coinID + "/market_chart?vs_currency=usd&days=" + days + "&interval=" + interval;
}

// Takes a url that pulls price data and an html id that signifies the range of data
// (If I had more time I would utilize data-attributes so much more)
function renderGraph(URL, rangeID) {
    var chartID = "myChart" + rangeID;
    var graphLabel = rangeID + " Price Chart";

    $.ajax({url: URL, method: "GET"}).then(function(response) {
        var priceArray = [];
        var interval = [];
        if (rangeID === "24h") {
            var xLabel = false;
            var xAx = [];
            for (var m = 0; m < 25; m ++) {
                xAx.push(m);
            }
        } else {
            xLabel = true;
        }

        for (var j = 0; j < response.prices.length; j++) {
            if (rangeID === "24h") {
                var day = moment(response.prices[j][0]);
                interval.push(day.format('HH' + ':' + 'ss'));
            } else {
                var day = moment(response.prices[j][0]);
                interval.push(day.format('MM' + '/' + 'DD'));
            }
            priceArray.push(response.prices[j][1].toFixed(4));
        }

        reveal(rangeID);
        var ctx = document.getElementById(chartID).getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                labels: interval,
                datasets: [{
                    label: graphLabel,
                    fill: false,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    pointRadius: 0,
                    lineTension: 0,
                    data: priceArray
                }]
            },

            // Configuration options go here
            options: {
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            display: true
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'time'
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            callback: function(value, index, values) {
                                if (value < 0.01) {
                                    return '$' + value.toFixed(5);
                                } else if (value > 100) {
                                    return '$' + value;
                                } else {
                                    return '$' + value.toFixed(2);
                                }
                            }
                        },
                    }]
                }
            }
        });
    });
}

// Hides the coin data section and generates/displays the portfolio
$("#displayPortfolio").on("click", function(event) {
    event.preventDefault();
    hide("coinDataDisplay");
    hide("defiDisplay");
    hide("topDisplay");
    reveal("portfolioDisplay");
    $("#portBody").empty();
    var portURL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&sparkline=true&price_change_percentage=1h%2C24h%2C7d&ids=";

    // Add Id's to the url for each coin in the portfolio
    portfolio.forEach(function(portfolioCoin) {
        portURL += portfolioCoin.id + ",";
    });

    // Cut off the last ','
    var portSlice = portURL.slice(0, -1);

    // check that portfolio wasn't empty. due to obnoxious truthiness rules, it did not work to compare portfolio to the empty array
    if (portSlice !== "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&sparkline=true&price_change_percentage=1h%2C24h%2C7d&ids") {
        renderTable(portSlice, "#portBody");
    }
});

// Renders a table of api acquired data from the url into the html element with the given ID
function renderTable(url, tableID) {
    $(tableID).empty();

    // url's fed to this function will return a list of coins
    // Here we dynamically generate a table row for each one
    $.ajax({url: url, method: "GET"}).then(function(response) {
        for (var i = 0; i < response.length; i++) {
            var tableRow = $("<tr>");
            var marketRank = $("<td>");
            var dataName = $("<td>");
            var dataPrice = $("<td>");
            var delta1h = $("<td>");
            var delta24h = $("<td>");
            var delta7d = $("<td>");
            var vol = $("<td>");
            var mktCap = $("<td>");
            var coinImg = $("<img>");
            var nameDiv = $("<div>").attr("class", "text-center mx-auto w-28 md:w-44");
            var chart1 = $("<td>");

            // The generated chartID needs to be different depending on the table
            // Otherwise we override the graphs
            if (tableID === "#topBody") {
                var chartID = "topChart" + i;
            } else if (tableID === "#defiBody") {
                var chartID = "defiChart" + i;
            } else if (tableID === "#portBody") {
                var chartID = "portChart" + i;
            }

            // Generating a canvas with the id
            var myChart = $("<canvas>").attr("id", chartID).attr("style", "width: 240px;");

            // Appending lots of things to the table
            marketRank.text(response[i].market_cap_rank);
            coinImg.attr("src", response[i].image).attr("class", "w-8").attr("style", "margin-right: 1px; display: inline; float: left;");
            var coinBtn = $("<button>").attr("id", response[i].id).attr("class", "text-center mx-auto btn coin-btn rounded-md mb-1").attr("style", "float: left;");

            // Depending on the viewport width, the name is displayed as the full name or the symbol
            if (window.visualViewport.width < 768) {
                coinBtn.text(response[i].symbol.toUpperCase());
            } else if (window.visualViewport.width >= 768) {
                coinBtn.text(response[i].name);
            }
            nameDiv.append(coinImg).append(coinBtn);
            dataName.append(nameDiv);
            dataPrice.text("$" + response[i].current_price.toLocaleString());

            // Newer coins will not have values for some of these, coingecko api does not seem to be especially uniform
            if (response[i].price_change_percentage_1h_in_currency !== null && response[i].price_change_percentage_1h_in_currency !== undefined) {
                delta1h.text(response[i].price_change_percentage_1h_in_currency.toFixed(1) + "%");
            }
            if (response[i].price_change_percentage_24h_in_currency !== null && response[i].price_change_percentage_24h_in_currency !== undefined) {
                delta24h.text(response[i].price_change_percentage_24h_in_currency.toFixed(1) + "%");
            }
            if (response[i].price_change_percentage_7d_in_currency !== null && response[i].price_change_percentage_7d_in_currency !== undefined) {
                delta7d.text(response[i].price_change_percentage_7d_in_currency.toFixed(1) + "%");
            }

            vol.text("$" + response[i].total_volume.toLocaleString());
            mktCap.text("$" + response[i].market_cap.toLocaleString());

            percentColor(response[i].price_change_percentage_1h_in_currency, delta1h);
            percentColor(response[i].price_change_percentage_24h_in_currency, delta24h);
            percentColor(response[i].price_change_percentage_7d_in_currency, delta7d);

            tableRow.append(marketRank);
            tableRow.append(dataName);
            tableRow.append(dataPrice);
            tableRow.append(delta1h);
            tableRow.append(delta24h);
            tableRow.append(delta7d);
            tableRow.append(vol);
            tableRow.append(mktCap);

            // Not all coins come with this data
            if (response[i].sparkline_in_7d.price !== []) {
                var priceData = response[i].sparkline_in_7d.price;
                var interval = [];
                for (var l = 0; l < priceData.length; l++) {
                    interval.push(l);
                }
    
                chart1.append(myChart);
                tableRow.append(chart1);
                $(tableID).append(tableRow);
    
                // Straight out of chart.js documentation
                var ctx = document.getElementById(chartID).getContext('2d');
                var chart = new Chart(ctx, {
                    // The type of chart we want to create
                    type: 'line',
        
                    // The data for our dataset
                    data: {
                        labels: interval,
                        datasets: [{
                            fill: false,
                            backgroundColor: 'rgb(255, 99, 132)',
                            borderColor: 'rgb(255, 99, 132)',
                            pointRadius: 0,
                            lineTension: 0,
                            data: priceData
                        }]
                    },
        
                    // Configuration options go here
                    options: {
                        legend: {
                            display: false
                        },
                        scales: {
                            xAxes: [{
                                gridLines: {
                                    display: false
                                },
                                ticks: {
                                    display: false
                                }
                            }],
                            yAxes: [{
                                gridLines: {
                                    display: false
                                },
                                ticks: {
                                    display: false
                                }
                            }]
                        }
                    }
                });
            }
        }
    });
}

// Event Delegation for coin buttons (they are all stored in a table)
$(".coinTable").on("click", function(event) {
    event.preventDefault();        
    if (event.target.matches("button")) {
        renderCoinData(event.target.getAttribute("id"));
        window.scrollTo(0, 0);
    }
});

// Stores the portfolio array in local storage
function storePortfolio() {
    var stringyPortfolio = JSON.stringify(portfolio);
    localStorage.setItem("portfolio", stringyPortfolio);
}

// Empties the portfolio array and updates the display
$("#clearPortfolio").on("click", function(event) {
    event.preventDefault();
    portfolio = [];
    storePortfolio();
    $("#portBody").empty();
});

// Adds or removes a coin from the portfolio and adjusts the button text
$("#portfolioToggle").on("click", function(event) {
    event.preventDefault();

    // Generate a coin object to compare to portfolio array
    var myCoin2 = new Coin($(this).parent().prev().prev().prev().text(), $(this).parent().prev().prev().prev().attr("data-coinID"));
    var indX2 = IndexOfArrayObject(portfolio, "id", myCoin2.id);

    // Adjust the portfolio depending on if the coin is already in it or not
    if (indX2 !== -1) {
        portfolio.splice(indX2, 1);
        $("#portfolioToggle").text("Add to Portfolio");
    } else {
        portfolio.unshift(myCoin2);
        $("#portfolioToggle").text("Remove from Portfolio");
    }
    storePortfolio();
});

// Api calls and rendering when clicked
$("#searchButton").on("click", function(event) {
    event.preventDefault();

    // Grab and format the input
    var userCoin = $("#coinSearch").val().trim();
    $("#coinSearch").empty();

    // Verify coin exists
    // add this to local storage?
    // there are 6,000 supported coins, might be too many?
    $.ajax({url: supportedCoinsURL, method: "GET"}).then(function(response) {
        coinSupported = false;

        // Check the list of supported coins
        for (var i = 0; i < response.length; i++) {

            // Compare user input to the id/symbol/name of supported coins
            if (userCoin === response[i].id ||
                userCoin === response[i].symbol ||
                userCoin === response[i].name ||
                userCoin.toLowerCase() === response[i].id ||
                userCoin.toLowerCase() === response[i].symbol ||
                userCoin.toLowerCase() === response[i].name) {
            
                // If we get a match, create new coin object with response data
                var newCoin = new Coin(response[i].name, response[i].id);
            
                // Update this variable to note that the coin is supported
                coinSupported = true;
            }
        }

        // Alert the user to search again or process the search if it is supported
        if (coinSupported === false) {
            modalHeadline.innerText = "Invalid Search"
            modalText.innerText = "The searched coin is not supported by coingecko. Please try searching for another coin."
            modal.style.display = "block";
            // alert("The searched coin is not supported by coingecko. Please try searching for another coin.")
        } else if (coinSupported === true) {
            renderCoinData(newCoin.id);
        }
    });
});

// Retrieve portfolio from local storage and store in variable
var retrievedPortfolio = localStorage.getItem("portfolio");
if (retrievedPortfolio !== null) {
    portfolio = JSON.parse(retrievedPortfolio);
}

//This section enables functionality for modal that pops up on invalid search
var modal = document.getElementById("modal")
var closeBtn = document.getElementById("closeModal")
var modalHeadline = document.getElementById("modalHeadline")
var modalText = document.getElementById("modalText")

closeBtn.onclick = function() {
    modal.style.display = "none"
}

// Main page table display rendering
renderTable(topURL, "#topBody");


// api stuff:
/* 
timeID: 24h, 7d, 14d, 30d, 60d, 200d, 1y
currencyID: usd, eur, gbp, btc, eth, etc...

image:
    $("#coinIMG").attr("src", response.image.thumb);
    response.image.thumb/small/large

name:
    $("#coinName").text(response.name);

symbol:
    $("#coinSymbol").text(response.symbol);

website:
    $("#projectHomepage").text(response.links.homepage[0]);
    response.links.homepage[0]

description:
    $("#projectDescription").text(response.description);
    response.description

github:
    $("#projectGithub").text(response.repos_url.github[0]);
    response.repos_url.github[0]

reddit:
    $("#projectSubreddit").text(response.subreddit_url);
    response.subreddit_url

// offer user choice of currency?
market data:
    current price:
        $("#currentPrice").text(market_data.current_price.usd);
        
        market_data.current_price.(currencyID)
    
    all time high:
        $("#ATH").text(market_data.ath.usd);
        $("#ATHdate").text(market_data.ath.ath_date);

        market_data.ath.(currencyID)
        market_data.ath_date

    all time low:
        $("#ATL").text(market_data.atl.usd);

        market_data.atl.(currencyID)
        
    marketcap:
        $("#marketCap").text(market_data.market_cap.usd);
    
        market_data.market_cap.currencyID
    
    24h volume:
        $("#tradingVolume").text(market_data.total_volume.usd);

        market_data.total_volume.currencyID
    
    percent change:
        $("#percentChangeIn24h").text(market_data.price_change_percentage_24h);
        $("#percentChangeIn30d").text(market_data.price_change_percentage_30d);
        $("#percentChangeIn200d").text(market_data.price_change_percentage_200d);
        $("#percentChangeIn1y").text(market_data.price_change_percentage_1y);

        market_data.price_change_percentage_(timeID) (i think these are all in usd)

        market_data.price_change_24h_in_currency.(currencyID)
        market_data.price_change_percentage_(timeID)_in_currency.(currencyID)

    supply:
        $("#maxSupply").text(market_data.max_supply);
        $("#circulatingSupply").text(market_data.circulating_supply);

        market_data.max_supply
        market_data.circulating_supply

developer data:
    developer_data.forks
    developer_data.code_additions_deletions_4_weeks.additions
    developer_data.code_additions_deletions_4_weeks.deletions
    developer_data.commit_count_4_weeks */