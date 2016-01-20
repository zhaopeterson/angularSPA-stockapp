'use strict'

var stockControllers = angular.module('stockControllers', []);

var myPortfolios = ['"YHOO"', '"GOOG"', '"MSFT"'];

stockControllers.controller('stockSearchController', ['$scope', '$http', function ($scope, $http ){
	var stockName = "";

	var fromDate = new Date(), 
		endDate = new Date();
	function resetDefaultDate(){

		fromDate.setDate(fromDate.getDate() - 30);
		endDate.setDate(endDate.getDate());
		return fromDate, endDate;
	}

	// Default is to set a 30 day period
	resetDefaultDate();

	document.dateForm.fromDate.value = formatDate(fromDate, "-");
	document.dateForm.endDate.value = formatDate(endDate, "-");

	// Query data from Yahoo Finance using the user input symbol
	var BASE_URL = 'http://query.yahooapis.com/v1/public/yql?q='

	// Query the portfolio stocks
	// This query is different from the following ones used in updating the chart, this is from
	// yahoo.finance.quotes
	var yql_p_query = 'select * from yahoo.finance.quotes where symbol in ('+myPortfolios.toString()+')';
		yql_p_query = BASE_URL + encodeURI(yql_p_query) + '&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';

	function generatePortfolios(query) {
		$http.get(query).success(function(data){
			$scope.portfolios = data.query.results.quote;
			console.log($scope.portfolios)

		}) //end of format date
	}

	generatePortfolios(yql_p_query);


	// This function is take the date string and format to YQL format YY-MM-DD
	function formatDate(date, divider) {
		var chosenday = new Date(date),
		month = (chosenday.getUTCMonth() + 1) <=9 ? "0" + (chosenday.getUTCMonth() + 1): (chosenday.getUTCMonth() + 1),
		day = chosenday.getUTCDate() <=9 ? "0" + chosenday.getUTCDate(): chosenday.getUTCDate(),
		year = chosenday.getUTCFullYear();
		return ("" + year + divider + month + divider + day);
	}

	function processData(data) {
				var stockData =[];
				var stockDate = ["x"],
					stockHigh = ["High"],
					stockLow = ["Low"];

				for (var key in data)	{
					if (data.hasOwnProperty(key)){
						
						if ((data[key].High !== null) && (data[key].Low !== null)) {
							stockDate.push(data[key].Date);
							stockHigh.push(parseInt(data[key].High));
							stockLow.push(parseInt(data[key].Low));
						}
					} // if not null
				} // fro loop
				stockData.push(stockDate, stockHigh, stockLow);
				return stockData			
			} // end of process data

	function generateChart(data){
				var chart = c3.generate({
					data: {
						x: "x",
						columns: data,
						axes: {
        					data: 'y2' // ADD
      					}
					},
					color: {
						pattern: ["#93c041", "#c50b2e", "#d49f1f", "#cde603", "#9b1223", "#e47994"]
        			},
					axis: {
						x: {
							type: "timeseries",
							tick: {
								format: "%Y-%m-%d"
							}
						},
						y2: {
				            show: true
				        }
					},//axis
				    grid: {
				        x: {
				            show: true
				        },
				        y: {
				            show: true
				        }
				        
				    },
					subchart: {
						show: true
					}
				}) //chart
			} // generateChart

	function updateChart(query)	{
		$http.get(query).success(function(data, status){

			if (data.query.results !== null) {
				var quotes = data.query.results.quote;

				$scope.stockQuotes = data.query.results.quote;
			
				$scope.stockResults = true;
				$scope.errorMsg = "";				
					
				generateChart(processData(quotes));

			} else {
				$scope.errorMsg = "No data found, you either entered a invalid ticker name or the data is not available at this time.";
				if (document.querySelector("#chart-container")){
					document.querySelector("#chart-container").innerHTML = "";
				}

			}
		})
	}

	function generateQuery(sn, fd, ed) {
		var query = 'select * from yahoo.finance.historicaldata where symbol in ("'+sn+'") and startDate = "'+ formatDate(fd, "-") +'" and endDate = "'+ formatDate(ed, "-") + '"';
 			query = BASE_URL + encodeURI(query) + '&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
 			return query;
	}

	$scope.search = function(){
		$scope.chartExist = true;
		$scope.stockName = $scope.symbol;

		stockName = $scope.stockName;

		stockName = stockName.toUpperCase();

 		updateChart(generateQuery(stockName, fromDate, endDate));
 		$scope.symbol = ""
 		//reset the portfolioExist value 
 		$scope.portfolioExist = false;

 		document.querySelector("#time-range-container").style.opacity = 1;
	} // end of search

	// Update the chart when user reset the dates
	document.dateForm.addEventListener("change", function(e){
		fromDate = new Date(document.dateForm.fromDate.value);
		endDate = new Date(document.dateForm.endDate.value);

		fromDate = fromDate.toUTCString();
		endDate = endDate.toUTCString();

		stockName = $scope.stockName;
		if (document.querySelector(".period-active")) {
			document.querySelector(".period-active").className = "";
		}

		updateChart(generateQuery(stockName, fromDate, endDate));
	}, false);

	// Update the charts when user click on time period
	document.querySelector("#timeRange").addEventListener("click", function(e){

		var daysToSubstract = parseInt(e.target.getAttribute("data-days"));

		endDate = new Date();
		endDate.setDate(endDate.getDate());

		fromDate = new Date();
		fromDate.setDate(endDate.getDate() - daysToSubstract);

		fromDate = fromDate.toUTCString();
		endDate = endDate.toUTCString();

		//stockName = $scope.stockName;

		if (document.querySelector(".period-active")){
			document.querySelector(".period-active").className = "";
		}
		e.target.className = "period-active";

		updateChart(generateQuery(stockName, fromDate, endDate));
	});

	document.querySelector("#add-to-portfolio").addEventListener("click", function(e){
		
		stockName = '"' + stockName + '"';

		if (myPortfolios.indexOf(stockName) == -1){
			
			$scope.portfolioExist = false;
			console.log("In if loop: ", $scope.portfolioExist);

			myPortfolios.push(stockName);
		
		} else {			
			$scope.portfolioExist = true;

		}
		var yql_updated_p_query = 'select * from yahoo.finance.quotes where symbol in ('+myPortfolios.toString()+')';
			yql_updated_p_query  = BASE_URL + encodeURI(yql_updated_p_query) + '&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
		
			generatePortfolios(yql_updated_p_query);

	})

}])

stockApp.controller('detailPortfolioController', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams){
	var BASE_URL = 'http://query.yahooapis.com/v1/public/yql?q='

	// Query the portfolio stocks
	// This query is different from the following ones used in updating the chart, this is from
	// yahoo.finance.quotes
	var yql_p_query = 'select * from yahoo.finance.quotes where symbol in ('+myPortfolios.toString()+')';
		yql_p_query = BASE_URL + encodeURI(yql_p_query) + '&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
	$http.get(yql_p_query).success(function(data){
		$scope.detailPortfolios = data.query.results.quote;
		console.log(data)
		$scope.whichPortfolio = $routeParams.itemId
	})
	
}])

stockApp.controller('lookupSymbolController', ['$scope', '$http', '$routeParams', function ($scope, $http, $routeParams){
	$http.get('js/symbolList.json').success(function(data){
		$scope.tickers = data.stock_tickers;
	})
	
}])


