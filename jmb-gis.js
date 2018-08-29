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

                },
                
                
                
                // Convert Well-Known Text (WKT) to geoJSON
                wktToGeojson: function (wktString) {
                    
                    //refer to https://github.com/mapbox/wellknown for more info

                    var numberRegexp = /^[-+]?([0-9]*\.[0-9]+|[0-9]+)([eE][-+]?[0-9]+)?/;


                    function parse(_) {

                        console.log('Started parsing WKT to GeoJSON');

                        var parts = _.split(";"),
                            _ = parts.pop(),
                            srid = (parts.shift() || "").split("=").pop();

                        var i = 0;

                        function $(re) {
                            var match = _.substring(i).match(re);
                            if (!match) return null;
                            else {
                                i += match[0].length;
                                return match[0];
                            }
                        }

                        function crs(obj) {
                            if (obj && srid.match(/\d+/)) {
                                obj.crs = {
                                    type: 'name',
                                    properties: {
                                        name: 'urn:ogc:def:crs:EPSG::' + srid
                                    }
                                };
                            }

                            console.log('Finished parsing WKT to GeoJSON - successfully returned ' + obj.type);
                            return obj;
                        }

                        function white() { $(/^\s*/); }

                        function multicoords() {
                            white();
                            var depth = 0, rings = [], stack = [rings],
                                pointer = rings, elem;

                            while (elem =
                                $(/^(\()/) ||
                                $(/^(\))/) ||
                                $(/^(\,)/) ||
                                $(numberRegexp)) {
                                if (elem == '(') {
                                    stack.push(pointer);
                                    pointer = [];
                                    stack[stack.length - 1].push(pointer);
                                    depth++;
                                } else if (elem == ')') {
                                    pointer = stack.pop();
                                    // the stack was empty, input was malformed
                                    if (!pointer) return;
                                    depth--;
                                    if (depth === 0) break;
                                } else if (elem === ',') {
                                    pointer = [];
                                    stack[stack.length - 1].push(pointer);
                                } else if (!isNaN(parseFloat(elem))) {
                                    pointer.push(parseFloat(elem));
                                } else {
                                    return null;
                                }
                                white();
                            }

                            if (depth !== 0) return null;
                            return rings;
                        }

                        function coords() {
                            var list = [], item, pt;
                            while (pt =
                                $(numberRegexp) ||
                                $(/^(\,)/)) {
                                if (pt == ',') {
                                    list.push(item);
                                    item = [];
                                } else {
                                    if (!item) item = [];
                                    item.push(parseFloat(pt));
                                }
                                white();
                            }
                            if (item) list.push(item);
                            return list.length ? list : null;
                        }

                        function point() {
                            if (!$(/^(point)/i)) return null;
                            white();
                            if (!$(/^(\()/)) return null;
                            var c = coords();
                            if (!c) return null;
                            white();
                            if (!$(/^(\))/)) return null;
                            return {
                                type: 'Point',
                                coordinates: c[0]
                            };
                        }

                        function multipoint() {
                            if (!$(/^(multipoint)/i)) return null;
                            white();
                            var c = multicoords();
                            if (!c) return null;
                            white();
                            return {
                                type: 'MultiPoint',
                                coordinates: c
                            };
                        }

                        function multilinestring() {
                            if (!$(/^(multilinestring)/i)) return null;
                            white();
                            var c = multicoords();
                            if (!c) return null;
                            white();
                            return {
                                type: 'MultiLineString',
                                coordinates: c
                            };
                        }

                        function linestring() {
                            if (!$(/^(linestring)/i)) return null;
                            white();
                            if (!$(/^(\()/)) return null;
                            var c = coords();
                            if (!c) return null;
                            if (!$(/^(\))/)) return null;
                            return {
                                type: 'LineString',
                                coordinates: c
                            };
                        }

                        function polygon() {
                            if (!$(/^(polygon)/i)) return null;
                            white();
                            return {
                                type: 'Polygon',
                                coordinates: multicoords()
                            };
                        }

                        function multipolygon() {
                            if (!$(/^(multipolygon)/i)) return null;
                            white();
                            return {
                                type: 'MultiPolygon',
                                coordinates: multicoords()
                            };
                        }

                        function geometrycollection() {
                            var geometries = [], geometry;

                            if (!$(/^(geometrycollection)/i)) return null;
                            white();

                            if (!$(/^(\()/)) return null;
                            while (geometry = root()) {
                                geometries.push(geometry);
                                white();
                                $(/^(\,)/);
                                white();
                            }
                            if (!$(/^(\))/)) return null;

                            return {
                                type: 'GeometryCollection',
                                geometries: geometries
                            };
                        }

                        function root() {
                            return point() ||
                                linestring() ||
                                polygon() ||
                                multipoint() ||
                                multilinestring() ||
                                multipolygon() ||
                                geometrycollection();
                        }

                        return crs(root());
                    }
                    
                    return parse(wktString);
                }

            }
        });
     
})();