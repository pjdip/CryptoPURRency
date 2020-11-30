var coinHistory = [];
var portfolio = [];
var baseURL = "https://api.coingecko.com/api/v3";
var coinSearchBaseURL = "https://api.coingecko.com/api/v3/coins/";
var coinSearchEndURL = "?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true";
var supportedCoinsURL = "https://api.coingecko.com/api/v3/coins/list";
var coinSupported;
var happyGiphyURL = "https://api.giphy.com/v1/gifs/random?api_key=6Legl3aRJS1kacPW7P9jmdcU7C4c4Q48&tag=celebration%20cats&rating=g";
var sadGiphyURL = "https://api.giphy.com/v1/gifs/random?api_key=6Legl3aRJS1kacPW7P9jmdcU7C4c4Q48&tag=scared%20cats&rating=g";


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

// Simple storage functions
function storeCoins() {
    var stringyCoins = JSON.stringify(coinHistory);
    localStorage.setItem("coins", stringyCoins);
}

function storePortfolio() {
    var stringyPortfolio = JSON.stringify(portfolio);
    localStorage.setItem("portfolio", stringyPortfolio);
}

// This function dynamically creates the search history list
function renderHistory() {

    $("#coinHistory").empty();

    // Creating a new button and li element for each coin and appending them to the ul in the html
    coinHistory.forEach(function(searchedCoin) {
        var newCoin1 = $("<li>");
        var coinButton = $("<button>").text(searchedCoin.name).attr("id", searchedCoin.id).attr("class", "btn coin-btn list-group-item p-1 border border-black border-opacity-100 rounded-md mb-1").attr("style", "text-align: left;");
        newCoin1.append(coinButton);
        $("#coinHistory").append(newCoin1);
    });
}

// Makes an api call to get the top 10 coins by market cap, then dynamically generates html 
function renderTop10() {
    $("#top10").empty();
    var top10URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";
    $.ajax({url: top10URL, method: "GET"}).then(function(response) {

        // loop through the 10 requested coins
        for (var i = 0; i < 10; i++) {
            var newCoin2 = $("<li>");
            var coinButton = $("<button>").text(response[i].name).attr("id", response[i].id).attr("class", "btn top10btn list-group-item p-1 border border-black border-opacity-100 rounded-md mb-1").attr("style", "text-align: left;");
            newCoin2.append(coinButton);
            $("#top10").append(newCoin2);
        }
    });
}

// Generates a gif based on percent change of a coin and appends to provided html element ID
function renderGifs(percent, htmlID) {
    if (percent > 0) {
        $.ajax({url: happyGiphyURL, method: "GET"}).then(function(resp1) {
            var kittyIMG = $("<img>");
            kittyIMG.attr("src", resp1.data.images.fixed_height.url).attr("class", "text-center");
            $(htmlID).append(kittyIMG);
        });        
    } else if (percent < 0) {
        $.ajax({url: sadGiphyURL, method: "GET"}).then(function(resp2) {
            var kittyIMG = $("<img>");
            kittyIMG.attr("src", resp2.data.images.fixed_height.url).attr("class", "text-center");
            $(htmlID).append(kittyIMG);
        });
    }
}

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
function renderCoinData(coinVar) {

    // Empty all the things
    $("#coinIMG").empty(), $("#coinName").empty();
    $("#coinSymbol").empty(), $("#currentPrice").empty();
    $("#projectHomepage").empty(), $("#projectDescription").empty();
    $("#marketCap").empty(), $("#tradingVolume").empty();
    $("#maxSupply").empty(), $("#circulatingSupply").empty();
    $("#ATH").empty(), $("#ATHdate").empty();

    // Create queryURL and make ajax call to generate lots of things
    var queryURL = coinSearchBaseURL + coinVar + coinSearchEndURL;
    $.ajax({url: queryURL, method: "GET"}).then(function(response) {
        $("#coinIMG").attr("src", response.image.thumb);
        $("#coinName").text(response.name).attr("data-coinID", response.id);
        $("#coinSymbol").text("(" + response.symbol + ")");
        $("#currentPrice").text("Current Price: $" + response.market_data.current_price.usd.toLocaleString());

        // Check if a coin is in the portfolio to adjust portfolio text
        var myCoin = new Coin(response.name, response.id);
        var indX = IndexOfArrayObject(portfolio, "id", myCoin.id);
        if (indX !== -1) {
            $("#portfolioToggle").text("Remove from Portfolio").attr("class", "block md:inline md:float-right p-1 border border-black border-opacity-100 rounded-md");;
        } else {
            $("#portfolioToggle").text("Add to Portfolio").attr("class", "block md:inline md:float-right p-1 border border-black border-opacity-100 rounded-md");;
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

    /*     renderGraph(priceURL(coinVar, 1, "hourly"), "24h"); */
    renderGraph(priceURL(coinVar, 30, "daily"), "30d");
    renderGraph(priceURL(coinVar, 200, "daily"), "200d");
    renderGraph(priceURL(coinVar, 365, "daily"), "1y");

}

function renderGraph(URL, range) {
    var chartID = "myChart" + range;
    var graphLabel = range + " Price Chart";

    $.ajax({url: URL, method: "GET"}).then(function(response) {
        var prices = [];
        var interval = [];
        for (var j = 0; j < response.prices.length; j++) {
            interval.push(j);
            prices.push(response.prices[j][1].toFixed(4));
        }

        reveal(range);
        var ctx = document.getElementById(chartID).getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                labels: interval,
                datasets: [{
                    label: graphLabel,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: prices
                }]
            },

            // Configuration options go here
            options: {}
        });
    });
}

