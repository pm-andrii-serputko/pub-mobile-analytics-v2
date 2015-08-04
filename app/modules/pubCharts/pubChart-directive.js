"use strict";

var app =  angular.module("pubSlicerApp");

app.directive("pubChart", [function () {
    return {
        templateUrl: "modules/pubCharts/pubChart-directive.html",
        restrict: "EA",
        $scope:  {
            chartData: "="
        },
        controller: "pubChartCtrl"
    };
}]);
