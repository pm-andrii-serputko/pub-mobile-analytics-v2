/*global angular*/
(function (angular) {
    "use strict";

    var app =  angular.module("pub-ui-analytics.domain");

    /**
    * @ngdoc filter
    * @name pubHour
    * @function
    *
    * @description
    * Convert a input isoString date-hour to correct hour format (ie Aug 6, 2014 12:00:00 AM).
    *
    * @params input {isoStringDateHour|date}
    *
    * @returns {formattedDateHour|date} Formatted datehour
    */
    app.filter("pubHourFilter", ["$filter", function ($filter) {
        return function (incomingDate) {
            var result, outgoingDate;

            result = incomingDate.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2})/i);

            incomingDate = new Date(result[1], result[2]-1, result[3], result[4]);

            outgoingDate = $filter("date")(incomingDate, "medium");

            return outgoingDate;
        };
    }]);

}).call(this, angular);