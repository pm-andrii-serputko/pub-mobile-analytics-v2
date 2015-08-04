/*global angular*/
(function (angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");

    app.controller("pubCommonReportsCtrl", [
        "$scope",
        "commonReportsService",
        "ngDialog",
        "googleAnalyticsService",
        "config",

        function ($scope, commonReportsService, ngDialog, googleAnalyticsService, config) {

            /** Controller properties */
            $scope.reportGroups = [];
            $scope.scheduleReportId = null;
            $scope.reportId = null;
            $scope.reportType = null;
            /** Controller methods */
            $scope.showReport = showReport;
            $scope.createScheduleReport = createScheduleReport;

            initialize();

            /**
             * @description
             * Tracked page in GA tool.
             * Update NLP and Page indicator.
             * Get groupes of reports.
             */
            function initialize() {
                googleAnalyticsService.gTrackPageUsage(config.gaStandardReportList);
                $scope.navigateNLP("standard reports");
                $scope.currentPageIndicator("standard");
                $scope.reportGroups = commonReportsService.groupBy("groupId");
            }

            /**
             * @description
             * Navigate User to report page.
             * @params model {object} <ReportModel>
             */
            function showReport(model) {
                window.location.hash = model.getUrl() + "&standardReportId=" + model.getId();
            }

            /**
             * @description
             * Open the create schedule report dialog.
             * @params id {number}
             */
            function createScheduleReport(id) {
                googleAnalyticsService.gTrackPageUsage(config.gaScheduleAreportWindow);
                $scope.scheduleReportId = null;
                $scope.reportId = id;
                $scope.reportType = "STANDARD";

                ngDialog.openConfirm({
                    template: "modules/pubScheduleReports/create-editScheduleReports.html",
                    scope: $scope,
                    controller: "scheduleReportCtrl",
                    closeByDocument: true,
                    closeByEscape: false
                });
            }

        }
    ]);

}).call(this, angular);
