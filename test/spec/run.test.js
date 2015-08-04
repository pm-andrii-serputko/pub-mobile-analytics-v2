/*global angular*/
(function (angular) {
    "use strict";

    var app;

    app = angular.module("pub-ui-analytics");

    /**
     * Set up $httpBackend mock for all unit testings
     */
    app.run([
        "$httpBackend",
        "middlewareRoutes",
        "analyticMock",
        "reportsMock",
        "enUSMock",
        "enUSLocaleMock",

        function ($httpBackend, middlewareRoutes, analyticMock, reportsMock, enUSMock, enUSLocaleMock) {
            $httpBackend.whenGET(middlewareRoutes.reports).respond(reportsMock);
            $httpBackend.whenGET(middlewareRoutes.analytic).respond(analyticMock);
            $httpBackend.whenGET("/common/locales/translate/en-us.json").respond(enUSMock);
            $httpBackend.whenGET("/common/locales/ngLocale/angular-locale_en-us.js").respond(enUSLocaleMock);
            $httpBackend.whenPOST(middlewareRoutes.filterDimensionValuesLookup).respond([]);
        }
    ]);

    app.run(function notificationConfig() {
        var systemNotifications = angular.element("<pub-system-notifications></pub-system-notifications>");
        var notifications = angular.element("<pub-notifications></pub-notifications>");
        var body = angular.element(document).find("body").eq(0);
        body.append(systemNotifications);
        body.append(notifications);
    });

}).call(this, angular);