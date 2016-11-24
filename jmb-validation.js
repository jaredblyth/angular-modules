// SIMPLE UI VALIDATION MESSAGE - just pass in a message and set an ng-show condition
// e.g. <input ng-model="who" /><jmb-validation message="Input must be real" ng-show="!who"></jmb-validation>

(function () {
    'use strict';

    angular.module('jmbValidation', [])
    
        .directive('jmbValidation', function () {
   
            return {
      
                restrict: 'E',
                scope: {
                    message: '@message'
                },
                
                link: function(scope, element, attrs) {

                    $(element).append('<p style="font-weight:bold;color:#a94442;margin-top:10px;"><span class="glyphicon glyphicon-warning-sign"></span>&nbsp;&nbsp;' + scope.message + '</p>');
                }
            }
        })
    
})();