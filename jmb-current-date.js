// FILTERS TO 'CONVERT' A BLANK STRING AND RETURN IN ITS PLACE EITHER THE CURRENT DATE OR CURRENT YEAR

(function () {
    'use strict';

    angular.module('jmbCurrentDate', [])
    
        .filter('currentDateFilter',['$filter',  function($filter) {
    
                return function() {
        
                    return $filter('date')(new Date(), 'yyyy-MM-dd');
                    
                };
        }])
    
        .filter('currentYearFilter',['$filter',  function($filter) {
            
            return function() {
        
                return $filter('date')(new Date(), 'yyyy');
    
            };
        }]);
    
})();