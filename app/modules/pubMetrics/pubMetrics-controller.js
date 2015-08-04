/*global angular*/
(function (angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");

    app.controller("PubMetricsCtrl", [
        "$scope",
        "historicMeasuresService",
        "pubURLService",
        "slicerURLParamsService",
        "chartModel",
        "googleAnalyticsService",
        "config",
        "$location",
        "pageModel",

        function ($scope, historicMeasuresService, pubURLService, slicerURLParamsService, chartModel, googleAnalyticsService, config, $location, pageModel) {
            googleAnalyticsService.gTrackPageUsage(config.gaMetricPage);
            slicerURLParamsService.fetch();

            $scope.metricsCollection = historicMeasuresService.getMetrics();
            $scope.metricGroupList = $scope.metricsCollection.getMetricsWithGroups();
            $scope.slicerURLParamsService = slicerURLParamsService;
            pageModel.updateIndicator();
            pageModel.updateReportBasicInfo();


            $scope.clear = function () {
                historicMeasuresService.unselectAllMetrics({unselectAll: true});
                chartModel.setMetric($scope.metricsCollection.getDefaultIdList()[0]);
                slicerURLParamsService.save();
            };

            $scope.cancel = function () {
                pubURLService.back();
            };

            $scope.back = function () {
                var hash = slicerURLParamsService.getUrl("filter", {f: slicerURLParamsService.getEncodedData()});
                pubURLService.navigate(hash, true);
            };

            $scope.done = function () {
                googleAnalyticsService.gTrackEventUsage("button", "click", config.gaCreateReport);
                var hash = slicerURLParamsService.getUrl("slice", {f: slicerURLParamsService.getEncodedData()});
                pubURLService.navigate(hash);
            };

            $scope.getMetricTooltip = function( key ){
                return $scope.metricsCollection.findMetricById(key).getMetricDescription();
            };

        }
    ]);

}).call(this, angular);
