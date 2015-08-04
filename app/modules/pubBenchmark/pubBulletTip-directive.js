/*global angular*/
(function(angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");

    app.directive("pubBulletTip", function() {
        return {
            templateUrl: "modules/pubBenchmark/pubBulletTip.html",
            restrict: "E",
            scope: {
                compareData: "=",
                data: "="
            }
        };

    });
}).call(this, angular);
