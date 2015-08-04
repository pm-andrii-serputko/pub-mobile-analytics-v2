(function (angular) {
    "use strict";

    var app;

    app = angular.module("pubSlicerApp");

    app.controller("pubHelpScreenCtrl", [
        "$scope",
        "pubURLService",
        "googleAnalyticsService",
        "config",
        "pubUniversalAnalyticService",

        function ($scope, pubURLService, googleAnalyticsService, config, pubUniversalAnalyticService) {
            $scope.redirectReport = function () {
                pubURLService.navigate("/help");
            };

            $scope.redirectCreate = function () {
                pubURLService.navigate("/dimensions");
                $scope.updateNlp(true);
            };

            googleAnalyticsService.gTrackPageUsage(config.gaHelp);
            $scope.currentPageIndicator("help");
            $scope.isAggregator = pubUniversalAnalyticService.isAggregator();
        }
    ]);


}).call(this, angular);

