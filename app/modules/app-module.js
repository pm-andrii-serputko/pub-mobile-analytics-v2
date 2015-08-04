(function (angular) {
    "use strict";

    angular.module("pub-ui-analytics", [
        // Angular Modules
        "ngResource",
        "ngRoute",
        "ngAnimate",
        // 3rd Party Modules
        "nvd3ChartDirectives",
        "pascalprecht.translate",
        "base64",
        "pubDatepicker",
        "ngDialog",
        "emguo.poller",
        "ngIdle",
        "pmlComponents",
        "toastr",
        // Custom Modules
        "pub-ui-analytics.common",
        "pub-ui-analytics.dao",
        "pub-ui-analytics.domain",
        "pubUniversalAnalyticService",
        "tophat.common",
        "tophat.multiselect",
        "tophat.threshold-slider",
        "pmcc"
    ]);

}).call(this, angular);