var coinHistory = [];
var baseURL = "https://api.coingecko.com/api/v3";
var coinSearchBaseURL = "https://api.coingecko.com/api/v3/coins/";
var coinSearchEndURL = "?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true";
var queryURL = coinSearchBaseURL + coinInput + coinSearchEndURL;

// error object if coinInput is not valid
{
    "error": "Could not find coin with the given id"
}

// Same storage function as previous assignments
function storeCoins() {
    var stringyCoins = JSON.stringify(coinHistory);
    localStorage.setItem("coins", stringyCoins);
}

// Checking for duplicates in the array
function coinDuplicate(coin) {
    duplicate = false;
    coinHistory.forEach(function(coin1) {
        if (coin1 === coin) {
            duplicate = true;
        }
    });
    return duplicate;
}

// clear the history when clicked
$("#clearHistory").on("click", function(event) {
    event.preventDefault();
    coinHistory = [];
    storeCoins();
    renderHistory();
});

function renderTop10() {
    $("#top10").empty();
    var top10URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";
    $.ajax({url: top10URL, method: "GET"}).then(function(response) {
        for (var i = 0; i < 10; i++) {
            var newCoin = $("<li>").text(response[i].name).attr("id", response[i].name).attr("class", "top10btn");
            $("#top10").apppend(newCoin);
        }
    });

    $(".top10btn").on("click", function(event) {
        event.preventDefault();

        // Grabbing the coin name
        var topCoin = $(this).attr("id");

        // Move the coin to the top of the history
        if (coinDuplicate(topCoin) === true) {
            var indX = coinHistory.indexOf(topCoin);
            coinHistory.splice(indX, 1);
        }
        coinHistory.unshift(topCoin);

        renderCoinData(topCoin);
        storeCoins();
        renderHistory();
    });
}

function renderCoinData(coinVar) {

}

timeID: 24h, 7d, 14d, 30d, 60d, 200d, 1y
currencyID: usd, eur, gbp, btc, eth, etc...

image:
    $("#coinIMG").attr("src", response.image.thumb);
    response.image.thumb/small/large

website:
    $("#projectHomepage").text(response.links.homepage[0]);
    response.links.homepage[0]

github:
    $("#projectGithub").text(response.repos_url.github[0]);
    response.repos_url.github[0]

reddit:
    $("#projectSubreddit").text(response.subreddit_url);
    response.subreddit_url

description:
    $("#projectDescription").text(response.description);
    response.description


// some logic to pull the top ten
    market_cap_rank

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
    developer_data.commit_count_4_weeks