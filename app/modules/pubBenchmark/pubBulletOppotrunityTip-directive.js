/*global angular*/
(function(angular) {
    "use strict";

    angular
        .module("pub-ui-analytics")
        .directive("pubBulletOpportunityTip", pubBulletOpportunityTip);

    function pubBulletOpportunityTip() {
        return {
            templateUrl: "modules/pubBenchmark/pubBulletOppotrunityTip.html",
            restrict: "E",
            scope: {
                toolTipDisplay: "=",
                metricName: "=",
                metricValue: "=",
                metricPercentage: "=",
                potentialValue: "=",
                potentialPercentage: "=",
                opportunityValue: "=",
                opportunityPercentage: "=",
            }
        };
    }


}).call(this, angular);
