/*global angular*/
(function (angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");


    app.directive("pubFilterDimensions", ["$sce", "pubUniversalAnalyticService", function ($sce, pubUniversalAnalyticService) {

        return {
            templateUrl: "modules/pubFilter/pubFilterDimensions.html",
            restrict: "A",
            replace: true,
            scope: {
                editableDimension: "=",
                dimensions: "=",
                maxDimensions: "=",
                destroy: "=",
                edit: "=",
                drop: "=",
                visible: "="
            },
            link: function ($scope, element, attr) {
                $scope.showRemainingDimensions = function () {
                    return $sce.trustAsHtml($scope.remainingDimensions);
                };

                $scope.showFilter = function (dimension) {
                    var filter = dimension.getFilter();
                    return filter.getDimensionValueFilters().length || (filter.getCompareValue() && filter.getComparison());
                };

                $scope.title = attr.title;
                $scope.remainingDimensions = $scope.maxDimensions - $scope.dimensions.length;

                $scope.isAggregator = pubUniversalAnalyticService.isAggregator();

            }
        };

    }]);

}).call(this, angular);
