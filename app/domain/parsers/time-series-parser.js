(function (angular) {
    "use strict";
    /*jshint latedef:false */

    angular
        .module("pub-ui-analytics.domain")
        .factory("timeSeriesParser", ["pubAnalyticService", "dataFormattingService", timeSeriesParser]);

    function timeSeriesParser (pubAnalyticService, dataFormattingService) {
        return function (response, metricId) {
            var metricValueIndex, timeStampIndex, generatedData = [], valueList = [], minValue, maxValue, metrics, metric, totalList=[];

            metrics = pubAnalyticService.getRealtimeMetrics();

            metricValueIndex = response.columns.indexOf(metricId);
            timeStampIndex = response.columns.indexOf("timestamp");
            metric = metrics.findMetricById(metricId);

            totalList = response.rows.map(function(item){
                return item[3];
            });

            minValue = dataFormattingService.format(metricId, Math.min.apply(null, totalList), response.currency);
            maxValue = dataFormattingService.format(metricId, Math.max.apply(null, totalList), response.currency);

            for (var i = response.rows.length - 1; i >= 0; i--) {
                var barValue = response.rows[i][metricValueIndex];
                barValue = dataFormattingService.numberFormat(metricId, barValue, response.currency);

                var barIndex = parseInt(response.rows[i][timeStampIndex]);
                valueList.push([barIndex, barValue]);
            }

            generatedData.push({
                key: metric.getName(),
                values: valueList,
                min: minValue,
                max: maxValue
            });

            return generatedData;
        };
    }

}).call(this, angular);