(function(angular) {
    "use strict";

    angular
        .module("pubSlicerApp", ["pub-ui-analytics"])
        .config(httpConfig)
        .config(translateConfig)
        .config(idleConfig)
        .config(notificationConfig);

    ///////////////////////////////////

    /** Configure HTTP error handler */
    httpConfig.$inject = ["$httpProvider"];
    function httpConfig($httpProvider) {
        $httpProvider.interceptors.push("errorHttpInterceptor");
    }

    /** Configure translating settings */
    translateConfig.$inject = ["$translateProvider", "configProvider"];
    function translateConfig($translateProvider, configProvider) {
        var config = configProvider.$get();
        $translateProvider.useStaticFilesLoader({
            prefix: "common/locales/translate/",
            key: config.defaultLocale,
            suffix: ".json"
        });
    }

    /** Configure $idle settings */
    idleConfig.$inject = ["$idleProvider", "configProvider"];
    function idleConfig($idleProvider,configProvider) {
        var config = configProvider.$get();
        $idleProvider.idleDuration(config.timeoutIdleDuration);
        $idleProvider.warningDuration(config.timeoutWarningDuration);
    }

    /** Configure system notifications */
    notificationConfig.$inject = ["toastrConfig"];
    function notificationConfig(toastrConfig) {
        angular.extend(toastrConfig, {
            extendedTimeOut: 0,
            maxOpened: 0,
            positionClass: "",
            target: "pub-notifications",
            templates: {
                toast: "modules/pubNotifications/toast.html"
            },
            timeOut: 0
        });
    }

}).call(this, angular);