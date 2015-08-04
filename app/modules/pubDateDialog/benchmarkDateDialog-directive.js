/*jshint unused:false*/
"use strict";

var app =  angular.module("pubSlicerApp");
app.directive("benchmarkDateDialog", ["$rootScope","pubAnalyticService","$filter", function ($rootScope,pubAnalyticService, $filter) {
    return {
        templateUrl: "modules/pubDateDialog/benchmarkDateDialog-directive.html",
        restrict: "EA",
        $scope:  {
            dateObject: "="
        },
        controller: "benchmarkDateDialogCtrl",

        link: function($scope, iElement, $Attrs) {
            
            $Attrs.$observe("dateObject", function(dateObject){
                dateObject= JSON.parse(dateObject);
                $scope.selectedOption = dateObject.optionIndex;
                $scope.selectDateOption($scope.selectedOption, dateObject, true);
                var timeDiff = Math.abs($scope.startDate.getTime() - $scope.endDate.getTime());
                $scope.diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            });
        }
    };
}]);