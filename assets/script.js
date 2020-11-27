var coinHistory = [];
var portfolio = [];
var baseURL = "https://api.coingecko.com/api/v3";
var coinSearchBaseURL = "https://api.coingecko.com/api/v3/coins/";
var coinSearchEndURL = "?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true";
var supportedCoinsURL = "https://api.coingecko.com/api/v3/coins/list";
var coinSupported;

// creating coin object prototype
class Coin {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }
}

// takes an HTML element id and hides the element from the user if it is visible
function hide(visibleID) {
    document.getElementById(visibleID).classList.remove("reveal");
    document.getElementById(visibleID).classList.add("hide");
}

// takes an HTML element id and reveals the element to the user if it is hidden
function reveal(hiddenID) {
    document.getElementById(hiddenID).classList.remove("hide");
    document.getElementById(hiddenID).classList.add("reveal");
}

// Same storage function as previous assignments
function storeCoins() {
    var stringyCoins = JSON.stringify(coinHistory);
    localStorage.setItem("coins", stringyCoins);
}

function storePortfolio() {
    var stringyPortfolio = JSON.stringify(portfolio);
    localStorage.setItem("portfolio", stringyPortfolio);
}

$("#portfolio").on("click", function(event) {
    event.preventDefault();
    hide("coinDataDisplay");
    reveal("portfolioDisplay");
    $("#myPortfolio").empty();
    portfolio.forEach(function(portfolioCoin) {
        // Creating a new button and li element for each coin and appending them to the ul in the html
        var portCoin = $("<li>");
        var coinBtn = $("<button>").text(portfolioCoin.name).attr("id", portfolioCoin.id).attr("class", "btn coin-btn list-group-item p-1 border border-black border-opacity-100 rounded-md mb-1").attr("style", "text-align: left;");
        portCoin.append(coinBtn);
        $("#myPortfolio").append(portCoin);
    });

    // Adding an event listener to each button just created
    $(".coin-btn").on("click", function(event) {
        event.preventDefault();
        var coinVar4 = new Coin($(this).text(), $(this).attr("id"));
        updateRenderStore(coinVar4);
    });
});

// This function does double duty by finding the index of a pre-existing object in an array
// or returning -1 if the object with the searched property is not already in the array
// (like the built-in IndexOf() method)
// It takes in an array of similar objects, a property of those objects, and a searched item to be compared
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
    reveal("coinDataDisplay");
    renderCoinData(coinFriend.id);
    storeCoins();
    renderHistory();
}

// This function dynamically creates the search history list
function renderHistory() {

    // First the html list is emptied, then we loop through every coin in the coinHistory array
    $("#coinHistory").empty();
    coinHistory.forEach(function(searchedCoin) {

        // Creating a new button and li element for each coin and appending them to the ul in the html
        var newCoin1 = $("<li>");
        var coinButton = $("<button>").text(searchedCoin.name).attr("id", searchedCoin.id).attr("class", "btn coin-btn list-group-item p-1 border border-black border-opacity-100 rounded-md mb-1").attr("style", "text-align: left;");
        newCoin1.append(coinButton);
        $("#coinHistory").append(newCoin1);
    });

    // Adding an event listener to each button just created
    $(".coin-btn").on("click", function(event) {
        event.preventDefault();
        var coinVar3 = new Coin($(this).text(), $(this).attr("id"));
        updateRenderStore(coinVar3);
    });
}

// clear the history when clicked
$("#clearHistory").on("click", function(event) {
    event.preventDefault();
    coinHistory = [];
    storeCoins();
    renderHistory();
});

// this function makes an api call to get the top 10 coins by market cap
// then dynamically generates html 
function renderTop10() {
    $("#top10").empty();
    var top10URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";
    $.ajax({url: top10URL, method: "GET"}).then(function(response) {
        for (var i = 0; i < 10; i++) {
            var newCoin2 = $("<li>");
            var coinButton = $("<button>").text(response[i].name).attr("id", response[i].id).attr("class", "btn top10btn list-group-item p-1 border border-black border-opacity-100 rounded-md mb-1").attr("style", "text-align: left;");
            newCoin2.append(coinButton);
            $("#top10").append(newCoin2);
        }
        $(".top10btn").on("click", function(event) {
            event.preventDefault();
            var topCoin = new Coin($(this).text(), $(this).attr("id"));    
            updateRenderStore(topCoin);
        });
    });
}

