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

market cap:

function renderTop10() {

    $("#top10").empty();
    var top10URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";
    $.ajax({url: top10URL, method: "GET"}).then(function(response) {
        for (var i = 1; i < 11; i++) {
            var newCoin = $("<li>").text(response[i].name).attr("id", response[i].name);
            $("#top10").apppend(newCoin);
        }
    })
}


// some logic to pull the top ten
    market_cap_rank

market data:
    current price:
        market_data.current_price.(currencyID)
    all time high:
        market_data.ath.(currencyID)
        market_data.ath_date
    all time low:
        market_data.atl.(currencyID)
    marketcap:
        market_data.market_cap.currencyID
    24h volume:
        market_data.total_volume.currencyID
    percent change:
        market_data.price_change_percentage_(timeID) (i think these are all in usd)

        market_data.price_change_24h_in_currency.(currencyID)

        market_data.price_change_percentage_(timeID)_in_currency.(currencyID)

    supply:
        market_data.total_supply
        market_data.max_suppy
        market_data.circulating_supply

developer data:
    developer_data.forks
    developer_data.code_additions_deletions_4_weeks.additions
    developer_data.code_additions_deletions_4_weeks.deletions
    developer_data.commit_count_4_weeks