// FILTERS TO 'CONVERT' A BLANK STRING AND RETURN IN ITS PLACE EITHER THE CURRENT DATE OR CURRENT YEAR

(function () {
    'use strict';

    angular.module('jmbNumberWithoutComma', [])
    
        .filter('numberWithoutCommaFilter',['$filter',  function($filter) {
    
                return function(input) {
        
                    return (input)?input.toString().trim().replace(",",""):null;
                    
                };
        }]);
    
})();