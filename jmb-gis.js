// SET OF FACTORY FUNCTIONS FOR CALCULATING GEOGRAPHIC INFORMATION SYSTEM (GIS) INFORMATION

(function () {
    'use strict';

    angular.module('jmbGis', [])
    
    
        .factory('jmbGisFactory', function () {
  
            return {
                
                // Determine whether a point (array of longitude & latitude points) is contained within a polygon
                within: function (point, polygon) {

                    var x = point[0], y = point[1];
                    var inside = false;
                    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
                        var xi = polygon[i][0], yi = polygon[i][1];
                        var xj = polygon[j][0], yj = polygon[j][1];
                        var intersect = ((yi > y) != (yj > y))
                        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                        if (intersect) inside = !inside;
                    }
    
                    return inside;

                }

            }
        });
     
})();