(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics")
        .controller("pubBenchmarkTrialCtrl", ["$scope", "pubURLService", "pubUniversalAnalyticService", "googleAnalyticsService","config", "benchmarkStateService", pubBenchmarkTrialCtrl]);

    function pubBenchmarkTrialCtrl ($scope, pubURLService, pubUniversalAnalyticService, googleAnalyticsService, config, benchmarkStateService) {

        if (pubUniversalAnalyticService.isBenchmarkAvailable()) {
            $scope.navigateNLP("benchmarking");
        }

        googleAnalyticsService.gTrackPageUsage(config.gaBenchmarkTrial);
        $scope.activateTrial = activateTrial;
        $scope.backToHome = backToHome;
        $scope.navigateCompetitiveBenchmarkTrial = navigateCompetitiveBenchmarkTrial;
        $scope.firstAccess = benchmarkStateService.getFirstAccess();


        /**
         *  Activate trial and swap to the congratulations page
         */
        function activateTrial(){
            $scope.loadingTrialPutAPI = true;
            var putData = {
                benchmarkPaid: false,
                tosAgreed: false,
                isProcessing: false
            };

            benchmarkStateService.put(putData).then(function (response) {
                $scope.firstAccess = false;
                benchmarkStateService.setFirstAccess(false);
                var trialEndDate = benchmarkStateService.convertFormatedStringToDate(response.data.trialEndDate);
                benchmarkStateService.setTrialEndDate(trialEndDate);
                $scope.loadingTrialPutAPI = false;
            });
        }

        function backToHome() {
            pubURLService.navigate("/");
        }

        /**
         * Navigate user to Competitive Benchmark
         */
        function navigateCompetitiveBenchmarkTrial () {
            pubURLService.navigate("/benchmark");

        }
    }

}).call(this, angular);
