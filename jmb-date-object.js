// SET OF SERVICES, FACTORIES & DIRECTIVES FOR CREATING DATE OBJECTS (singles or doubles), CHANGING DATE VIA UI, AND VALIDAING DATE CHANGES
// Directives in this module require the 'jmbDatePicker' & 'jmbValidation' modules

(function () {
    'use strict';

    angular.module('jmbDateObject', ['jmbDatePicker','jmbValidation'])
    
    
    
        // SERVICE TO VALIDATE A DATE, OR DETERMINE IF TWO DATES ARE IN CORRECT ORDER
        .service('jmbDateValidationService', function () {
        
            console.log('created date validation service');
  
            this.validateDate = function (value) {

                // If the date value is NaN, then it can't be valid
                var valid = !isNaN(value);
                console.log('validating date value ' + value + ' -> valid:' + valid);
                
                return valid;       
            };
        
            this.validateDateOrder = function (value1,value2) {

                // Value 2 shouldn't be less than value1
                var valid = !(value2 < value1);
                console.log('validating date order of ' + value1 + ' & ' + value2 + ' -> valid:' + valid);
                
                return valid;       
            };

        })
    
    
    
        // FACTORY FOR CREATING DATE OBJECTS THAT CARRY INFORMATION FOR SELF-VALIDATION
        .factory('jmbDateObjectFactory', function (jmbDateValidationService) {
  
            return {
                
                // Create a SINGLE date object
                single: function (name,value,formatParameter) {
                    
                    var dateObject = {};
                    
                    var name = name;
                    var value = new Date(value);
                    var format = 'dd/MM/yyyy'; // Default value as this parameter is optional
                    if(formatParameter){format = formatParameter;}
                    var valid = jmbDateValidationService.validateDate(value); // Validate the date
                    var message = name + ' must be in ' + format + ' format';
    
                    dateObject = {
                        name:name,
                        value:value,
                        format:format,
                        valid:valid,
                        message:message
                    };
                    
                    console.log(dateObject);
	
                    return dateObject;

                },
                
                // Create a DOUBLE date object
                double: function (name1,value1,name2,value2,formatParameter) {
                    
                    var dateObject = {};
                    
                    var name1 = name1;
                    var value1 = new Date(value1);
                    var name2 = name2;
                    var value2 = new Date(value2);
                    var format = 'dd/MM/yyyy'; // Default value as this parameter is optional
                    if(formatParameter){format = formatParameter;}
                    var valid1 = jmbDateValidationService.validateDate(value1); // Validate the date
                    var message1 = name1 + ' must be in ' + format + ' format';
                    var valid2 = jmbDateValidationService.validateDate(value2); // Validate the date
                    var message2 = name2 + ' must be in ' + format + ' format';
                    var validOrder = jmbDateValidationService.validateDateOrder(value1,value2); // Validate the date order
                    var orderMessage = name2 + ' cannot be before ' + name1;
    
                    dateObject = {
                        name1:name1,
                        value1:value1,
                        name2:name2,
                        value2:value2,
                        format:format,
                        valid1:valid1,
                        message1:message1,
                        valid2:valid2,
                        message2:message2,
                        validOrder: validOrder,
                        orderMessage: orderMessage
                    };
                    
                    console.log(dateObject);
	
                    return dateObject;

                },
                
                // Convert date to 'YYYY-MM-DD' string for sending as API URL parameter
                string: function (date) {
                    
                    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                    
                }

            }
        })
    
    
        
        // DIRECTIVE FOR SINGLE DATE BLOCK (DATEPICKER,LABEL & VALIDATION MESSAGE)
        // Requires the 'jmbDatePicker' & 'jmbValidation' modules
        .directive('jmbDateObject', function (jmbDateValidationService) {  
        
//            var tpl = "<div><label>{{ngModel.name}}:</label><jmb-date-picker date-value='ngModel.value'></jmb-date-picker><input type='text' ng-model='ngModel.value' size='80' />{{ngModel.value | date:ngModel.format}}<jmb-validation ng-show='!ngModel.valid' message={{ngModel.message}}></jmb-validation></div>";
        
            var tpl = "<div><label>{{ngModel.name}}:</label><jmb-date-picker date-value='ngModel.value'></jmb-date-picker><jmb-validation ng-show='!ngModel.valid' message={{ngModel.message}}></jmb-validation></div>";

            return {
                
                restrict: 'E',
                template: tpl,
                require: 'ngModel',
                scope: {
                    ngModel: '='
                },
                
                link: function(scope, elem, attr, ngModelCtrl) {

                    ngModelCtrl.$render = function() {  
                        ngModelCtrl.$viewValue = scope.ngModel;
                    };
            
                    scope.$watch('ngModel.value', function(newValue,oldValue) {
                        if (newValue !== oldValue) // This IF stops this watcher firing during initilisation
                            {
                                ngModelCtrl.$setViewValue(scope.ngModel);
                                console.log('date value change');
                                scope.validate();
                            }

                    });
                    
                    scope.validate = function() {  
                        scope.ngModel.valid = jmbDateValidationService.validateDate(scope.ngModel.value);
                        console.log('calling jmbDateValidationService');
                        
                        scope.$emit('updateSelectedDate', scope.ngModel.value);
                 
                    };

                }
            };
        })
    
    
    
        // DIRECTIVE FOR DOUBLE DATE BLOCK (2 x DATEPICKERS,LABELS & VALIDATION MESSAGES)
        // Requires the 'jmbDatePicker' & 'jmbValidation' modules
        .directive('jmbDateDouble', function (jmbDateValidationService) {  
        
            var tpl = "<div><label>{{ngModel.name1}}:</label><jmb-date-picker date-value='ngModel.value1'></jmb-date-picker>&nbsp;&nbsp;<label>{{ngModel.name2}}:</label><jmb-date-picker date-value='ngModel.value2'></jmb-date-picker><jmb-validation ng-show='!ngModel.valid1' message={{ngModel.message1}}></jmb-validation><jmb-validation ng-show='!ngModel.valid2' message={{ngModel.message2}}></jmb-validation><jmb-validation ng-show='!ngModel.validOrder' message={{ngModel.orderMessage}}></jmb-validation></div>";

            return {
                
                restrict: 'E',
                template: tpl,
                require: 'ngModel',
                scope: {
                    ngModel: '='
                },
                
                link: function(scope, elem, attr, ngModelCtrl) {

                    ngModelCtrl.$render = function() {  
                        ngModelCtrl.$viewValue = scope.ngModel;
                    };
            
                    scope.$watch('ngModel.value1', function() {  
                        ngModelCtrl.$setViewValue(scope.ngModel);
                        console.log('date1 value change');
                        scope.validate();
                    });
                    
                    scope.$watch('ngModel.value2', function() {  
                        ngModelCtrl.$setViewValue(scope.ngModel);
                        console.log('date2 value change');
                        scope.validate();
                    });
                    
                    scope.validate = function() {  
                        scope.ngModel.valid1 = jmbDateValidationService.validateDate(scope.ngModel.value1);
                        scope.ngModel.valid2 = jmbDateValidationService.validateDate(scope.ngModel.value2);
                        scope.ngModel.validOrder = jmbDateValidationService.validateDateOrder(scope.ngModel.value1,scope.ngModel.value2);
                        console.log('calling jmbDateValidationService');
                 
                    };

                }
            };
        })
    
    
    
        // DIRECTIVE FOR DOUBLE DATE BLOCK WITH BUTTON FOR EMITTING THE DATES FOR A FUNCTION
        // Requires the 'jmbDatePicker' & 'jmbValidation' modules
        .directive('jmbDateButton', function (jmbDateValidationService,$rootScope) {  
        
            var tpl = "<div style='margin:20px 0px 0px 0px;'><label>{{ngModel.name1}}:</label><jmb-date-picker date-value='ngModel.value1'></jmb-date-picker>&nbsp;&nbsp;<label>{{ngModel.name2}}:</label><jmb-date-picker date-value='ngModel.value2'></jmb-date-picker>&nbsp;<button class='btn btn-success' ng-click='emit()' ng-disabled='!ngModel.valid1 || !ngModel.valid2 || !ngModel.validOrder || gif'>{{button}}</button><jmb-validation ng-show='!ngModel.valid1' message={{ngModel.message1}}></jmb-validation><jmb-validation ng-show='!ngModel.valid2' message={{ngModel.message2}}></jmb-validation><jmb-validation ng-show='!ngModel.validOrder' message={{ngModel.orderMessage}}></jmb-validation></div>";

            return {
                
                restrict: 'E',
                template: tpl,
                require: 'ngModel',
                scope: {
                    ngModel: '=',
                    button: '@button'
                },
                
                link: function(scope, elem, attr, ngModelCtrl) {

                    ngModelCtrl.$render = function() {  
                        ngModelCtrl.$viewValue = scope.ngModel;
                    };
            
                    scope.$watch('ngModel.value1', function() {  
                        ngModelCtrl.$setViewValue(scope.ngModel);
                        console.log('date1 value change');
                        scope.validate();
                    });
                    
                    scope.$watch('ngModel.value2', function() {  
                        ngModelCtrl.$setViewValue(scope.ngModel);
                        console.log('date2 value change');
                        scope.validate();
                    });
                    
                    scope.validate = function() {  
                        scope.ngModel.valid1 = jmbDateValidationService.validateDate(scope.ngModel.value1);
                        scope.ngModel.valid2 = jmbDateValidationService.validateDate(scope.ngModel.value2);
                        scope.ngModel.validOrder = jmbDateValidationService.validateDateOrder(scope.ngModel.value1,scope.ngModel.value2);
                        console.log('calling jmbDateValidationService');
                 
                    };
                    
                    scope.emit = function() {  
                        scope.$emit('dateButtonClick', scope.ngModel);
                        console.log('emitting dateButtonClick');
                    };
                    
                    
                    // Watch $rootScope.gif and disable button when it is showing
                    $rootScope.$watch('gif', function(newVal, oldVal) {
                        scope.gif = newVal;
                    });

                }
            };
        })
    
    
    
        // DIRECTIVE FOR SWITCHING BETWEEN SINGLE DATE OR DATE RANGE (USES DOUBLE DATE OBJECT)
        // Requires the 'jmbDatePicker' & 'jmbValidation' modules
        .directive('jmbDateSwitch', function (jmbDateValidationService) {  
        
            var tpl = "<div><select ng-model='ngModel.switch' style='cursor:pointer;'><option value='false'>On</option><option value='true'>Between</option></select><jmb-date-picker date-value='ngModel.value1'></jmb-date-picker><span ng-show='ngModel.switch'>&nbsp;<label>&amp;</label>&nbsp;<jmb-date-picker date-value='ngModel.value2'></jmb-date-picker></span><jmb-validation ng-show='!ngModel.valid1' message={{ngModel.message1}}></jmb-validation><jmb-validation ng-show='!ngModel.valid2' message={{ngModel.message2}}></jmb-validation><span ng-show='ngModel.switch'><jmb-validation ng-show='!ngModel.validOrder' message={{ngModel.orderMessage}}></jmb-validation></span></div>";

            return {
                
                restrict: 'E',
                template: tpl,
                require: 'ngModel',
                scope: {
                    ngModel: '='
                },
                
                link: function(scope, elem, attr, ngModelCtrl) {
                    
                    scope.ngModel.switch = false;

                    ngModelCtrl.$render = function() {  
                        ngModelCtrl.$viewValue = scope.ngModel;
                    };
            
                    scope.$watch('ngModel.value1', function() {  
                        ngModelCtrl.$setViewValue(scope.ngModel);
                        console.log('date1 value change');
                        scope.validate();
                    });
                    
                    scope.$watch('ngModel.value2', function() {  
                        ngModelCtrl.$setViewValue(scope.ngModel);
                        console.log('date2 value change');
                        scope.validate();
                    });
                    
                    scope.validate = function() {  
                        scope.ngModel.valid1 = jmbDateValidationService.validateDate(scope.ngModel.value1);
                        scope.ngModel.valid2 = jmbDateValidationService.validateDate(scope.ngModel.value2);
                        scope.ngModel.validOrder = jmbDateValidationService.validateDateOrder(scope.ngModel.value1,scope.ngModel.value2);
                        console.log('calling jmbDateValidationService');
                 
                    };

                }
            };
        })
     
})();