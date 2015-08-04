(function (angular) {
    "use strict";
    /* jshint validthis:true */

    angular
        .module("pub-ui-analytics")
        .provider("toggleRoute", ["$routeProvider", toggleRoute]);

    function toggleRoute ($routeProvider) {
        
        var service = {
            enable: enable,
            setAggregator: setAggregator
        };

        var loadingPromise = {
            pubAnalytic: ["pubAnalyticService", function (pubAnalyticService) {
                return pubAnalyticService.deferred.promise;
            }],

            commonReports: ["commonReportsService", function (commonReportsService) {
                return commonReportsService.deferred.promise;
            }],

            savedReports: ["savedReportsService", function (savedReportsService) {
                return savedReportsService.deferred.promise;
            }],

            scheduleReports: ["scheduleReportsService", function (scheduleReportsService) {
                return scheduleReportsService.deferred.promise;
            }],

            i18n: ["pubLocale", function (pubLocale) {
                return pubLocale.deferred.promise;
            }]

        };

        function enable (pageList) {
            angular.forEach(pageList, function(each){
                $routeProvider
                    .when(each.link, {
                        templateUrl: each.templateUrl,
                        controller:  each.controller,
                        resolve: loadingPromise
                    });
            });
        }

        function setAggregator () {
            $routeProvider
                .when("/", {
                    templateUrl: "modules/pubCommonReports/pubCommonReports.html",
                    controller:  "pubCommonReportsCtrl",
                    resolve: loadingPromise
                })
                .otherwise({
                    redirectTo: "/"
                });
        }

        this.$get = function () {
            return service;
        };
    }

}).call(this, angular);