function priceURL(ID, days, interval) {
    var graphDays = "/market_chart?vs_currency=usd&days=" + days;
    var graphInterval = "&interval=" + interval;
    return coinSearchBaseURL + ID + graphDays + graphInterval;
}

// Updates coinHistory and combines various functions that are always called together
function updateRenderStore(coinFriend) {

    // if searched coin is already in the history, remove it
    var index = IndexOfArrayObject(coinHistory, "id", coinFriend.id);
    if (index !== -1) {
        coinHistory.splice(index, 1);
    }

    // add searched coin to the top of the history
    coinHistory.unshift(coinFriend);

    // render coin data, render/store history
    hide("portfolioDisplay");
    hide("topDisplay");
    reveal("coinDataDisplay");
    renderCoinData(coinFriend.id);
    storeCoins();
    renderHistory();
}

// grabs a random coin from the supported list and displays the data
$("#randomCoin").on("click", function(eventems) {
    eventems.preventDefault();
    $.ajax({url: supportedCoinsURL, method: "GET"}).then(function(resp3) {
        randCoinIndex = Math.floor(Math.random() * resp3.length);
        randCoin = new Coin(resp3[randCoinIndex].name, resp3[randCoinIndex].id);
        updateRenderStore(randCoin);
    });
});

// Hides the coin data section and generates/displays the portfolio
$("#displayPortfolio").on("click", function(event) {
    event.preventDefault();
    hide("coinDataDisplay");
    hide("topDisplay");
    reveal("portfolioDisplay");
    $("#portBody").empty();

    // Creating a new button and li element for each coin and appending them to the ul in the html
    portfolio.forEach(function(portfolioCoin) {
        var tableRow = $("<tr>");
        var dataName = $("<td>");
        var dataPrice = $("<td>");
        var delta1h = $("<td>");
        var delta24h = $("<td>");
        var delta7d = $("<td>");

        var qURL = coinSearchBaseURL + portfolioCoin.id + coinSearchEndURL;
        $.ajax({url: qURL, method: "GET"}).then(function(response) {
            var coinBtn = $("<button>").text(response.name).attr("id", response.id).attr("class", "btn list-group-item p-1 border border-black border-opacity-100 rounded-md mb-1");
            dataName.append(coinBtn);
            dataPrice.text("$" + response.market_data.current_price.usd.toLocaleString());
            delta1h.text(response.market_data.price_change_percentage_1h_in_currency.usd.toFixed(1).toLocaleString() + "%");
            delta24h.text(response.market_data.price_change_percentage_24h_in_currency.usd.toFixed(1).toLocaleString() + "%");
            delta7d.text(response.market_data.price_change_percentage_7d_in_currency.usd.toFixed(1).toLocaleString() + "%");

            percentColor(response.market_data.price_change_percentage_1h_in_currency.usd, delta1h);
            percentColor(response.market_data.price_change_percentage_24h_in_currency.usd, delta24h);
            percentColor(response.market_data.price_change_percentage_7d_in_currency.usd, delta7d);

            tableRow.append(dataName);
            tableRow.append(dataPrice);
            tableRow.append(delta1h);
            tableRow.append(delta24h);
            tableRow.append(delta7d);
            $("#portBody").append(tableRow);
        });
    });
});

