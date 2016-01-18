var stockApp = angular.module('stockApp', [
  'ngRoute',
  'stockControllers'
]);

stockApp.config(['$routeProvider', function($routeProvider){
	$routeProvider.
	when("/searchStock", {
		templateUrl: "partials/stockquote.html",
		controller: "stockSearchController"
	}).
	when('/detailPortfolio/:itemId', {
		templateUrl: "partials/detailportfolio.html",
		controller: "detailPortfolioController"
	})
	.when("/lookupSymbol",{
		templateUrl: "partials/lookupsymbol.html",
		controller: "lookupSymbolController"
	})
	.otherwise ({
		redirectTo: "/searchStock"
	})

}])

