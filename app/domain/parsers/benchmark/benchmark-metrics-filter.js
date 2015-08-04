(function (angular) {
    "use strict";
    /*jshint latedef:false */

    angular
        .module("pub-ui-analytics.domain")
        .factory("benchmarkMetricsFilter", [benchmarkMetricsFilter]);

    function benchmarkMetricsFilter () {
        return function (response, filters, advertisers) {
            var expressions = {
                ecpm: /ecpm|avgCompEcpm|minCompEcpm|maxEcpm|medianCompEcpm/,
                sow: /sow|avgCompSow|minCompSow|maxSow|medianCompSow/,
                sov: /sov|avgCompSov|minCompSov|maxSov|medianCompSov/
            };

            var metricsExpr = filters.map(function(metrics) {
                return expressions[metrics.id].source;
            }).join("|") || "_";

            var advertisersExpr = advertisers.map(function(advertiser) {
                return advertiser.id;
            }).join("|") || "_";

            var expr = new RegExp(metricsExpr + "|" + advertisersExpr, "i");

            response.columns = response.columns.filter(metricFilter.bind(this, expr, "id"));
            response.secondaryColumns = response.secondaryColumns.filter(metricFilter.bind(this, expr, "id"));

            response.rows = response.rows.map(function(row) {
                return row.filter(metricFilter.bind(this, expr, "measureId"));
            });

            return response;
        };

        function metricFilter(expr, idProp, measure) {
            if (measure.isMetric) {
                if (expr.test(measure[idProp])) {
                    return measure;
                } else {
                    return false;
                }
            } else {
                return measure;
            }
        }

    }

}).call(this, angular);