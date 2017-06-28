// FILTER TO REMOVE DUPLICATE ENTRIES IN AN OBJECT ARRAY - i.e. show only unique values for the key

(function () {
    'use strict';

    angular.module('jmbUniqueValue', [])
    
        .filter('uniqueValueFilter',['$filter',  function($filter) {
    
                return function(collection, primaryKey) { //no need for secondary key
                  
                    var output = [], 
                    keys = [];
                    var splitKeys = primaryKey.split('.'); //split by period


                    angular.forEach(collection, function(item) {
                        var key = {};
                        angular.copy(item, key);
                        for(var i=0; i<splitKeys.length; i++){
                            key = key[splitKeys[i]];    //the beauty of loosely typed js :)
                        }

                        if(keys.indexOf(key) === -1) {
                          keys.push(key);
                          output.push(item);
                        }
                  });

                  return output;
                };


        }])
    
})();