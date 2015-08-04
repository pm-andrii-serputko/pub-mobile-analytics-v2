/*global angular*/
(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.domain")
        .value("dimensionsGroupsMap", {
            groupList: ["adAttributes", "buyer", "general", "geography", "inventory", "mobile", "timeUnits", "ag"]
        });


}).call(this, angular);