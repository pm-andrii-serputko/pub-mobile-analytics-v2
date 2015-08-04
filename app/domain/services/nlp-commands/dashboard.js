/*global angular*/
(function (angular) {
    "use strict";

    var app;

    app = angular.module("pub-ui-analytics.domain");

    app.factory("pubNLPService.Dashboard", function () {
        return function () {
            return "dashboard";
        };
    });

}).call(this, angular);
