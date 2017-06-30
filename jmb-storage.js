// FACTORY FUNCTION TO STORE DATA ON THE CLIENT SIDE
// IF CORDOVA IS NOT DETECTED THEN THIS IS ESSENTIALLY A DUPLICATE OF THE $cookies FUNCTION
// HOWEVER, IF CORDOVA IS DETECTED, THEN THE $cookies FUNCTION IS SWAPPED OUT TO USE LOCAL STORAGE
// THIS IS BECAUSE THE BROWSER IN CORDOVA APPS CANNOT ACCESS ANY COOKIES BUT CAN USE LOCAL STORAGE
// THEREFORE STORING ITEMS USING THIS MODULE ALLOWS YOU TO USE THE SAME CODE BASE FOR WEB APPS AND CORDOVA (PhoneGap) APPS AND HAVE THE BROWSER SWAP ITS BEHAVIOUR WHEN CORDOVA IS DETECTED

(function () {
    'use strict';

    angular.module('jmbStorage', [])
    
    
        .factory('jmbStorageFactory', function ($cookies) {
  
            return {
                
                // THIS FUNCTION IS CALLED BY EACH OF THE FUNCTIONS BELOW
                isCordovaApp: function () {
                    
                    var isCordovaApp = ((document.URL.indexOf('http://') === -1) && (document.URL.indexOf('https://') === -1));
                    
                    return isCordovaApp ;
  
                },
                
                
                // Store an item
                put: function (storageItemName,storageItemValue) {
                    
                    if(this.isCordovaApp() == true)
                        {
                            return localStorage.setItem(storageItemName,storageItemValue);
                        }
                    else
                        {
                            return $cookies.put(storageItemName,storageItemValue);
                        }
                    
                },
                
                
                // Retrieve a stored item
                get: function (storageItemName) {
                    
                    if(this.isCordovaApp() == true)
                        {
                            return localStorage.getItem(storageItemName);
                        }
                    else
                        {
                            return $cookies.get(storageItemName);
                        }
                    
                },
                
                
                // Remove a stored item
                remove: function (storageItemName) {
                    
                    if(this.isCordovaApp() == true)
                        {
                            return localStorage.removeItem(storageItemName);
                        }
                    else
                        {
                            return $cookies.remove(storageItemName);
                        }
                    
                }

            }
        });
     
})();