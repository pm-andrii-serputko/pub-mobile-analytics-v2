/*global angular*/
(function(angular) {
    "use strict";

    angular
        .module("pub-ui-analytics")
        .directive("pubBulletOpportunityChart", pubBulletOpportunityChart);

    function pubBulletOpportunityChart() {
        return {
            templateUrl: "modules/pubBenchmark/pubBulletOppotrunityChart.html",
            restrict: "E",
            scope: {
                hideValue: "=",
                value: "=",
                valuePercentage: "=",
                potential: "=",
                opportunity: "="
            }
        };
    }


}).call(this, angular);
