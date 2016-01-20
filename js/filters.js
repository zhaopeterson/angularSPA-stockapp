'use strict';

stockApp.filter('toDecimal2', function() {
        return function(string) {
            if(string) {
                var point = string.indexOf(".");
                return string.slice(0, parseInt(point+3)) + "%";
            }
        }
    });


