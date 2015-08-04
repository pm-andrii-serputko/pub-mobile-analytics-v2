(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics")
        .controller("pubBenchmarkExpiredCtrl", ["$scope","$location", "benchmarkStateService", "pubURLService", pubBenchmarkExpiredCtrl]);

    function pubBenchmarkExpiredCtrl ($scope,$location,  benchmarkStateService, pubURLService) {
        $scope.navigateNLP("benchmarking");
        $scope.isProcessing = benchmarkStateService.getIsProcessing();
        $scope.firstAccess =  benchmarkStateService.getFirstAccess();

        $scope.buyBenchmark = function(){
            var putData = {
                benchmarkPaid: false,
                tosAgreed: false,
                isProcessing: true
            };

            benchmarkStateService.put(putData);
            benchmarkStateService.setIsProcessing(true);
            $scope.isProcessing = true;
            benchmarkStateService.setFirstAccess(false);
            $scope.firstAccess = true;
        };

        $scope.backToHome = function(){
            pubURLService.navigate("/");
        };
    }
}).call(this, angular);
