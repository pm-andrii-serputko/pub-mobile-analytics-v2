/*global angular*/
(function (angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");

    app.controller("pubSavedReportsCtrl", [
        "$scope",
        "savedReportsService",
        "ngDialog",
        "googleAnalyticsService",
        "config",
        "pubUniversalAnalyticService",
        "$location",
        "slicerURLParamsService",

        function ($scope, savedReportsService, ngDialog, googleAnalyticsService, config, pubUniversalAnalyticService, $location, slicerURLParamsService) {
            if (pubUniversalAnalyticService.isAggregator()){
                $location.url("/");
            }
            else {
                $scope.navigateNLP("custom reports");
            }


            googleAnalyticsService.gTrackPageUsage(config.gaCustomReportList);
            $scope.currentPageIndicator("custom");
            $scope.customReportSpinner = false;

            var addAll = function () {
                $scope.customReportSpinner = true;
                $scope.reports = [];
                savedReportsService.fetch().then(function(data){
                    $scope.reports = data.data;
                    angular.forEach($scope.reports, function(data){
                        data.description = data.description || "";
                    });
                    $scope.customReportSpinner = false;
                });
            };
            addAll();

            /**
             * Open the create report sharing dialog.
             */
            $scope.createSharedReport = function (id, name, url, desc) {
                $scope.reportDescription = desc;
                $scope.savedReportURL = url;
                $scope.reportId = id;
                $scope.reportType = "CUSTOM";
                $scope.saveObject = {
                    reportName:name,
                    selectedUsersValueIds : [],
                    message:""
                };

                ngDialog.openConfirm({
                    template: "modules/pubSharedReports/createSharedReports.html",
                    scope: $scope,
                    controller: "sharedReportCtrl",
                    closeByDocument: true,
                    closeByEscape: false
                });
            };


            /**
             * Open the create schedule report dialog.
             */
            $scope.createScheduleReport = function (id) {
                googleAnalyticsService.gTrackPageUsage(config.gaScheduleAreportWindow);
                $scope.scheduleReportId = null;
                $scope.reportId = id;
                $scope.reportType = "CUSTOM";

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
                    savedReportsService.destroy(id).success(addAll);
                });
            };

            $scope.showReport = function (model) {
                slicerURLParamsService.setOnLoadReportUrlValue(true);
                window.location.hash = model.url+ "&customReportId=" + model.id;
            };

        }
    ]);

}).call(this, angular);
