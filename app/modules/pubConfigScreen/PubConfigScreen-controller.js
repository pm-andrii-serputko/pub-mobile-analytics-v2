/*global angular*/
(function (angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");

    app.controller("pubConfigScreenCtrl", [
        "$scope",
        "config",
        "pubAnalyticService",

        function ($scope, config, pubAnalyticService) {
            /** Application version */
            $scope.version = config.version;

            /** Build version was created at */
            $scope.buildDate = config.buildDate;

            /** Git hash */
            $scope.gitCommit = config.gitCommit;

            /** Get current locale from Analytic Service */
            $scope.locale = pubAnalyticService.getLocale();

            /** Set selected locale from Analytic Service */
            $scope.changeLocale = function () {
                pubAnalyticService.setLocale($scope.locale);
            };
        }
    ]);
}).call(this, angular);
