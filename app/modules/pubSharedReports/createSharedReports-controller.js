/*global angular*/
(function (angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");

    app.controller("sharedReportCtrl", [
        "$scope",
        "UserSharedReportModel",
        "userSharedReportsService",
        "savedReportsService",
        "sharedSavedReportsService",
        "sharedNotSavedReportsService",
        "$timeout",
        "slicerURLParamsService",
        "$location",
        "googleAnalyticsService",
        "config",
        "$filter",
        "$debounce",

        function ($scope, UserSharedReportModel, userSharedReportsService, savedReportsService, sharedSavedReportsService, sharedNotSavedReportsService, $timeout, slicerURLParamsService, $location, googleAnalyticsService, config, $filter, $debounce) {

            var KEY_PRESS_VARIABLE = 13,
                FIRST_TIMEOUT_TIMESET = 2000,
                SECOND_TIMEOUT_TIMESET = 1000;

            initialize();

            /* Initialize all variables */
            function initialize(){
                googleAnalyticsService.gTrackPageUsage(config.gaShareAreportWindow);
                $scope.showCheckbox = false;
                var isModifiedUrl = slicerURLParamsService.getEncodedData() !== slicerURLParamsService.getOnLoadReportUrl();
                if(!$scope.reportId || (isModifiedUrl && !$scope.savedReportURL)){
                    $scope.showCheckbox = true;
                }
                $scope.okDisabled = false;
                $scope.savecopy = false;
                $scope.reportFound = false;
                $scope.shareOrSaveSuccess = false;
                checkReportExists();
                overwriteWarning();
                /* Service call to fetch user list including their email Ids and firstname - lastname */
                userSharedReportsService.fetch().then(function(modelItem){
                    $scope.sharedLookup = angular.copy(modelItem.data);
                    angular.forEach($scope.sharedLookup , function(value, key) {
                        $scope.sharedLookup[key].fullName = value.firstName + " "  + value.lastName;
                    });
                });
            }

            /* Get the URL to pass to the save service */
            $scope.getUrl = function () {
                return "#/slice?f=" + slicerURLParamsService.getEncodedData();
            };

            /* Find if it's duplicate report and set appropriate variable */
            function checkReportExists(){
                $scope.reportFound = false;
                var arrayResultData  = savedReportsService.all();
                if(arrayResultData && $scope.saveObject.reportName){
                    angular.forEach(arrayResultData,function(item){
                        if(item.attributes && item.getName() && (item.getName().toUpperCase()===$scope.saveObject.reportName.toUpperCase())){
                            $scope.reportId = item.getId();
                            $scope.reportFound = true;
                        }
                    });
                }
            }

            /* Select/Unselect users/email Ids */
            $scope.changeUserSelection = function(sharedItem){
                overwriteWarning();
                if($scope.saveObject.selectedUsersValueIds.indexOf(sharedItem.userId) === -1){
                    $scope.saveObject.selectedUsersValueIds.push(sharedItem.userId);
                }else{
                    $scope.saveObject.selectedUsersValueIds.splice($scope.saveObject.selectedUsersValueIds.indexOf(sharedItem.userId),1);
                }
                $scope.okDisabled = $scope.saveObject.selectedUsersValueIds.length>0 && $scope.saveObject.reportName.length>0;
            };

            /* The watches are defined directly in the controller instead of being placed in the initialize function
                ---Reason: The watches need a timeout to be defined before being declared. In order to avoid unnecessary
                            use of timeouts the watch code is placed within the controller. */

            /* Button disable based on selection */
            $scope.disable = function(){
                $scope.okDisabled = $scope.saveObject.selectedUsersValueIds.length>0 && $scope.saveObject.reportName.length>0;
            };
            $scope.$watchCollection("[saveObject.reportName, saveObject.selectedUsersValueIds]", $scope.disable, true);

            function setCustomReportIdAndCloseDialog(){
                //called after saving report or calling shareSavedReport()
                if($scope.savedReportData && $scope.savedReportData.id && !$scope.savedReportURL){
                    $location.search("customReportId", $scope.savedReportData.id);
                }else if($scope.reportId  && !$scope.savedReportURL){
                    $location.search("customReportId", $scope.reportId);
                }
                if($scope.showCheckbox && $scope.savecopy){
                    $scope.confirm(true);
                }else{
                    $scope.confirm(false);
                }
            }
            function shareSavedReportSuccessHandler(){
                $scope.sharedReportValidationMessage = $filter("translate")("REPORTS.SHARE_SUCCESS");
                $location.search("customReportId", null);
                $location.search("standardReportId", null);
                $debounce(setCustomReportIdAndCloseDialog, FIRST_TIMEOUT_TIMESET);
            }

            function shareErrorHandler(){
                $scope.cancelDisabled = false;
                $scope.shareOrSaveSuccess = false;
                $scope.okDisabled = true;
                $scope.sharedReportValidationMessage = $filter("translate")("REPORTS.SHARE_FAILURE");
            }
            function shareSavedReport(){
                if(!$scope.reportId){
                    $scope.reportId = $scope.savedReportData.id;
                }

                if($scope.savedReportData && $scope.savedReportData.name){
                    $scope.reportTitle = $scope.savedReportData.name;
                }
                sharedSavedReportsService
                    .create({reportId:$scope.reportId, targetUserIds:$scope.saveObject.selectedUsersValueIds, message:$scope.saveObject.message})
                    .success(function(){
                        shareSavedReportSuccessHandler();
                    }).error(function(){
                        shareErrorHandler();
                    });

            }
            function callShareSavedReportService(data){
                $scope.savedReportData = data;
                $debounce(shareSavedReport, SECOND_TIMEOUT_TIMESET);
            }

            function savedSuccessHandler(data){
                $scope.sharedReportValidationMessage = $filter("translate")("REPORTS.SAVED_SUCCESS");
                callShareSavedReportService(data);
            }

            function savedErrorHandler(){
                $scope.cancelDisabled = false;
                $scope.shareOrSaveSuccess = false;
                $scope.okDisabled = true;
                $scope.sharedReportValidationMessage = $filter("translate")("REPORTS.SAVED_FAILURE");
            }

            function callCreateReportService(){
                $scope.sharedReportValidationMessage = $filter("translate")("REPORTS.SAVING");
                if($scope.reportId){
                    savedReportsService
                        .update($scope.reportId, {url: $scope.getUrl(), name: $scope.saveObject.reportName, description:  ""})
                        .success(function (data) {
                            savedSuccessHandler(data);
                        }).error(function(){
                            savedErrorHandler();
                        });
                }else{
                    savedReportsService
                        .create({url: $scope.getUrl(), name: $scope.saveObject.reportName, description:  ""})
                        .success(function (data) {
                            savedSuccessHandler(data);
                        }).error(function(){
                            savedErrorHandler();
                        });
                }
            }

            $scope.isShareCancelEnabled = function(){
                var retValue = false;
                if((!$scope.showCheckbox) ||
                ($scope.showCheckbox && !$scope.savecopy) ||
                ($scope.savecopy && !$scope.reportFound && $scope.showCheckbox)){
                    retValue = true;
                }
                return retValue;
            };


            $scope.isYesNoEnabled = function(){
                var retValue = false;
                if($scope.showCheckbox && $scope.savecopy && $scope.reportFound){
                    retValue = true;
                }
                return retValue;
            };


            /* Call save() method on enter */
            $scope.callSave = function(event){
                if(event.which === KEY_PRESS_VARIABLE) {
                    $scope.save();
                }
            };

            /* Close dialog */
            function callConfirm(){
                $scope.confirm();
            }

            function shareUnsavedReportSuccessHandler(){
                $scope.sharedReportValidationMessage = $filter("translate")("REPORTS.SHARE_SUCCESS");
                $debounce(callConfirm, FIRST_TIMEOUT_TIMESET);
            }

            function callUnsavedReportShareService(){
                var savedReport = {
                    "description": $scope.reportDescription,
                    "url": $scope.getUrl(),
                    "name": $scope.saveObject.reportName
                };
                sharedNotSavedReportsService
                    .create({savedReport: savedReport, targetUserIds:$scope.saveObject.selectedUsersValueIds, message:$scope.saveObject.message})
                    .success(function(){
                        shareUnsavedReportSuccessHandler();
                    }).error(function(){
                        shareErrorHandler();

                    });
            }

            function overwriteWarning() {
                if($scope.showCheckbox && $scope.savecopy && $scope.reportFound){
                    $scope.sharedReportValidationMessage = $filter("translate")("REPORTS.OVERWRITE_WARNING");
                }else{
                    $scope.sharedReportValidationMessage = "";
                }
            }

            $scope.reportCheckMethod = function(){
                checkReportExists();
                overwriteWarning();
            };

            /* Call save functionality with all services */
            $scope.save = function(){
                $scope.okDisabled = false;
                $scope.cancelDisabled = true;
                googleAnalyticsService.gTrackEventUsage("button", "click", config.gaShareReport);
                $scope.sharedReportValidationMessage = $filter("translate")("REPORTS.IS_PROCESSING");
                $scope.shareOrSaveSuccess = true;

                if($scope.saveObject.selectedUsersValueIds.length>0 && $scope.saveObject.reportName.length>0){

                    if($scope.showCheckbox){
                        if($scope.savecopy){
                            callCreateReportService();
                        }else{
                            callUnsavedReportShareService();
                        }
                    }else{
                        shareSavedReport();
                    }

                }
                else{
                    /* When some fields are empty, add this message. */
                    $scope.sharedReportValidationMessage = $filter("translate")("REPORTS.COMPLETE_ALL_FIELDS");
                    $scope.okDisabled = false;
                }
            };

            /* The watches are defined directly in the controller instead of being placed in the initialize function
            ---Reason: The watches need a timeout to be defined before being declared. In order to avoid unnecessary
                            use of timeouts the watch code is placed within the controller.
            Fixing ADS-862 by setting focus on ngDialog in order to prevent multiple clicks-multiple dialog opens */
            $scope.$watch("$viewContentLoaded", function(){
                $timeout(function(){
                    document.getElementById("reportNameShare").focus();
                }, 0);
            });

            // /* Watch for report name changes and validate if report exists. */
            // $scope.$watch("saveObject.reportName", function(){
            //     $scope.checkReportExists();
            //     $scope.overwriteWarning();
            // });

        }
    ]);

}).call(this, angular);