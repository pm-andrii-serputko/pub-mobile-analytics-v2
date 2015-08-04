/*global angular*/
(function (angular) {
    "use strict";

    var app;

    app = angular.module("pub-ui-analytics.domain");

    app.factory("pubNLPService.Help", function () {
        return function () {
            return "help";
        };
    });

}).call(this, angular);
