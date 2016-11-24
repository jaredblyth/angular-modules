// SET OF FACTORY FUNCTIONS FOR SORTING OBJECTS & FINDING INDEXES etc

(function () {
    'use strict';

    angular.module('jmbObjectSort', [])
    
    
        .factory('jmbObjectSortFactory', function () {
  
            return {
                
                
                // Search an object and return the index of the searched property
                indexOfObject: function (object, searchTerm, property) {
                    
                    for(var i = 0, len = object.length; i < len; i++) {
        
                        if (object[i][property] === searchTerm) return i;
    
                    }
    
                    return -1;

                }

            }
        });
     
})();