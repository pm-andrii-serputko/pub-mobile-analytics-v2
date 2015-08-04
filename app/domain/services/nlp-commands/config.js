/*global angular*/
(function (angular) {
    "use strict";

    var app;

    app = angular.module("pub-ui-analytics.domain");

    app.factory("pubNLPService.Config", function () {
        return function () {
            return "config";
        };
    });

}).call(this, angular);
