/*global angular*/
(function (angular) {
    "use strict";

    var app =  angular.module("pub-ui-analytics.domain");

    /**
     * @ngdoc filter
     * @name pubMonth
     * @function
     *
     * @description
     * Convert a input isoString month to correct month format (Aug 2014).
     *
     * @params input {isoStringMonth | date}
     *
     * @returns {formattedMonth | date} Formatted month
     */
    app.filter("pubMonthFilter", ["$filter", function ($filter) {
        return function (incomingDate) {
            var result, outgoingDate;

            result = incomingDate.match(/(\d{4})-(\d{2})/i) || [];

            incomingDate = new Date(result[1], parseInt(result[2], 10)-1);

            outgoingDate = $filter("date")(incomingDate, "MMM y");

            return outgoingDate;
        };
    }]);

}).call(this, angular);