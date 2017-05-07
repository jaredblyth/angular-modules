// See https://github.com/Fearful/cr-datepicker for original version of this directive
// Amended by Jared Blyth to streamline file inclusion into this single file
var datePicker = angular.module("jmbDatePicker", []) // Example module
var datePickerTemplate = [ // Template for the date picker, no CSS, pure HTML. The date-picker tag will be replaced by this
    '<style>.datePicker {display:inline;}.datePicker input {width: 85px;cursor:pointer;font-weight:normal;padding-left:6px;background-color:#fff;}.datePicker table {border:solid 1px gray;border-radius:3px;position:absolute;background-color:#fff;z-index:10000;}.datePicker  td {text-align: center;padding:3px;}td:hover{background-color:#ffdab9;cursor:pointer;}.datePicker .week .active {background: #B8E5E9;}.datePicker .otherMonth {opacity: 0.4}.datePicker div { width: 250px;}time.icon {font-size: 1em;display: block;position: relative;width: 7em;height: 7em;border-radius: 0.6em;box-shadow: 0 1px 0 #bdbdbd, 0 2px 0 #fff, 0 3px 0 #bdbdbd, 0 4px 0 #fff, 0 5px 0 #bdbdbd, 0 0 0 1px #bdbdbd;overflow: hidden;-webkit-backface-visibility: hidden;-webkit-transform: rotate(0deg) skewY(0deg);-webkit-transform-origin: 50% 10%;transform-origin: 50% 10%;}time.icon * {display: block;width: 100%;font-size: 1em;font-weight: bold;font-style: normal;text-align: center;}time.icon strong {position: absolute;top: 0;padding: 0.4em 0;color: #fff;background-color: #fd9f1b;border-bottom: 1px dashed #f37302;box-shadow: 0 2px 0 #fd9f1b;}time.icon em {position: absolute;bottom: 0.3em;color: #fd9f1b;}time.icon span {width: 100%;font-size: 2.8em;letter-spacing: -0.05em;padding-top: 0.8em;color: #2f2f2f;}</style>',
    '<div class="datePicker form-group">',
    '<label ng-click="selectDate()">',
    '<input type="text" ng-model="currentDate" readonly class="form-control" style="margin-bottom:-15px">',
    '</label>',
    '<div ng-show="selecting" style="display:inline;position:absolute;margin-left:-89px;margin-top:33px;">',
    '<table>',
    '<thead><tr>',
    '<td class="currentDate" colspan="7" ng-bind="displayDate" style="font-weight:bold;pointer-events:none;"></td>',
    '</tr><tr class="navigation">',
    '<td ng-click="prevYear()">&lt;&lt;</td>',
    '<td ng-click="prev()">&lt;</td>',
    '<td colspan="3" ng-click="today()">Today</td>',
    '<td ng-click="next()">&gt;</td>',
    '<td ng-click="nextYear()">&gt;&gt;</td></tr><tr>',
    '<td  ng-repeat="day in days" ng-bind="day" style="pointer-events:none;"></td>',
    '</tr></thead>',
    '<tbody><tr ng-repeat="week in weeks" class="week">',
    '<td  ng-repeat="d in week" ng-click="selectDay(d)" ng-class="{active: d.selected, otherMonth: d.notCurrentMonth}">{{ d.day | date: &#39;d&#39;}}</td>',
    '</tr></tbody>',
    '</table>',
    '</div>',
    '</div>'
].join('\n');
datePicker.directive('jmbDatePicker', function($parse) {
    return {
        restrict: "AE",
        templateUrl: "datePicker.tmpl",
        transclude: true,
        controller: function($scope) {
            $scope.prev = function() {
                $scope.dateValue = new Date($scope.dateValue).setMonth(new Date($scope.dateValue).getMonth() - 1);
            };
            $scope.prevYear = function() {
                $scope.dateValue = new Date($scope.dateValue).setYear(new Date($scope.dateValue).getFullYear() - 1);
            };
            $scope.next = function() {
                $scope.dateValue = new Date($scope.dateValue).setMonth(new Date($scope.dateValue).getMonth() + 1);
            };
            $scope.nextYear = function() {
                $scope.dateValue = new Date($scope.dateValue).setYear(new Date($scope.dateValue).getFullYear() + 1);
            };
            $scope.today = function() {
                $scope.dateValue = new Date();
            };
            $scope.selectDate = function() {
                $scope.selecting = !$scope.selecting;
            };
            $scope.selectDay = function(day) {
                $scope.dateValue = day.day;
                $scope.selecting = !$scope.selecting;
            };
            $scope.days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            $scope.weeks = [];
        },
        scope: {
            dateValue: '='
        },
        link: function(scope, element, attrs) {
            var modelAccessor = $parse(attrs.dateValue);
            if(!scope.dateValue){ scope.dateValue = new Date() };
            var calculateCalendar = function(date) {
                var date = new Date(date || new Date());
                scope.currentDate = date.getDate() + '/' + Math.abs(date.getMonth() + 1) + '/' + date.getFullYear(); //Value that will be binded to the input
                var startMonth = date.getMonth(),
                    startYear = date.getYear();
                date.setDate(1);
                if (date.getDay() === 0) {
                    date.setDate(-6);
                } else {
                    date.setDate(date.getDate() - date.getDay());
                }
                if (date.getDate() === 1) {
                    date.setDate(-6);
                }
                var weeks = [];
                while (weeks.length < 6) { // creates weeks and each day
                    if (date.getYear() === startYear && date.getMonth() > startMonth) break;
                    var week = [];
                    for (var i = 0; i < 7; i++) {
                        week.push({
                            day: new Date(date),
                            selected: new Date(date).setHours(0) == new Date(scope.dateValue).setHours(0) ? true : false,
                            notCurrentMonth: new Date(date).getMonth() != new Date(scope.dateValue).getMonth() ? true : false
                        });
                        date.setDate(date.getDate() + 1);
                    }
                    weeks.push(week);
                }
                scope.weeks = weeks; // Week Array
                scope.displayDate = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()).toDateString().split(' ')[1] + ' ' + new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()).toDateString().split(' ')[3]; // Current Month / Year
            }
            scope.$watch('dateValue', function(val) {
                calculateCalendar(scope.dateValue);
            });
        }
    };
});
datePicker.run([
    '$templateCache',
    function($templateCache) {
        $templateCache.put('datePicker.tmpl', datePickerTemplate); // This saves the html template we declared before in the $templateCache
    }
]);