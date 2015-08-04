(function (angular) {
    "use strict";
    /*jshint latedef:false */

    angular
        .module("pub-ui-analytics.domain")
        .factory("daySummaryParser", ["dataFormattingService", daySummaryParser]);

    function daySummaryParser (dataFormattingService) {
        return function (response) {
            var data = {};
            response.columns.forEach(function (id, index) {
                data[id] = dataFormattingService.format(id, response.rows[0][index], response.currency);
            });
            return data;
        };
    }

}).call(this, angular);