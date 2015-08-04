/*global angular*/
(function (angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");

    app.controller("benchmarkMainCtrl", [
        "$scope",
        "config",
        "benchmarkStateService",
        "$location",
        "benchmarkRoute",
        "pubURLService",

        function ($scope, config, benchmarkStateService, $location, benchmarkRoute, pubURLService) {
            $scope.currentPageIndicator("benchmarkMain");
            $scope.navigateNLP("benchmarking");

            if (benchmarkStateService.getIsProcessing() || benchmarkStateService.isExpired()){
                benchmarkRoute.enableBenchmarkExpiredPage();
                pubURLService.navigate("/benchmark-expired");
            }

            else if (benchmarkStateService.getBenchmarkActivated()){
                benchmarkRoute.enableBenchmark();
                pubURLService.navigate("/benchmark");
            }
            else {
                benchmarkRoute.enableBenchmarkTrialPage();
                benchmarkRoute.enableBenchmark();
                benchmarkStateService.setFirstAccess(true);
                pubURLService.navigate("/benchmark-trial");
            }
        }
    ]);
}).call(this, angular);
