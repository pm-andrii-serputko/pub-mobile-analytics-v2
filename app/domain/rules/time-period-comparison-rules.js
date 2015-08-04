(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.domain")
        .factory("timePeriodComparisonRules", timePeriodComparisonRules);

    var rules = {
        lostBidsByFloor: changeSignRule,
        lostBidsByAuction: changeSignRule,
        lostBidsByBlockList: changeSignRule,
        lostBidsByDWLF: changeSignRule,
        totalLostBidsAtd: changeSignRule,
        totalLostBidsAdv: changeSignRule,
        totalLostBidsDsp: changeSignRule,
        bidLossRateAtd: changeSignRule,
        bidLossRateAdv: changeSignRule,
        bidLossRateDsp: changeSignRule
    };

    function timePeriodComparisonRules () {
        return {
            execute: function (id, compareValue) {
                var rule = rules[id] || defaultRule;
                return rule.call(this, compareValue);
            }
        };
    }

    function defaultRule (compareValue) {
        return compareValue;
    }

    function changeSignRule (compareValue) {
        return compareValue * -1;
    }

}).call(this, angular);