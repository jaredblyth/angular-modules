// THIS DIRECTIVE CREATES A CSV FILE UPLOAD BUTTON
// IT CAN BE USED BY SIMPLY ADDING '<input type="file" jmb-upload-csv="fileContent" title="Browse for a CSV file to import"/>' TO A VIEW
// AFTER THE CSV FILE IS UPLOADED, IT'S CONTENTS ARE ATTACHED TO ISOLATED scope.csvContentsAsText, CONVERTED INTO AN OBJECT scope.csvContentsAsObject, AND scope.$emit('csvUploaded',scope.csvContentsAsObject); IS TRIGGERED
// A CONTROLLER CAN LISTEN FOR THE $emit AS PER BELOW:

//      $scope.$on('csvUploaded', function (event, value) {
//        // Do something
//      });

(function () {
    'use strict';

    angular.module('jmbUploadCsv', [])
    
        .directive('jmbUploadCsv', function () {
   
            return {
                       
                scope: {
                    fileReader:"="
                },
    
        
                link: function(scope, element) {
      
                    $(element).on('change', function(changeEvent) {
        
                        var file = changeEvent.target.files;
            
                        
                        // Get a filename
                        scope.csvFileName = file[0].name;
            
                        
                        // Get CSV contents using filereader
                        if (file.length) 
                            {
                        
                                var r = new FileReader();
                        
                                r.onload = function(e) {
                            
                                    var contents = e.target.result;
                            
                                    scope.$apply(function () {
                                
                                        scope.csvContentsAsText = contents;

                                        // Convert csv text into an object
                                        var allTextLines = scope.csvContentsAsText.split(/\r\n|\n/);
                                        var lines = [];
                                        while (allTextLines.length) {
                                            lines.push(allTextLines.shift().split(','));
                                        }
                  
                  
                                        scope.csvContentsAsObject = [];
                                        
                                        scope.csvContentsAsObject.push({name:scope.csvFileName,data:lines}); // Contents of CSV as object
                                        
                                        // Emit the CSV file as an object
                                        scope.$emit('csvUploaded',scope.csvContentsAsObject); // Broadcast that csv has been uploaded & processed
                  
                  
                                    });
                                };
          
                                r.readAsText(file[0]);
                            }
            });
        
        }
      

            }
        })
    
})();