function renderTop() {
    $("#topBody").empty();
    var top10URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d";
    $.ajax({url: top10URL, method: "GET"}).then(function(response) {
        // loop through the 10 requested coins
        for (var i = 0; i < 25; i++) {
            var tableRow = $("<tr>").attr("class", "flex flex-col flex-no wrap sm:table-row");
            var dataName = $("<td>");
            var dataPrice = $("<td>");
            var delta1h = $("<td>");
            var delta24h = $("<td>");
            var delta7d = $("<td>");
            var vol = $("<td>");
            var mktCap = $("<td>");
            var coinImg = $("<img>");

            coinImg.attr("src", response[i].image).attr("style", "width: 20%; margin-right: 1px; margin-left: 15%; display: inline; float: left;");
            var coinBtn = $("<button>").text(response[i].name).attr("id", response[i].id).attr("class", "btn list-group-item p-1 border border-black border-opacity-100 rounded-md mb-1").attr("style", "float: left;");
            dataName.append(coinImg);
            dataName.append(coinBtn);
            dataPrice.text("$" + response[i].current_price.toLocaleString());
            delta1h.text(response[i].price_change_percentage_1h_in_currency.toFixed(1).toLocaleString() + "%");
            delta24h.text(response[i].price_change_percentage_24h_in_currency.toFixed(1).toLocaleString() + "%");
            delta7d.text(response[i].price_change_percentage_7d_in_currency.toFixed(1).toLocaleString() + "%");
            vol.text("$" + response[i].total_volume.toLocaleString());
            mktCap.text("$" + response[i].market_cap.toLocaleString());

            percentColor(response[i].price_change_percentage_1h_in_currency, delta1h);
            percentColor(response[i].price_change_percentage_24h_in_currency, delta24h);
            percentColor(response[i].price_change_percentage_7d_in_currency, delta7d);

            tableRow.append(dataName);
            tableRow.append(dataPrice);
            tableRow.append(delta1h);
            tableRow.append(delta24h);
            tableRow.append(delta7d);
            tableRow.append(vol);
            tableRow.append(mktCap);

            $("#topBody").append(tableRow);
        }
    });
}

$(".coinTable").on("click", function(evnt) {
    evnt.preventDefault();        
    if (evnt.target.matches("button")) {
        var coinVar13 = new Coin (evnt.target.textContent, evnt.target.getAttribute("id"));
        updateRenderStore(coinVar13);
    }
});

function percentColor(percent, elem) {
    if (percent > 0) {
        elem.attr("style", "color: green;")
    } else if (percent < 0) {
        elem.attr("style", "color: red;")
    }
}

// Event delegation for all the coin buttons :D
$(".coinList").on("click", function(evt) {
    evt.preventDefault();
    if (evt.target.matches("button")) {
        var coinVar10 = new Coin (evt.target.textContent, evt.target.getAttribute("id"));
        updateRenderStore(coinVar10);
    }
});

// clear history and portfolio buttons
$(".clear").on("click", function(event) {
    event.preventDefault();
    if ($(this).attr("id") === "clearHistory") {
        coinHistory = [];
        storeCoins();
        renderHistory();
    } else if ($(this).attr("id") === "clearPortfolio") {
        portfolio = [];
        storePortfolio();
        $("#portBody").empty();        
    }
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
            alert("The searched coin is not supported by coingecko. Please try searching for another coin.")
        } else if (coinSupported === true) {
            updateRenderStore(newCoin);
        }
    });
});

// Retrieve coinHistory and portfolio from local storage
var retrievedCoins = localStorage.getItem("coins");
if (retrievedCoins !== null) {
    coinHistory = JSON.parse(retrievedCoins);
}

var retrievedPortfolio = localStorage.getItem("portfolio");
if (retrievedPortfolio !== null) {
    portfolio = JSON.parse(retrievedPortfolio);
}

/* renderTop10(); */
renderHistory();
renderTop();

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