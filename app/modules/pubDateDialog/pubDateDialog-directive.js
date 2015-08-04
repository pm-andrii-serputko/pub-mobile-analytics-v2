/*jshint unused:false*/
"use strict";

var app =  angular.module("pubSlicerApp");

app.directive("pubDateDialog", [function () {
    return {
        templateUrl: "modules/pubDateDialog/pubDateDialog-directive.html",
        restrict: "EA",
        $scope:  {
            dateObject: "="
        },
        controller: "PubDateDialogCtrl",

        link: function($scope, iElement, $Attrs) {
            
            $Attrs.$observe("dateObject", function(dateObject){
                dateObject= JSON.parse(dateObject);
                $scope.selectedOption = dateObject.optionIndex;
                $scope.selectDateOption($scope.selectedOption, dateObject, true);
                $scope.diffDays = $scope.calculateDiffDays($scope.startDate, $scope.endDate);
                $scope.diffMonths = $scope.endDate.getMonth() - $scope.startDate.getMonth();
            });
        }
    };
}]);