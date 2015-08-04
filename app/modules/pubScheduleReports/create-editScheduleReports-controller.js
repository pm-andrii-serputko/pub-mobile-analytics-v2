/*global angular*/
(function (angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");

    app.controller("scheduleReportCtrl", [
        "$scope",
        "ScheduleReportModel",
        "scheduleReportsService",
        "$timeout",
        "pubAnalyticService",
        "googleAnalyticsService",
        "config",
        "$filter",
        "$debounce",

        function ($scope, ScheduleReportModel, scheduleReportsService, $timeout, pubAnalyticService, googleAnalyticsService, config, $filter, $debounce) {
            /*Init call.*/
            initialize("new");

            /*Initialization/ Reset method for variables based on the type. */
            function initialize(type){
                $scope.scheduleSuccess=false;
                $scope.duplicateReport = false;
                $scope.scheduleReportValidationMessage = "";
                if(type==="new"){
                    //Check and retrieve model in edit mode or create mode based on schedule report id.
                    $scope.model = scheduleReportsService.findById($scope.scheduleReportId) ||
                                new ScheduleReportModel({reportId: $scope.reportId,reportType: $scope.reportType});

                    //Variable Initialization.
                    $scope.lookup = angular.copy($scope.model.attributes);
                    $scope.timeZone = pubAnalyticService.getTimezone();
                    $scope.freqArray = [
                        { id: "DAILY", name: "Daily" },
                        { id: "WEEKLY", name: "Weekly" },
                        { id: "MONTHLY", name: "Monthly" }
                    ];

                    $scope.periodArray = [
                        { id: "AM", name: "AM" },
                        { id: "PM", name: "PM" }
                    ];
                    //Creating hour select options
                    $scope.hourArray = Array.apply(null, new Array(12)).map(function (_, i) {return { id: i+1, name: i+1 }; });
                    $scope.hourArray = $filter("orderBy")($scope.hourArray, ["id"], false);
                    $debounce(preventMultipleDropdownClicks, 100);
                    $debounce(updateFrequencyDropdown, 100);

                }else if(type==="save"){
                    $scope.duplicateReport = $scope.checkMatchingReport();
                }
            }


            /* Method to check if report is a duplicate or not */
            $scope.checkMatchingReport = function(){
                var allReports = scheduleReportsService.all(),
                    result=false;
                allReports.filter(function(report){
                    if($scope.lookup.reportId === report.attributes.reportId &&
                        $scope.lookup.frequency === report.attributes.frequency &&
                        $scope.lookup.email === report.attributes.email &&
                        $scope.lookup.hour === report.attributes.hour &&
                        $scope.lookup.ampm === report.attributes.ampm &&
                        $scope.lookup.day === report.attributes.day &&
                        $scope.lookup.subject === report.attributes.subject &&
                        $scope.lookup.downloadType === report.attributes.downloadType &&
                        $scope.lookup.reportId === report.attributes.reportId &&
                        $scope.lookup.reportType === report.attributes.reportType){
                        result =true;
                    }
                });
                return result;
            };

            /* Populate frequency/days/month/period dropdowns */
            $scope.populateDaysBasedOnFrequency = function(newVal){
                //Code related to frequency
                newVal = newVal.frequency || newVal;
                if(newVal && newVal ==="DAILY"){
                    $scope.removeDay = true;
                    $scope.lookup.frequency = $scope.freqArray[0].id;
                    $scope.lookup.day = 1;
                } else if (newVal && newVal==="WEEKLY"){
                    $scope.removeDay = false;
                    $scope.lookup.frequency = $scope.freqArray[1].id;
                    //Create weekly frequency options
                    $scope.dayArray = [
                        { id: 1, name: "Monday" },
                        { id: 2, name: "Tuesday" },
                        { id: 3, name: "Wednesday" },
                        { id: 4, name: "Thursday" },
                        { id: 5, name: "Friday" },
                        { id: 6, name: "Saturday" },
                        { id: 7, name: "Sunday" }
                    ];
                    if($scope.lookup.day>7){
                        $scope.lookup.day = 1;
                    }

                } else if(newVal && newVal==="MONTHLY"){
                    $scope.removeDay = false;
                    $scope.lookup.frequency = $scope.freqArray[2].id;
                    $scope.dayArray = Array.apply(null, new Array(31)).map(function (_, i) {return { id: i+1, name: i+1 }; });
                    $scope.dayArray = $filter("orderBy")($scope.dayArray, ["id"], false);
                }
            };

            function preventMultipleDropdownClicks(){
                /*Fixing ADS-862 by setting focus on ngDialog in order to prevent multiple clicks-multiple dialog opens */
                $scope.$watch("$viewContentLoaded", function(){
                    $timeout(function(){
                        document.getElementById("inputEmail").focus();
                    }, 0);
                });
            }

            function updateFrequencyDropdown(){
                /* Watch used to pre-populate frequency, day, month, period and also apply changes based on change. */
                $scope.$watchCollection("lookup", $scope.populateDaysBasedOnFrequency, true);
            }

            function saveSuccessHandler(data){
                $scope.scheduleReportValidationMessage = $filter("translate")("REPORTS.SCHEDULE_SUCCESS");
                $timeout(function() {
                    $scope.confirm(data);
                }, 2000);
            }

            function saveErrorHandler(){
                $scope.scheduleSuccess=false;
                $scope.scheduleReportValidationMessage = $filter("translate")("REPORTS.SCHEDULE_FAILURE");
            }

            function callUpdateScheduleReportsService(){
                scheduleReportsService
                    .update($scope.scheduleReportId, $scope.model.toJSON($scope.lookup))
                    .success(function (data) {
                        saveSuccessHandler(data);
                    })
                    .error(function(){
                        saveErrorHandler();
                    });
            }

            function callCreateScheduleReportsService(){
                scheduleReportsService
                    .create($scope.model.toJSON($scope.lookup))
                    .success(function (data) {
                        saveSuccessHandler(data);
                    })
                    .error(function(){
                        saveErrorHandler();
                    });
            }

            /*Save changes to DB and apply appropriate validation messages if necessary */
            $scope.save = function () {
                googleAnalyticsService.gTrackEventUsage("button", "click", config.gaScheduleReport);
                initialize("save");
                if($scope.duplicateReport && !$scope.scheduleReportId){
                    $scope.scheduleReportValidationMessage = $filter("translate")("REPORTS.DUPLICATE_REPORT_MESSAGE");
                }
                else{
                    if($scope.subjectForm.subject.$valid && $scope.emailForm.email.$valid){
                        $scope.scheduleSuccess=true;
                        $scope.scheduleReportValidationMessage = $filter("translate")("REPORTS.SCHEDULING");
                        if($scope.scheduleReportId){
                            callUpdateScheduleReportsService();
                        } else {
                            callCreateScheduleReportsService();
                        }
                    }
                    else{
                        if(!$scope.subjectForm.subject.$valid){
                            $scope.scheduleReportValidationMessage = $filter("translate")("REPORTS.SCHEDULE_REQUIRED_SUBJECT");
                        }
                        if($scope.lookup.email && $scope.emailForm.email.$error.multipleEmails){
                            $scope.scheduleReportValidationMessage = $filter("translate")("REPORTS.SCHEDULE_WRONG_EMAIL_FORMAT");
                        }
                        else if(!$scope.lookup.email){
                            $scope.scheduleReportValidationMessage = $filter("translate")("REPORTS.SCHEDULE_REQUIRED_EMAIL");
                        }

                    }
                }

            };

        }
    ]);

}).call(this, angular);