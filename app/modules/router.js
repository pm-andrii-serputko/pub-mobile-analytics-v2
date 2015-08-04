/*global angular*/
/*jshint unused:false*/
(function(angular) {
    "use strict";

    var app;

    app = angular.module("pubSlicerApp");

    app.config(function($routeProvider, pollerConfig) {

        var loadingPromise = {
            all: ["$q", "pubAnalyticService", "commonReportsService", "savedReportsService", "scheduleReportsService", "pubLocale", function($q, pubAnalyticService, commonReportsService, savedReportsService, scheduleReportsService, pubLocale) {
                var promises = [];
                promises.push(pubAnalyticService.deferred.promise);
                // promises.push(commonReportsService.deferred.promise);
                // promises.push(savedReportsService.deferred.promise);
                // promises.push(scheduleReportsService.deferred.promise);
                promises.push(pubLocale.deferred.promise);

                return $q.all(promises);
            }]

        };

        $routeProvider
            .when("/slice", {
                templateUrl: "modules/pubSlicerScreen/pubSlicerScreen.html",
                controller: "PubSlicerScreenCtrl",
                resolve: loadingPromise
            }).when("/", {
                templateUrl: "modules/pubDashboard/pubDashboard.html",
                controller: "PubDashboardCtrl",
                resolve: loadingPromise
            }).when("/filter", {
                templateUrl: "modules/pubFilter/pubFilter.html",
                controller: "PubFilterCtrl",
                resolve: loadingPromise
            }).when("/config", {
                templateUrl: "modules/pubConfigScreen/partials/config.html",
                controller: "pubConfigScreenCtrl",
                resolve: loadingPromise
            }).when("/loginlinks", {
                templateUrl: "modules/pubLoginLinksScreen/pubLoginLinksScreen.html",
                controller: "pubLoginLinksScreenCtrl"
            }).when("/standard", {
                templateUrl: "modules/pubCommonReports/pubCommonReports.html",
                controller: "pubCommonReportsCtrl",
                resolve: loadingPromise
            }).when("/help", {
                templateUrl: "modules/pubHelp/pubHelpScreen.html",
                controller: "pubHelpScreenCtrl",
                resolve: loadingPromise
            }).when("/schedule", {
                templateUrl: "modules/pubScheduleReports/pubScheduleReports.html",
                controller: "pubScheduleReportsCtrl",
                resolve: loadingPromise
            }).when("/dimensions", {
                templateUrl: "modules/pubDimensions/pubDimensions.html",
                controller: "PubDimensionsCtrl",
                resolve: loadingPromise
            }).when("/dashboard", {
                templateUrl: "modules/pubDashboard/pubDashboard.html",
                controller: "PubDashboardCtrl",
                resolve: loadingPromise
            }).when("/custom", {
                templateUrl: "modules/pubSavedReports/pubSavedReports.html",
                controller: "pubSavedReportsCtrl",
                resolve: loadingPromise
            }).otherwise({
                redirectTo: "/"
            });

        pollerConfig.stopOnRouteChange = true;
    });

    /** Set PubToken */
    app.run([
        "pmTokenStorageService",
        "$location",
        "$http",
        "pubmaticLoginService",

        function(tokenStorageService, $location, $http, pubmaticLoginService) {
            // Set all the session storage params



            tokenStorageService.setAuthType(($location.search()).apiAuthKey || tokenStorageService.getAuthType() || "PubToken");
            //tokenStorageService.setAuthToken("EF298FB16BA84DA086686FCBC65A48F9");
            tokenStorageService.setRefLoginOriginApp(($location.search()).originApp || tokenStorageService.getRefLoginOriginApp() || "");
            tokenStorageService.setRefLoginOriginUrl(($location.search()).originUrl || tokenStorageService.getRefLoginOriginUrl() || "#/loginlinks");
            tokenStorageService.setRefSignoutUrl(($location.search()).signoutUrl || tokenStorageService.getRefSignoutUrl() || "http://www.pubmatic.com");
            tokenStorageService.setResourceId(($location.search()).resourceId || tokenStorageService.getResourceId() || "");
            tokenStorageService.setResourceType(($location.search()).resourceType || tokenStorageService.getResourceType() || "publisher");

            $http.defaults.headers.common.PubToken = tokenStorageService.getAuthToken() || ""; // No APIGEE
            $http.defaults.headers.common.Authorization = tokenStorageService.getAuthToken() || ""; // with APIGEE
            $http.defaults.headers.common.resourceId = "";
            $http.defaults.headers.common.resourceType = "";

            $location.url("/loginlinks");
        }
    ]);



    /** Handle route changes*/
    app.run([
        "$rootScope",
        "$location",
        "dao",
        "historicApiService",

        function($rootScope, $location, dao, historicApiService) {
            $rootScope.$on("navigate", function(chanel, route, replace) {
                if (replace) {
                    $location.url(route).replace();
                } else {
                    $location.url(route);
                }
            });

            $rootScope.$on("$routeChangeStart", function() {
                dao.closeAllConnections();
                historicApiService.abort();
            });
        }
    ]);

    /* Handle session timeouts */
    app.run(["$idle",
        function($idle) {
            // start watching when the app runs.
            $idle.watch();
        }
    ]);

    /** Perform browser specific tasks */
    app.run([
        "$filter",
        "toastr",

        function($filter, toastr) {
            var ua = window.navigator.userAgent;
            var msie = ua.indexOf("MSIE ");
            var trident = ua.indexOf("Trident/");

            if (msie > 0 || trident > 0) { // If Internet Explorer
                toastr.warning("PubMatic Analytics does not optimally support the web browser you are using. Please use Chrome for the best experience.");
            }

        }
    ]);

    /** Load and show system notifications */
    //    app.run(["systemNotificationService", "toastr", function(systemNotificationService, toastr) {
    //        systemNotificationService.getSystemNotifications().then(function(notifications) {
    //            notifications.forEach(function(notification) {
    //                toastr.warning(notification.message, notification.title);
    //            });
    //        });
    //    }]);

    /* Highlight Filter: Highlight Search Text in the Slicer Search Results Screen (or any search filter) */
    app.filter("highlight", function($sce) {
        return function(text, phrase) {
            if (phrase) {
                text = text.replace(new RegExp("(" + phrase + ")", "gi"),
                    "<span style='color:white;background-color:darkseagreen'>$1</span>");
            }

            return $sce.trustAsHtml(text);
        };
    });

}).call(this, angular);
