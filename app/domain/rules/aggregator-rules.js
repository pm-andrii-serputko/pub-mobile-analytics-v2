/*global angular*/
(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.domain")
        .value("aggregatorRules", {
            restrictedPageList : [
                {link:"/metrics", templateUrl: "modules/pubMetrics/pubMetrics.html", controller: "PubMetricsCtrl"},
                {link:"/search", templateUrl: "modules/pubSearchScreen/pubSearchScreen.html", controller: "PubSearchCtrl"}
            ]
        });


}).call(this, angular);