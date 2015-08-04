/*global angular*/
(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.common")
        .value("config", {
            // Application version
            version: "1.7.0-{{{BUILD_NUMBER}}}",
            // Build Date
            buildDate: "{{{BUILD_DATE}}}",
            // Git Commit SHA-1
            gitCommit: "{{{GIT-COMMIT_SHA}}}",
            // Middleware version
            middlewareVersion: "v1",
            // Middleware prefix
            middlewarePrefix: "http://analytics-api.matrix.pubmatic.com",

            // Default locale
            defaultLocale: "en-us",

            // Dimensions setting
            maxVisibleDimensions: 5,
            maxInvisibleDimensions: 5,
            maxSelectedDimensions: 10,

            // Metrics setting
            maxSelectedMetrics: 10,

            // Login URLs
            mediaBuyerLoginURL:"http://apps.pubmatic.com/mediabuyer/",
            publisherLoginURL:"http://apps.pubmatic.com/publisher/",

            // PML Component Fields (application used for topHeader nav component)
            pmlComponentTemplateRoot: "bower_components/kickstartPmlComponents/app/components/pmlComponents/",
            application: "analytics",


            // Session timeout settings
            timeoutIdleDuration: 1800,  // (60 sec * 30 min)
            timeoutWarningDuration: 30,  // 30 sec

            // google analytics IDs
            GOOGLE_ANALYTICS_ID_PROD: "UA-735070-13",
            GOOGLE_ANALYTICS_ID_DEV: "UA-57785503-1",

            //For google analytics pageview
            gaDashboard: "realtime dashboard",
            gaStandardReport: "standard report",
            gaCustomReport: "custom report",
            gaBenchmarkReport: "benchmark report",
            gaStandardReportList: "standard reports list",
            gaCustomReportList: "custom reports list",
            gaDimensionPage: "select dimensions",
            gaMetricPage: "select metrics",
            gaScheduledReports: "scheduled reports",
            gaViewAlerts: "view alerts",
            gaManageAlerts: "manage alerts",
            gaAllReports: "all reports",
            gaBenchmarkTrial: "benchmark-trial",
            gaBenchmarkAdvertiser: "benchmark-advertiser",
            gaBenchmarkAdvByPub: "benchmark-advertiser-by-publisher",
            gaBenchmarkCategories: "benchmark-categories",
            gaFilterPage: "filter report",
            gaHelp: "help",
            gaSlicerScreen: "report-slicer",
            gaClassicReport: "classic report",
            gaScheduleAreportWindow: "Schedule a report window",
            gaShareAreportWindow: "Share a report window",


            //For google analytics events
            gaReportFeedbackGood: "report helpful good",
            gaReportFeedbackBad: "report helpful bad",
            gaCreateReport: "create report",
            gaSaveReport: "save a report",
            gaShowChart: "show chart toggle",
            gaDownloadCSV: "download CSV",
            gaDownloadExcel: "download excel",
            gaScheduleReport: "schedule a report",
            gaShareReport: "share a report",
            gaShowAlertDropdown: "show alert dropdown"


        });
}).call(this, angular);
