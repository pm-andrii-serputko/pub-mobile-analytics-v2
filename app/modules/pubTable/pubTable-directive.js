"use strict";
var app = angular.module("pubSlicerApp");

app.directive("pubTable", ["$timeout", "pubAnalyticService", "pubTableService", function ($timeout, pubAnalyticService, pubTableService) {

    return {

        templateUrl: "modules/pubTable/pubTable-directive.html",
        restrict: "E",
        controller: ["$scope", function($scope) {

            var dimensionsCollection;

            dimensionsCollection = pubAnalyticService.getHistoricDimensions();
            $scope.metricsCollection = pubAnalyticService.getHistoricMetrics();
          
            $scope.$watch("slicerData", function () {
                pubTableService.parse($scope.slicerData, {dimensions: dimensionsCollection.getVisibleDimensions()});
            });

            $scope.selectedDimensions = dimensionsCollection.getVisibleDimensions();

            $scope.currentGroupingLevel = $scope.selectedDimensions.length > 1 ? 0 : -1;

            $scope.nextGroupingLevel = $scope.currentGroupingLevel + 1;

            $scope.rowspan = 1;


            $scope.filters = "";
        }]
    };
}]);