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

                },
                
                
                
                // Convert Google Map polygon to Well-Known Text (WKT)
                gMapToWkt: function (polygon) {

                    var wkt = "MULTIPOLYGON((";
                    var paths = polygon.getPaths();

                    for(var i=0; i<paths.getLength(); i++)
                        {
                            var path = paths.getAt(i);

                            // Open a ring grouping in the Polygon Well Known Text
                            wkt += "(";
                            for(var j=0; j<path.getLength(); j++)
                                {
                                    // add each vertice and anticipate another vertice (trailing comma)
                                    wkt += path.getAt(j).lng().toString() +" "+ path.getAt(j).lat().toString() +",";
                                }

                            // Google's approach assumes the closing point is the same as the opening
                            // point for any given ring, so we have to refer back to the initial point
                            // and append it to the end of our polygon wkt, properly closing it.
                            //
                            // Also close the ring grouping and anticipate another ring (trailing comma)
                            wkt += path.getAt(0).lng().toString() + " " + path.getAt(0).lat().toString() + ")),";
                        }

                    // resolve the last trailing "," and close the Polygon
                    wkt = wkt.substring(0, wkt.length - 1) + ")";
                    
                    // See https://arthur-e.github.io/Wicket/sandbox-gmaps3.html - can add the wkt to map to see if its valid
                    return wkt;

                }

            }
        });
     
})();