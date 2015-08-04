/*global angular*/
(function (angular) {
    "use strict";

    var app;

    app = angular.module("pub-ui-analytics.domain");

    app.factory("pubNLPService.Benchmark", function () {
        return function () {
            return "benchmarkMain";
        };
    });

}).call(this, angular);
