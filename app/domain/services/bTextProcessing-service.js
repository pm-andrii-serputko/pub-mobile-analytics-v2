/*global angular*/
(function (angular) {
    "use strict";

    var app;

    app = angular.module("pub-ui-analytics.domain");

    app.factory("bTextProcessingService" ,[
        "$http",
        "$filter",
        "pubAnalyticService",
        "middlewareRoutes",
 
        function ($http ,$filter ,pubAnalyticService, middlewareRoutes  ) {

            return {
                fetch: function (nlpString) {

                    var params, config, url;
                    url = middlewareRoutes.bTextProcessing + "/user" ;

                    params = {
                        nlpString: nlpString
                    };

                    config = {
                        method: "GET",
                        url: url,
                        cache: true,
                        params: params
                    };

                    return $http(config);
                }
            };
        }
    ]);

}).call(this, angular);



