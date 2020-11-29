// Empty array storing price for each day
var daysArr = [];
var graphBase = "https://image-charts.com/chart?cht=ls&chs=400x300&chd=a:";
var graphEnd = "&chxt=x,y&chxl=1:";
var graphURL;
var prices1 = [];
var highVal;
var lowVal;
var yAxis = [];
var xAxis = [];
var chartJsURL = "https://image-charts.com/chart.js/2.8.0?bkg=white&c=";

var chartURL = "https://image-charts.com/chart?chd=s%3AithankYouGodformostthisamazingdayforthel&chs=700x125&cht=lc&chxl=1%3A%7CApr%7CMay%7CJune&chxt=x%2Cy";

var qURL = "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=5&interval=daily";
$.ajax({url: qURL, method: "GET"}).then(function(resp1) {
    for (var j = 0; j < resp1.prices.length; j++) {
        prices1.push(resp1.prices[j][1].toFixed(4));
    }
    highVal = (Math.max(...prices1));
    lowVal = (Math.min(...prices1));

    var days = 5;

    for (var l = 0; l < days + 1; l++) {
        xAxis.push(l);
    }

    var spread = highVal - lowVal;
    var increment = spread/days;
    var lowY = lowVal - increment;
    yAxis.push(lowY);
    for (var k = 0; k < days + 2; k++) {
        lowY += increment;
        yAxis.push(lowY);
    }
    const ctx = document.getElementById('chart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    data: prices1
                }
            ],
            labels: yAxis
        }
    });
})
/* .then(function() {



    var chartJsURL = `https://image-charts.com/chart.js/2.8.0?bkg=white&c={type:"line",data:{labels:${yAxis},datasets:[{${prices1}}]}}`;
    var chartJsURL1 = "https://image-charts.com/chart.js/2.8.0?bkg=white&c={type:'line',data:{labels:${yAxis},datasets:[{data:${prices1}}]}}";

    console.log(chartJsURL);



    prices1.forEach(function(prc) {
        graphBase += prc + ",";
    });
    var gBase1 = graphBase.slice(0, -1);
    yAxis.forEach(function(unit) {
        graphEnd += "|" + unit.toFixed(2);
    });
    gURL = gBase1 + graphEnd;
    console.log(gURL);
}); */


/* //Event listener for button
$("#btn").on("click", function() {
    $("#chart").empty()
    //Name of coin for search string
    var name = prompt("name of coin")
    //Number of days for search string
    var days = prompt("number of days") - 1
    //Query string for ajax call
    var queryUrl = `https://api.coingecko.com/api/v3/coins/${name}/market_chart?vs_currency=usd&days=${days}&interval=daily`
    var tURL = 'https://api.coingecko.com/api/v3/coins/${name}/market_chart?';

    //Ajax call to Coin Gecko API
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function(response){
        console.log(response)
        //Looping over the results to push into the graph search string
        for (i = 0; i < daysArr.length; i++) {
            var prices = (response.prices[i][1].toFixed(4))
            console.log(prices)
            daysArr.push(prices)
            
        }
        
            daysArr.forEach(function(price) {
                graphBase += "|" + price 
                graphEnd += "|" + price
                
            })
            
            graphURL = graphBase + graphEnd
            console.log(graphURL);
        }) */

/*     $.ajax({url: graphURL, method: "GET"}).then(function(resp) {

    }); */