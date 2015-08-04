/*global angular*/
(function (angular) {
    "use strict";

    var app =  angular.module("pub-ui-analytics.domain");

    /**
    * @ngdoc filter
    * @name pubDate
    * @function
    *
    * @description
    * Convert a input isoString date to correct date format (Sunday, Aug 3, 2014).
    *
    * @params input {isoStringDate | date}
    *
    * @returns {formattedDate | date} Formatted date
    */
    app.filter("pubDateFilter", ["$filter", function ($filter) {
        return function (incomingDate) {
            var result, outgoingDate;

            result = incomingDate.match(/(\d{4})-(\d{2})-(\d{2})/i);

            incomingDate = new Date(result[1], parseInt(result[2], 10)-1, result[3]);

            outgoingDate = $filter("date")(incomingDate, "EEEE, MMM d, y");

            return outgoingDate;
        };
    }]);

}).call(this, angular);