/*global angular*/
(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.domain")
        .value("alertRules", {
            restrictedPageList : [
                {link:"/alerts", templateUrl: "modules/pubAlerts/pubAlerts.html", controller: "pubAlertsCtrl"}
            ]
        });


}).call(this, angular);
