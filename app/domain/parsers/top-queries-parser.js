(function (angular) {
    "use strict";
    /*jshint latedef:false */

    angular
        .module("pub-ui-analytics.domain")
        .factory("topQueriesParser", ["dataFormattingService", topQueriesParser]);

    function topQueriesParser (dataFormattingService) {
        return function (response, metricId, dimensionId) {
            response.columns.forEach(function (column, index) {
                if (response.displayValue && response.displayValue[column]) {
                    response.rows = response.rows.map(function (row) {
                        var id = row[index];
                        row[index] = response.displayValue[column][id] || id;
                        return row;
                    });
                }
            });
        
            var valueIndex = response.columns.indexOf(metricId);
            var keyIndex = response.columns.indexOf(dimensionId);
         
            var returnData = [];
            angular.forEach(response.rows, function(row) {
                row[valueIndex] = dataFormattingService.format(metricId, row[valueIndex], response.currency);
                returnData.push({"name": row[keyIndex], "value": row[valueIndex]});
            });

            return returnData;
        };
    }

}).call(this, angular);