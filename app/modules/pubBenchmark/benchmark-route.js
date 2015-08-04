(function (angular) {
    "use strict";
    /* jshint validthis:true */

    angular
        .module("pub-ui-analytics")
        .provider("benchmarkRoute", ["$routeProvider", benchmarkRoute]);

    function benchmarkRoute ($routeProvider) {
        
        var service = {
            enableMainBenchmark : enableMainBenchmark,
            enableBenchmark: enableBenchmark,
            enableBenchmarkTrialPage: enableBenchmarkTrialPage,
            enableBenchmarkExpiredPage: enableBenchmarkExpiredPage,
            disable: disable
        };


        function enableMainBenchmark () {
            $routeProvider
                .when("/benchmarkMain", {
                    templateUrl: "modules/pubBenchmark/benchmarkMain.html",
                    controller:  "benchmarkMainCtrl"
                });
        }

        function enableBenchmark () {
            $routeProvider
                .when("/benchmark", {
                    templateUrl: "modules/pubBenchmark/benchmark.html",
                    controller:  "pubBenchmarkCtrl"
                });
        }

        function enableBenchmarkTrialPage () {
            $routeProvider
                .when("/benchmark-trial", {
                    templateUrl: "modules/pubBenchmark/pubBenchmark-trial/benchmark-trial.html",
                    controller:  "pubBenchmarkTrialCtrl"
                });
        }

        function enableBenchmarkExpiredPage() {
            $routeProvider
                .when("/benchmark-expired", {
                    templateUrl: "modules/pubBenchmark/pubBenchmark-trial/benchmark-expired.html",
                    controller:  "pubBenchmarkExpiredCtrl"
                });
        }


        function disable () {
            // TODO
        }

        this.$get = function () {
            return service;
        };
    }

}).call(this, angular);