function renderCoinData(coinVar) {

    // empty all the things
    $("#coinIMG").empty(), $("#coinName").empty(), $("#coinSymbol").empty(), $("#currentPrice").empty();
    $("#projectHomepage").empty(), $("#projectDescription").empty();
    $("#marketCap").empty(), $("#tradingVolume").empty();
    $("#maxSupply").empty(), $("#circulatingSupply").empty();
    $("#ATH").empty(), $("#ATHdate").empty();

    var queryURL = coinSearchBaseURL + coinVar + coinSearchEndURL;
    $.ajax({url: queryURL, method: "GET"}).then(function(response) {
        $("#coinIMG").attr("src", response.image.thumb);
        $("#coinName").text(response.name);
        $("#coinSymbol").text("(" + response.symbol + ")");
        $("#currentPrice").text("Current Price: $" + response.market_data.current_price.usd.toLocaleString());
        
        var myCoin = new Coin(response.name, response.id);
        var indX = IndexOfArrayObject(portfolio, "id", myCoin.id);
        if (indX !== -1) {
            $("#portfolioBtn").text("Remove from Portfolio");
        } else {
            $("#portfolioBtn").text("Add to Portfolio");
        }

        $("#portfolioBtn").attr("class", "block md:inline md:float-right p-1 border border-black border-opacity-100 rounded-md");

        $("#portfolioBtn").on("click", function(event) {
            event.preventDefault();
            var indX2 = IndexOfArrayObject(portfolio, "id", myCoin.id);
            if (indX2 !== -1) {
                portfolio.splice(indX2, 1);
                $("#portfolioBtn").text("Add to Portfolio");
            } else {
                portfolio.unshift(myCoin);
                $("#portfolioBtn").text("Remove from Portfolio");
            }
            storePortfolio();
            console.log(portfolio);
        });

        $("#projectHomepage").text(response.links.homepage[0]).attr("href", response.links.homepage[0]);

        var descriptionString = response.description.en;
        var parsedDescription = jQuery.parseHTML(descriptionString);
        
        parsedDescription.forEach(function(item) {
            $("#projectDescription").append(item);
        });

        $("#marketCap").text("$" + response.market_data.market_cap.usd.toLocaleString());
        $("#tradingVolume").text("$" + response.market_data.total_volume.usd.toLocaleString());

        if (response.market_data.max_supply !== null) {
            $("#maxSupply").text(response.market_data.max_supply.toLocaleString());
        } else {
            $("#maxSupply").text("there is no defined maximum supply for this coin");
        }

        $("#circulatingSupply").text(response.market_data.circulating_supply.toLocaleString());

        $("#ATH").text("$" + response.market_data.ath.usd.toLocaleString() + " on " + response.market_data.ath_date.usd.slice(0, 10));
    });
}

// do api calls and rendering when clicked
$("#searchButton").on("click", function(event) {
    event.preventDefault();

    // grab and format the input
    var userCoin = $("#coinSearch").val().trim();
    $("#coinSearch").empty();

    // verify coin exists
    // add this to local storage?
    $.ajax({url: supportedCoinsURL, method: "GET"}).then(function(response) {
        coinSupported = false;

        // check the list of supported coins
        for (var i = 0; i < response.length; i++) {

            // compare user input to the id/symbol/name of supported coins
            if (userCoin === response[i].id ||
                userCoin === response[i].symbol ||
                userCoin === response[i].name ||
                userCoin.toLowerCase() === response[i].id ||
                userCoin.toLowerCase() === response[i].symbol ||
                userCoin.toLowerCase() === response[i].name) {
            
                // if we get a match, create new coin object with response data
                var newCoin = new Coin(response[i].name, response[i].id);
            
                // update this variable to note that the coin is supported
                coinSupported = true;
            }
        }
        if (coinSupported === false) {
            alert("The searched coin is not supported by coingecko. Please try searching for another coin.")
        } else if (coinSupported === true) {
            updateRenderStore(newCoin);
        }
    });
});

var retrievedCoins = localStorage.getItem("coins");
if (retrievedCoins !== null) {
    coinHistory = JSON.parse(retrievedCoins);
}

var retrievedPortfolio = localStorage.getItem("portfolio");
if (retrievedPortfolio !== null) {
    portfolio = JSON.parse(retrievedPortfolio);
}

renderTop10();
renderHistory();

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