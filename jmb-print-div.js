// A DIRECTIVE THAT CREATES A PRINT ATTRIBUTE ON A DIV
// In your template you mark the print button like this:
// <a href="#" print-div=".css-selector-of-the-div-you-want-to-print">Print!</a>

(function () {
    'use strict';

    angular.module('jmbPrintDiv', [])
    
        .directive('jmbPrintDiv', function () {
   
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    element.bind('click', function(evt){    
                        evt.preventDefault();    
                        PrintElem(attrs.jmbPrintDiv);
                    });

                    function PrintElem(elem) {
                        PrintWithIframe($(elem).html());
                    }

                    function PrintWithIframe(data) {
                        if ($('iframe#printf').size() == 0) {
                            $('html').append('<iframe id="printf" name="printf"></iframe>');  // an iFrame is added to the html content, then your div's contents are added to it and the iFrame's content is printed
                            var mywindow = window.frames["printf"];
                            mywindow.document.write('<html><head><title></title><style>@page {margin: 25mm 0mm 25mm 5mm} </style>'
                              + '</head><body><div>'
                              + data
                              + '</div></body></html>');

                            $(mywindow.document).ready(function(){
                                mywindow.print();
                                setTimeout(function(){
                                    $('iframe#printf').remove();
                                },2000);  // The iFrame is removed 2 seconds after print() is executed, which is enough for me, but you can play around with the value
                            });
                        }

                        return true;
                    }
                }
            }
        })
    
})();