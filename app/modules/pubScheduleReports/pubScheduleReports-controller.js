/*global angular*/
(function (angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");

    app.controller("pubScheduleReportsCtrl", [
        "$scope",
        "ngDialog",
        "scheduleReportsService",
        "$filter",
        "googleAnalyticsService",
        "config",

        function ($scope, ngDialog, scheduleReportsService, $filter, googleAnalyticsService, config) {

            googleAnalyticsService.gTrackPageUsage(config.gaScheduledReports);
            $scope.currentPageIndicator("schedule");
            $scope.navigateNLP("scheduled reports");
            $scope.scheduleReportSpinner = true;

            var addAll = function () {
                $scope.reports = scheduleReportsService.map(function (report) {
                    return report.decorate("shortDay");
                });
                var orderBy = $filter("orderBy");
                var sortBy = function (each){
                    return each.report.attributes.reportName;
                };
                $scope.reports = orderBy($scope.reports, sortBy, false);
                $scope.scheduleReportSpinner = false;
            };

            scheduleReportsService.fetch().then(function(){
                addAll();
            });

            $scope.edit = function (id) {
                $scope.scheduleReportId = id;
                ngDialog.openConfirm({
                    template: "modules/pubScheduleReports/create-editScheduleReports.html",
                    scope: $scope,
                    controller: "scheduleReportCtrl",
                    closeByDocument: true,
                    closeByEscape: false
                });
            };

            $scope.remove = function (id) {
                ngDialog.openConfirm({
                    template: "modules/popup/removeReport.html",
                    scope: $scope,
                    controller: "removeCtrl",
                    closeByDocument: true,
                    closeByEscape: false
                }).then(function () {
                    scheduleReportsService.destroy(id).success(addAll);
                });
            };
        }
    ]);

}).call(this, angular);
