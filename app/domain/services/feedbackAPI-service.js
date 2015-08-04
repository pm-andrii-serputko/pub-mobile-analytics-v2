/*global angular*/
(function (angular) {
    "use strict";

    var app;

    app = angular.module("pub-ui-analytics.domain");

    app.factory("feedbackApiService", [
        "$http",
        "middlewareRoutes",

        function ($http, middlewareRoutes) {

            var _resp = "";

            return {
                setResponse: function setResponse(resp) {
                    _resp = resp;
                },

                getResponse: function getResponse() {
                    return _resp;
                },

                postFeedback: function postFeedback(data) {
                    var config = {
                        method: "POST",
                        url: middlewareRoutes.feedback,
                        cache: false,
                        data: data
                    };

                    return $http(config);
                }
            };
        }
    ]);

}).call(this, angular);