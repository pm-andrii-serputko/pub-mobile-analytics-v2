/*global angular*/
(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.domain")
        .value("benchmarkingDimensionValuesDispayRules", {

            // TODO: add Automated Guaranteed (AG)
            channelId: ["1", "3", "0"],  // PMP, Open Exchange and ALL.

            platformId: ["1", "2", "4", "5", "0"], // Web, Mobile Web, Mobile App IOS, Mobile App Android and ALL.

            adFormatId: ["1", "2", "0"] // Desktop, Video and ALL

        });


}).call(this, angular);