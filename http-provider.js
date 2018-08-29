// CONFIG TO CONTROL ANGULAR'S $httpProvider
// i.e. PREVENT CACHING OF AJAX HTTP CALLS - INTERNET EXPLORER WON'T REFRESH PROPERLY OTHERWISE
// API must have a Access-Control-Allow-Headers for 'If-Modified-Since'

(function () {
    'use strict';

    angular.module('httpProviderConfig', [])
    
        .config(function ($httpProvider) {
    
            $httpProvider.defaults.cache = false;
            
            if (!$httpProvider.defaults.headers.get) 
                {
                    $httpProvider.defaults.headers.get = {};
                }
        
            // disable IE ajax request caching
            $httpProvider.defaults.headers.get['If-Modified-Since'] = '0';
    
        })
    
})();