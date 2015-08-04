/*global angular*/
(function(angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");

    app.directive("pubBulletChart", function() {
        return {
            templateUrl: "modules/pubBenchmark/pubBulletChart.html",
            restrict: "E",
            scope: {
                compareData: "=",
                measureValue: "=",
                outlierThreshold: "=",
                isHiddenThresholdBlueBar: "="
            }
        };
    });
}).call(this, angular);
