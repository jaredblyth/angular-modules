// A DIRECTIVE TO ADD A RIGHT-SIDE MOUSE CLICK TO AN ELEMENT

(function () {
    'use strict';

    angular.module('jmbRightClick', [])

        .directive('jmbRightClick', function($parse) {
            
            return function(scope, element, attrs) {
                var fn = $parse(attrs.ngRightClick);
                element.bind('contextmenu', function(event) {
                    scope.$apply(function() {
                        event.preventDefault();
                        fn(scope, {$event:event});
                    });
                });
            };
        
        });
    
})();