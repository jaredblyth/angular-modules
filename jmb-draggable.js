// DIRECTIVE FOR CREATING DRAG & DROP HTML DIVS & ASSOCIATED JAVASCRIPT EVENTS
// There is a setPosition() function within this directive that sets the CSS of DIV to match screen position
// Or you can pass the event back to the controller via (if (drag) drag(e)) & (if (stop) stop(e));
// Refer http://jsfiddle.net/zargyle/35z4J/1/

// EXAMPLE HTML / CSS
//<div ng-app="jmbDraggable" ng-controller="jmbDraggableCtrl">
//    
//    <style>
//      #container {
//         width : 300px;
//         height: 300px;
//         background-color: black;
//      }
//
//      .shape {
//          position: absolute;
//          width : 40px;
//          height: 40px;
//          background-color: white;
//      }
//    </style>
//
//    <div id="container">
//        <div class="shape" jmb-draggable='dragOptions'></div>
//    </div>
//</div>

// EXAMPLE CONTROLLER
//.controller('jmbDraggableCtrl', function($scope) { 
//    $scope.dragOptions = {
//        start: function(e) {
//          console.log("STARTING");
//        },
//        drag: function(e) {
//          console.log("DRAGGING");
//        },
//        stop: function(e) {
//          console.log("STOPPING");
//        },
//        container: 'container'
//    }
//
//})

(function () {
    'use strict';

    angular.module('jmbDraggable', [])

        .directive('jmbDraggable', function($document) {
          return {
            restrict: 'A',
            scope: {
              dragOptions: '=jmbDraggable'
            },
            link: function(scope, elem, attr) {
              var startX, startY, x = 0, y = 0,
                  start, stop, drag, container;

              var width  = elem[0].offsetWidth,
                  height = elem[0].offsetHeight;

              // Obtain drag options
              if (scope.dragOptions) {
                start  = scope.dragOptions.start;
                drag   = scope.dragOptions.drag;
                stop   = scope.dragOptions.stop;
                var id = scope.dragOptions.container;
                if (id) {
                    container = document.getElementById(id).getBoundingClientRect();
                }
              }

              // Bind mousedown event
              elem.on('mousedown', function(e) {
                e.preventDefault();
                startX = e.clientX - elem[0].offsetLeft;
                startY = e.clientY - elem[0].offsetTop;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
                if (start) start(e);
              });

              // Handle drag event
              function mousemove(e) {
                y = e.clientY - startY;
                x = e.clientX - startX;
                //setPosition();
                if (drag) drag(e);
              }

              // Unbind drag events
              function mouseup(e) {
                $document.unbind('mousemove', mousemove);
                $document.unbind('mouseup', mouseup);
                if (stop) stop(e);
              }

              // Move element, within container if provided
              function setPosition() {
                if (container) {
                  if (x < container.left) {
                    x = container.left;
                  } else if (x > container.right - width) {
                    x = container.right - width;
                  }
                  if (y < container.top) {
                    y = container.top;
                  } else if (y > container.bottom - height) {
                    y = container.bottom - height;
                  }
                }

                elem.css({
                  top: y + 'px',
                  left:  x + 'px'
                });

              }
                
        
                
            }
          }

        });

})();