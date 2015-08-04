/*global angular*/
(function (angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");

    app.directive("pubNlpBar", function () {
        return {
            templateUrl:"modules/pubNlpBar/pubNlpBar-directive.html",
            restrict: "E",
            controller:"pubNlpBarCtrl"
        };
    });

}).call(this, angular);
