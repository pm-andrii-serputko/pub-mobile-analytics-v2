(function (angular) {
    "use strict";
    /*jshint latedef:false */

    angular
        .module("pub-ui-analytics.domain")
        .factory("benchmarkMeasureValuesParser", ["$filter", "benchmarkingDimensionValuesDispayRules", benchmarkMeasureValuesParser]);

    function benchmarkMeasureValuesParser ($filter, benchmarkingDimensionValuesDispayRules) {
        return function (response, dimensionId) {
            // ADS-1039: Remove Channel Value equal to "0"
            response = response.filter(function (obj) { return  obj.id !== "0"; });
            response = response.map(function (obj) {
                return { id: obj.id, name: obj.value, isSelected: false};
            });

            response = $filter("orderBy")(response, "name", false);

            var rules = benchmarkingDimensionValuesDispayRules[dimensionId];

            if (rules) {
                return response.filter(function (dimensionValue) {
                    return rules.indexOf(dimensionValue.id) !== -1;
                });
            } else {
                return response;
            }
        };
    }

}).call(this, angular);