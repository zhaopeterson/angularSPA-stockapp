'use strict';

stockApp.directive('stockQuote', function () {
  return {
        restrict: 'E',
        templateUrl: "directive-templates/quote.html"
    };
});

stockApp.directive('portfolioQuote', function () {
  return {
        restrict: 'E',
        templateUrl: "directive-templates/portfolio.html"
    };
});


stockApp.directive('tickerKeys', function() {
    return {
        restrict: 'A',
        link: function($scope, element, attrs, controller) {
            
            element.on('keydown', function(event) {
                if ((isAlphaKeyCode(event.keyCode) || isNavigationKeycode(event.keyCode))){
                    $scope.keyMsg = "Only Letters Please"; 
                    $scope.keyMsgShow = true;                             
                    return true;
                } else {
                    $scope.keyMsgShow = false;
                    
                    event.preventDefault();
                    
                }
            })
            // $scope.$watch('search', function(value){

            //     } 
            // });
        }
    }

    function isAlphaKeyCode(keyCode) {
        return  (event.keyCode >= 65 && event.keyCode <= 90)
    }

    function isNumericKeyCode(keyCode) {
        return (event.keyCode >= 48 && event.keyCode <=57)
            || (event.keyCode >= 96 && event.keyCode <= 105);
    }
    function isForwardSlashKeyCode(keycode) {
        return event.keyCode === 191;
    }
    function isNavigationKeycode(keyCode) {
        switch(keyCode) {
            case 8: //backspace
            case 35: //end
            case 36: //home
            case 37: //left
            case 38: //up
            case 39: //right
            case 40: //down
            case 45: //ins
            case 46: //del
                return true;
            default:
                return false;
        }
    }
});