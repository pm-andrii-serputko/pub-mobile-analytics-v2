/*global angular*/
(function (angular) {
    "use strict";

    var app =  angular.module("pub-ui-analytics.domain");

    /**
     * @ngdoc filter
     * @name pubWeek
     * @function
     *
     * @description
     * Convert a input isoString week to correct week format (2014 W10).
     *
     * @params input {isoStringWeek | date}
     *
     * @returns {formattedWeek | date} Formatted week
     */
    app.filter("pubWeekFilter", [function () {
        return function (incomingDate) {
            var result, outgoingDate;

            result = incomingDate.match(/(\d{4})W(\d{2})/i) || [];
            outgoingDate = result[1] + " W" + result[2];

            return outgoingDate;
        };
    }]);

}).call(this, angular);