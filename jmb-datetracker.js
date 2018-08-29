// A FILTER TO TRACK DATES USED IN THE UI SO THAT AS NEW MODULES ARE LOADED, THE DEFAULT DATES CAN BE SWAPPED WITH DATES TRACKED HERE (limit of six months applies to date ranges)
// Although not a technical dependency, $rootScope.startDate & $rootScope.endDate relationship & validation is based on objects from the jmbDateObject module (specifically a jmbDateObjectFactory.double) which are the objects being produced by the modules before passing them through here.

(function () {
    'use strict';

    angular.module('jmbDatetracker', [])
    
        .filter('jmbDatetrackerFilter',function($rootScope,toaster) {
    
                return function(type,days) {
                    
                    var date = null;
                    
                    // If both values in $rootScope.startDate && $rootScope.endDate not yet set, then use the default values passed into this function by the module instead of stored values
                    if(!$rootScope.startDate && !$rootScope.endDate)
                        {
                            date = new Date().setDate(new Date().getDate() + days);
                        }
                    
                    // Else we already have both a stored startDate & endDate
                    else    
                        {
                            // Check that the difference in date range is not more than 180 days (6 months)
                            //if(($rootScope.endDate - $rootScope.startDate) < 15552000000)
                            // Check that the difference in date range is not more than 365 days (12 months)
                            if(($rootScope.endDate - $rootScope.startDate) < 31536000000)
                                {
                                    // Map the correct stored date value to return date
                                    if(type == 'startDate')
                                        {
                                            date = $rootScope.startDate;
                                        }

                                    if(type == 'endDate')
                                        {
                                            date = $rootScope.endDate;
                                        }
                                }
                            
                            // If more than 180 days, then revert to using the values passed in to function
                            else 
                                {
                                    date = new Date().setDate(new Date().getDate() + days);
                                    $rootScope.startDate = null;
                                    $rootScope.endDate = null;
                                    if(type == 'startDate') // Only need to pop this toast once
                                        {toaster.pop('warning', "Reverted to default date range", "because dates were more than a year apart",10000);}
                                }
                        }         
        
                    return date;
                    
                };
        })
    
    
    
        // FUNCTION TO SET A JMB DATE OBJECT (specifically a jmbDateObjectFactory.double) AS $rootScope.startDate AND $rootScope.endDate
        .run(function ($rootScope) {
        
            $rootScope.jmbDatetrackerSet = function(dateObject) {

                // Looking for value1 & value2 which are properties of jmbDateObjectFactory.double
                // Checking also for validity
                if((dateObject.value1) && (dateObject.valid1 == true) && (dateObject.validOrder == true))
                    {
                        $rootScope.startDate = dateObject.value1;
                        console.log('New rootscope startdate');
                    }

                if((dateObject.value2) && (dateObject.valid2 == true) && (dateObject.validOrder == true))
                    {
                        $rootScope.endDate = dateObject.value2;
                        console.log('New rootscope enddate');
                    }
                
            };
        
        });
    
})();