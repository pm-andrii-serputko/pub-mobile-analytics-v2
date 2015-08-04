/*global angular*/
(function (angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");

    app.directive("pubMetricItem",["chartModel", "historicMeasuresService", function (chartModel, historicMeasuresService) {
        return {
            restrict: "A",
            link: function ($scope) {

                $scope.toggle = function () {
                    if ($scope.metricModel.getDisabled() && !$scope.metricModel.getSelected()) {
                        return;
                    }
                    if ($scope.metricModel.getSelected()) {
                        historicMeasuresService.unselectMetric($scope.metricModel);
                        //TODO: Andrii will move this to slicerURLParamsService

                        chartModel.setMetric(null);
                        if ($scope.metricsCollection.getSelectedMetrics().length === 0 ){
                            chartModel.setMetric($scope.metricsCollection.getDefaultIdList()[0]);
                        }
                    } else {
                        historicMeasuresService.selectMetric($scope.metricModel);
                    }

                    $scope.slicerURLParamsService.save();
                };
            }
        };
    }]);

}).call(this, angular);
