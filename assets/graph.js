// Empty array storing price for each day
var daysArr = []
var graphBase = "https://image-charts.com/chart?cht=bvg&chs=500x200&chd=t:"
var graphEnd = "&chl="
var graphURL 
//Event listener for button
$("#btn").on("click", function() {
    $("#chart").empty()
    //Name of coin for search string
    var name = prompt("name of coin")
    //Number of days for search string
    var days = prompt("number of days") - 1
    //Query string for ajax call
    var queryUrl = `https://api.coingecko.com/api/v3/coins/${name}/market_chart?vs_currency=usd&days=${days}&interval=daily`
    

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
        })

    $.ajax({url: graphURL, method: "GET"}).then(function(resp) {

    });
       


        
       
        
        
            
        
    })
    

        
