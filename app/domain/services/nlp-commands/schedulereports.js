/*global angular*/
(function (angular) {
    "use strict";

    var app, API;

    app = angular.module("pub-ui-analytics.domain");

    app.factory("pubNLPService.ScheduleReports", [function () {

        API = {

            parse: function (searchQuery) {
                // Remove command name from searchQuery
                searchQuery = searchQuery.replace(/\s?(\w*\s?)/, "");
                // Remove '?' from searchQuery
                searchQuery = searchQuery.replace("?", "");
                // Remove space between and after comma
                searchQuery = searchQuery.replace(/\s*,\s*/g, ",");
                // Split searchQuery into an array of dimensions
                searchQuery = searchQuery.split(",");

                return searchQuery;
            },

            run: function (searchQuery) {
                searchQuery = API.parse(searchQuery);
                return "schedule";
            }
        };

        return API.run;
    }]);

}).call(this, angular);
