/* port = [
    {id: "bitcoin", symbol: "btc", quantity: 5},
    {id: "ethereum", symbol: "eth", quantity: 10},
    {id: "chainlink", symbol: "link", quantity: 15},
    {id: "cardano", symbol: "ada", quantity: 20},
    {id: "polkadot", symbol: "dot", quantity: 25},
    {id: "ocean-protocol", symbol: "btc", quantity: 30},
    {id: "utrust", symbol: "utk", quantity: 35},
    {id: "unibright", symbol: "ubt", quantity: 40},
    {id: "rarible", symbol: "rari", quantity: 45},
    {id: "trustswap", symbol: "swap", quantity: 50},
    {id: "energy-web-token", symbol: "ewt", quantity: 55},
    {id: "polkastarter", symbol: "pols", quantity: 60}
]; */

function pieChart(portfolio) {
    const coinBaseURL = "https://api.coingecko.com/api/v3/simple/price?ids=";
    const coinEndURL = "&vs_currencies=usd";
    let idString = "";
    
    portfolio.forEach(coin => {
        if (coin.hasOwnProperty("quantity")) {
            idString += coin.id + "%2C";
            coin["usdValue"] = 0;
        }
    });
    
    idString = idString.slice(0, -3);
    const queryURL = coinBaseURL + idString + coinEndURL;
    
    $.ajax({url: queryURL, method: "GET"}).then(function(resp) {
        let usd = 0;
        portfolio.forEach(coin => {
            const apiNav = resp[coin.id];
            let usdVal = coin.quantity * apiNav.usd;
            coin.usdValue = usdVal;
            usd += usdVal;
        });
    
        usd += usdTotal;
    
        const data = [];
        const labels = [];
    
        const usdPercent = (usdTotal/usd)*100;
    
        console.log("usd value: " + usd);
        console.log(`usd: ${usdTotal}
        %usd: ${usdPercent}`)
    
        portfolio.forEach(coin => {
            const portPercent = (coin.usdValue/usd)*100;
            console.log(`${coin.symbol}: ${coin.quantity}
            in USD: ${coin.usdValue}
            %usd: ${portPercent}`);
            data.push(portPercent);
            labels.push(coin.symbol.toUpperCase());
        });
    
        data.push(usdPercent);
        labels.push('USD');
    
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: '%',
                    data: data,
                    backgroundColor: [
                        'rgba(0, 0, 255, 1)',
                        'rgba(255, 0, 0, 1)',
                        'rgba(0, 255, 0, 1)',
                        'rgba(238, 130, 238, 1)',
                        'rgba(255, 165, 0, 1)',
                        'rgba(0, 240, 232, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 241, 92, 1)'
                    ],
                    borderColor: [
                        'rgba(0, 0, 255, 1)',
                        'rgba(255, 0, 0, 1)',
                        'rgba(0, 255, 0, 1)',
                        'rgba(238, 130, 238, 1)',
                        'rgba(255, 165, 0, 1)',
                        'rgba(0, 240, 232, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(255, 241, 92, 1)'                ],
                    borderWidth: 1
                }]
            },
    /*         options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            } */
        });
    });
}

/* pieChart(port); */

module.exports = pieChart;  