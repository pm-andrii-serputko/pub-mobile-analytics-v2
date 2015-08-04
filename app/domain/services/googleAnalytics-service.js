/*global angular,ga*/
(function (angular) {
    "use strict";

    var app;

    app = angular.module("pub-ui-analytics.domain");

    app.factory("googleAnalyticsService" ,[
        "$http",
        "$filter",
        "config",
        "pubAnalyticService",
 
        function ($http, $filter, config, pubAnalyticService) {

            return {
                gTrackTraffic: function () {
                    (function (i, s, o, g, r, a, m) {
                        var tempStr = "GoogleAnalyticsObject";
                        i[tempStr] = r; // Acts as a pointer to support renaming.

                        // Creates an initial ga() function.  The queued commands will be executed once analytics.js loads.
                        i[r] = i[r] || function () {
                            (i[r].q = i[r].q || []).push(arguments);
                        };

                        // Sets the time (as an integer) this tag was executed.  Used for timing hits.
                        i[r].l = 1 * new Date();

                        // Insert the script tag asynchronously.  Inserts above current tag to prevent blocking in
                        // addition to using the async attribute.
                        a = s.createElement(o);
                        m = s.getElementsByTagName(o)[0];
                        a.async = 1;
                        a.src = g;
                        m.parentNode.insertBefore(a, m);
                    })(window, document, "script", "//www.google-analytics.com/analytics.js", "ga");

                    // Rest api call to node server to get environment (prod,stag,dev,local)
                    // and set appropriate Google Analytics Id
                    $http.get("/api/node/env").
                        success(function(data) {
                            if (data === "production"){
                                ga("create", config.GOOGLE_ANALYTICS_ID_PROD, "auto");
                            } else if (data === "local") {
                                ga("create", config.GOOGLE_ANALYTICS_ID_DEV, {
                                    "cookieDomain": "none"
                                });
                            } else {
                                ga("create", config.GOOGLE_ANALYTICS_ID_DEV, "auto");
                            }
                        }).
                        error(function() {
                            console.log("Error retrieving environment from api call");
                        });
                },

                gTrackPageUsage: function (pageName) {
                    ga("set", "page", pageName);
                    ga("set", "dimension1", pubAnalyticService.getUserType());
                    ga("set", "dimension2", pubAnalyticService.getUserId());
                    ga("set", "dimension3", pubAnalyticService.getUserFirstName()+ " "+ pubAnalyticService.getUserLastName());
                    ga("set", "dimension4", pubAnalyticService.getUserEmail());
                    ga("set", "dimension5", pubAnalyticService.getUserAccessory());
                    ga("send", "pageview");
                },

                gTrackEventUsage: function (category,action, label) {
                    ga("set", "dimension1", pubAnalyticService.getUserType());
                    ga("set", "dimension2", pubAnalyticService.getUserId());
                    ga("set", "dimension3", pubAnalyticService.getUserFirstName()+ " "+ pubAnalyticService.getUserLastName());
                    ga("set", "dimension4", pubAnalyticService.getUserEmail());
                    ga("set", "dimension5", pubAnalyticService.getUserAccessory());
                    ga("send", "event", category, action, label);
                }
            };
        }
    ]);

}).call(this, angular);



