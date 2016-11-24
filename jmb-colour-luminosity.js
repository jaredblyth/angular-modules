// FILTER TO DETERMINE WHETHER TEXT SHOULD BE BLACK OR WHITE DEPENDING ON THE INPUT COLOUR

(function () {
    'use strict';

    angular.module('jmbColourLuminosity', [])
    
        .filter('colourLuminosityFilter',['$filter',  function($filter) {
    
                return function(colour) {
        
                    // This function is a javascript equivalent of PHP's built-in hexdec function
                    function hexdec(hex_string) {

                        hex_string = (hex_string + '').replace(/[^a-f0-9]/gi, '');
                        return parseInt(hex_string, 16);
   
                    }


                    // This is the actual function to determine luminosity
                    // Pass in the a colour as a HEX value
                    function luminosity(hex) {
 
                        var hex = hex.replace("#", "");
  
   
                        // Split up value depending on whether it contains 3 or 6 values
                        if(hex.length == 3) {
                            var r = hexdec(hex.substring(0,1) + hex.substring(0,1));
                            var g = hexdec(hex.substring(1,2) + hex.substring(1,2));
                            var b = hexdec(hex.substring(2,3) + hex.substring(2,3));
                        } else {
                            var r = hexdec(hex.substring(0,2));
                            var g = hexdec(hex.substring(2,4));
                            var b = hexdec(hex.substring(4,6));
                        }
  
  
                        // Use this formula to give the passed in colour a luminosity value
                        var color = 0.2126 * Math.pow(r/255, 2.2) + 0.7152 * Math.pow(g/255, 2.2) + 0.0722 * Math.pow(b/255, 2.2);


                        // Compare the passed in colour against the pre-determined threshold and return black or white
                        var substance_colour_luminosity_threshold = 0.4;
  
                        if (color < substance_colour_luminosity_threshold)
  
                            {return '#fff';}
  
                        else
  
                            {return '#000';}
  
                    }


                    return luminosity(colour);

                    
                };
        }]);
    
})();