/*global angular*/
(function (angular) {
    "use strict";

    var app;

    app = angular.module("pub-ui-analytics.domain");

    app.factory("pubNLPService.Alerts", function () {
        return function () {
            return "alerts";
        };
    });

}).call(this, angular);
