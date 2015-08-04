/*global angular*/
(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.dao")
        .factory("endpoints", ["config", endpoints]);

    function endpoints (config) {
        var base =  config.middlewarePrefix + "/" + config.middlewareVersion + "/";

        return {

            // all initial data for analytic tool
            analytic: base + "analytics/user",

            // historic data
            historic: base + "analytics/data",

            // export historic data
            exportData: base + "analytics/export",

            // real time data
            realtime: base + "analytics/data/rt",

            // get dimension values limitted to the user
            measureValues: base + "analytics/metadata/value/idvalue",

            filterDimensionValuesLookup: base + "analytics/displayvalue",

            // common reports
            common: base + "analytics/common",

            // saved/favorite reports
            saved: base + "analytics/saved",

            // natural language processing
            bTextProcessing: base + "analytics/data/nlp",

            //User profile for sharing service
            userShared : base + "analytics/user/sameaccount",

            //Share report service when report Id is available or report is already saved
            shareSaved : base + "analytics/share/saved",

            //Share report service when report Id is not available or report is not already saved
            shareNotSaved : base + "analytics/share/newcustom",

            // Scheduled reports service
            schedule : base + "analytics/schedule",

            // Feedback services
            feedback : base + "analytics/data/feedback/user",

            // Benchmarking 
            benchmark: base + "analytics/benchmark",

            //alerts service - notification screen and list view
            alerts: base + "analytics/alert/msgs",

            //alerts count service - notification screen and list view
            alertsCount: base + "analytics/alert/msgs/count",

            //alerts read service - notification screen and list view
            alertsRead: base + "analytics/alert/msgs/read",

            //alerts config service - system and custom alerts
            alertsConfig: base + "analytics/alert/config",

            //alerts user setting service - system and custom alerts
            alertsUserSetting: base + "analytics/user/setting",

            //System level notification for the user
            systemNotification: base + "analytics/system/notification"

        };
    }

}).call(this, angular);