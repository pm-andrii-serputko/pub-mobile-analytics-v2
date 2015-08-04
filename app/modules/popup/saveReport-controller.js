/*global angular*/
(function (angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");

    app.controller("saveReportCtrl", [
        "$scope",
        "commonReportsService",
        "savedReportsService",
        "$location",
        "$timeout",
        "slicerURLParamsService",
        "googleAnalyticsService",
        "config",
        "$filter",
        "$debounce",

        function ($scope,commonReportsService,savedReportsService,$location,$timeout,slicerURLParamsService, googleAnalyticsService, config, $filter, $debounce) {
            var SET_DEBOUNCE_VALUE = 1000,
                KEY_CODE = 13;
            /* Intialize all variables and watches */
            initialize();

            function initialize(){
                $scope.reportName = $scope.$parent.reportTitle;
                $scope.reportId = $scope.$parent.reportId;
                $scope.descriptionNeeded = false;
                $scope.reportFound = false;
                $scope.saveSuccess = false;
            }

            /* Function to validate if report already exists and show validation message in html */
            $scope.checkReportExists = function(reportName){
                $scope.savedReportsArray = savedReportsService.all();
                $scope.reportFound = false;
                angular.forEach($scope.savedReportsArray,function(item){
                    if(item.getName() && reportName && item.getName().toUpperCase()===reportName.toUpperCase()){
                        $scope.reportFound = true;
                        $scope.reportId = item.attributes.id;
                        $scope.savedReportsMessage = $filter("translate")("REPORTS.OVERWRITE_WARNING");
                    }
                });
            };

            /* Function to get URL before calling create/update report service */
            $scope.getUrl = function () {
                return "#/slice?f=" + slicerURLParamsService.getEncodedData();
            };

            /* Function to call save method on pressing enter key
               -- Enter key - event keycode === 13 */
            $scope.callSave = function(event){
                if(event.which === KEY_CODE) {
                    $scope.save();
                }
            };

            /* Set Custom report Id and close the dialog */
            function setCustomReportIdAndClose(){
                $location.search("customReportId", $scope.reportData.id);
                $scope.confirm();
            }


            /* Success and Error handlers for save service */
            $scope.setReportIdAndCloseDialog = function(data){
                $scope.reportData = data;
                $scope.reportTitle = data.name;
                $scope.savedReportsMessage = $filter("translate")("REPORTS.SAVED_SUCCESS");
                $location.search("customReportId", null);
                $location.search("standardReportId", null);
                $location.search("benchmark", null);
                $location.search("adv1", null);
                $location.search("adv2", null);
                $debounce(setCustomReportIdAndClose.bind(this), SET_DEBOUNCE_VALUE);
            };

            /* Service call to update report when it already exists */
            function callUpdateSaveService(){
                savedReportsService
                    .update($scope.reportId,{url: $scope.getUrl(), name: $scope.reportName, description: $scope.reportDescription})
                    .success(function (data) {
                        $scope.setReportIdAndCloseDialog(data);
                    }).error(function(){
                        $scope.savedReportsMessage = $filter("translate")("REPORTS.SAVED_FAILURE");
                    });
            }

            /* Service call to create a new report */
            function callCreateReportSaveService(){
                savedReportsService
                    .create({url: $scope.getUrl(), name: $scope.reportName, description: $scope.reportDescription})
                    .success(function (data) {
                        $scope.setReportIdAndCloseDialog(data);
                    }).error(function(){
                        $scope.savedReportsMessage = $filter("translate")("REPORTS.SAVED_FAILURE");
                    });
            }

            /* Method to save and call appropriate rest service and show appropriate warning message */
            $scope.save = function () {
                $scope.saveSuccess = true;
                $scope.savedReportsMessage = $filter("translate")("REPORTS.SAVING");
                $scope.reportDescription= $scope.reportDescription || "";
                googleAnalyticsService.gTrackEventUsage("button", "click", config.gaSaveReport);
                if ($scope.reportFound === true && $scope.reportName) {
                    callUpdateSaveService();
                } else if($scope.reportName){
                    callCreateReportSaveService();
                } else{
                    $scope.savedReportsMessage = $filter("translate")("REPORTS.EMPTY_TEXT");
                }

            };

            /* Fixing ADS-862 by setting focus on ngDialog in order to prevent multiple clicks-multiple dialog opens */
            /* These watches don't work when placed inside an initialize function and require a timeout of >100 seconds. Hence
                placing these watches at the bottom.*/
            $scope.$watch("$viewContentLoaded", function(){
                $timeout(function(){
                    document.getElementById("reportName").focus();
                }, 0);
            });

            /* Watch for report name changes and validate if report exists. */
            $scope.$watch("reportName", function(newVal){
                $scope.checkReportExists(newVal);
            });
        }
    ]);

}).call(this, angular);
