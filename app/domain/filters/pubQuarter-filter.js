/*global angular*/
(function (angular) {
    "use strict";

    var app =  angular.module("pub-ui-analytics.domain");

    /**
     * @ngdoc filter
     * @name pubQuarter
     * @function
     *
     * @description
     * Convert a input isoString quarter to correct quarter format (2014 Q02).
     *
     * @params input {isoStringQuarter | date}
     *
     * @returns {formattedQuarter | date} Formatted quarter
     */
    app.filter("pubQuarterFilter", [function () {
        return function (incomingDate) {
            var result, outgoingDate;

            result = incomingDate.match(/(\d{4})Q(\d{2})/i) || [];

            outgoingDate = result[1] + " Q" + result[2];

            return outgoingDate;
        };
    }]);

}).call(this, angular);