/*global angular*/
(function(angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");

    app.controller("pubAlertsCtrl", [
        "$scope",
        "ngDialog",
        "$location",
        "$timeout",
        "$filter",
        "alertsService",
        "alertsReadService",
        "alertsConfigService",
        "alertsUserSettingService",
        "toastr",
        "$q",
        "userSharedReportsService",
        "googleAnalyticsService",
        "config",
        "$debounce",
        "$route",

        function($scope, ngDialog, $location, $timeout, $filter, alertsService, alertsReadService, alertsConfigService, alertsUserSettingService, toastr, $q, userSharedReportsService, googleAnalyticsService, config, $debounce, $route) {
            /* Initialize all necessary data and make all service calls at the beginning! */
            alertsInitializer();

            function alertsInitializer() {
                //set triangle indicator point to nothing
                $scope.currentPageIndicator("help");

                /* Google analytics page tracking. */
                googleAnalyticsService.gTrackPageUsage(config.gaViewAlerts);

                /* Update NLP text */
                $scope.navigateNLP("alerts");

                /* Variable and configuration initialization method */
                initVariables();

                /*  Initialize and load pmApiTable (View Alerts Tab) */
                initViewAlertsTable();
            }

            function initVariables() {
                $scope.alertsMainUserSetting = {};
                $scope.isQuerying = false;
                $scope.inputSelectedEmailData = [];
                $scope.buttonLabel = "";
                $scope.myresponse = [];
                $scope.filteredresponse = [];
                $scope.index = 0;
                $scope.alertRemove = true;
                $scope.alertsSelectedEmailModel = {};
                $scope.alertEmailSelectionSettings = {
                    align: "right",
                    labelProp: "fullName",
                    idProp: "emailIds",
                    externalIdProp: "emailIds",
                    showDeselectAll: true,
                    selectionLimit: 10
                };
                $scope.isReadyEmailSelection = false;
                $scope.alertPurgeArray = [{
                    name: "90 Days",
                    days: 90
                }, {
                    name: "60 Days",
                    days: 60
                }, {
                    name: "30 Days",
                    days: 30
                }];
                $scope.alertSelectionsCancel = function() {};
                $scope.alertSelectionsComplete = function() {};
                $scope.alertsMainUserSetting.deleteInDays = 30;
                $scope.newDeleteValue = $scope.baseValue = $scope.alertsMainUserSetting.deleteInDays;

                /* Store frequency information in this array. */
                $scope.alertFreqArray = [{
                    name: "Daily",
                    triggerFrequency: "DAILY",
                    emailContentType: "INDIVIDUAL"
                }, {
                    name: "Weekly",
                    triggerFrequency: "WEEKLY",
                    emailContentType: "INDIVIDUAL"
                }, {
                    name: "Monthly",
                    triggerFrequency: "MONTHLY",
                    emailContentType: "INDIVIDUAL"
                }];

                /* View/Manage Alerts Tab code */
                $scope.tabs = [{
                    title: "View Alerts",
                    url: "alertsList"
                }, {
                    title: "Manage Alerts",
                    url: "manageAlerts"
                }];

                $scope.currentTab = "alertsList";
                $scope.alertTypeArray = [{
                    name: "Show All"
                }, {
                    name: "Issues"
                }, {
                    name: "Opportunities"
                }];
                $scope.issuesOpportunitiesFilter = $scope.alertTypeArray[0].name;

                $scope.systemAlertsActive = true;
                $scope.userAlertsActive = false;
                $scope.currentTabManage = "systemAlertsList";
            }

            function initViewAlertsTable() {
                if (!$scope.alertZeroState) {
                    $scope.isQuerying = true;
                    /* Service call to fetch and display alerts on view alerts page */
                    alertsService.fetch().then(function(alertsFetch) {
                        $scope.myresponse = alertsFetch.data;
                        $scope.shownresponse = [];

                        /* --Change date from middleware to UI format
                           --Order by timestamp and display information.
                           --Load 50 records at a time - infinite scrolling */

                        angular.forEach($scope.myresponse, function(item) {
                            var result = item.createdAt.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/i);
                            item.createdAt = new Date(result[1], result[2] - 1, result[3], result[4], result[5], result[6]);
                        });

                        var sortBy = function(array) {
                            return array.createdAt.getTime() + "ID" + array.id;
                        };
                        $scope.myresponse = $filter("orderBy")($scope.myresponse, sortBy, true);
                        angular.forEach($scope.myresponse, function(item) {
                            item.createdAt = $filter("date")(item.createdAt, "EEE, MMM d h:mm a");
                        });
                        $scope.tempresponse = angular.copy($scope.myresponse);
                        $debounce(filterQuery.bind(this), 500);
                    });
                }
            }


            function initManageAlertsTable() {
                /* Method to convert trigger frequency to camel case for display purpose - Manage Alerts page */
                function toCamelCase(sentenceCase) {
                    var out = "";
                    sentenceCase.split(" ").forEach(function(el, idx) {
                        var add = el.toLowerCase();
                        out += (idx === 0 ? add : add[0].toUpperCase() + add.slice(1));
                    });
                    return out;
                }

                /* Service call to fetch Alert Rules/Configuration - Manage Alerts page */
                alertsConfigService.fetch("STANDARD").then(function(config) {
                    $scope.isQuerying = true;
                    $scope.alertRulesData = config.data;
                    /* Pull all email Ids from user account */
                    userSharedReportsService.fetch().then(function(modelItem) {
                        $scope.emailIdListInfo = angular.copy(modelItem.data);
                        /* Initially set each alert rule's delivery dropdown with the list of emails. */
                        $scope.initialMultiSelectCtrlEmailList = [];
                        angular.forEach($scope.emailIdListInfo, function(userAccountInfo) {
                            $scope.initialMultiSelectCtrlEmailList.push({
                                emailIds: userAccountInfo.email,
                                firstName: userAccountInfo.firstName,
                                lastName: userAccountInfo.lastName,
                                fullName: userAccountInfo.firstName + " " + userAccountInfo.lastName
                            });
                        });
                        $scope.initialMultiSelectCtrlEmailList = $filter("orderBy")($scope.initialMultiSelectCtrlEmailList, ["firstName", "lastName"], false);
                        angular.forEach($scope.alertRulesData, function(item) {
                            item.triggerFrequency = toCamelCase(" " + item.triggerFrequency);
                            item.emailContentType = "INDIVIDUAL";

                            $scope.inputSelectedEmailData[item.id] = $scope.initialMultiSelectCtrlEmailList;
                            $scope.alertsSelectedEmailModel[item.id] = [];
                            item.emailIds.map(function(email) {
                                $scope.inputSelectedEmailData[item.id].map(function(emailObj) {
                                    if (emailObj.emailIds === email) {
                                        $scope.alertsSelectedEmailModel[item.id].push({
                                            emailIds: emailObj.emailIds,
                                            fullName: emailObj.fullName
                                        });
                                    }
                                });
                            });

                        });
                        $scope.isReadyEmailSelection = true;
                        $scope.isQuerying = false;
                    });
                });
            }

            function initManageAlertsMasterConfig() {
                /* Service call to fetch
               -- Master Alerts configuration
               -- Master Email configuration
               -- Delete in Days configuration */
                $scope.isQuerying = true;
                alertsUserSettingService.fetch().then(function(config) {
                    if (config.data) {
                        $scope.alertsMainUserSetting = config.data;
                        $scope.newDeleteValue = $scope.baseValue = $scope.alertsMainUserSetting.deleteInDays;
                    }
                });
            }

            $scope.callStopPropagation = function(event) {
                event.stopPropagation();
            };

            /* Code to load 50 records or else default to 100 records on view alerts pmApiTable scroll */
            function loadMore(step) {
                step = step || 100;
                $scope.shownresponse = [];
                for (var i = 0; i < step; i++) {
                    if ($scope.myresponse && $scope.myresponse[$scope.index]) {
                        $scope.shownresponse.push($scope.myresponse[$scope.index]);
                        $scope.index += 1;
                    }
                }
            }

            /* Filter data for pmApiTable based on search text */
            function applyQuery() {
                if ($scope.searchText && $scope.searchText.length !== 0) {
                    $scope.myresponse = $filter("filter")($scope.filteredresponse, {
                        message: $scope.searchText
                    });
                } else {
                    $scope.myresponse = $scope.filteredresponse;
                }
                $scope.index = 0;
                loadMore(50);
            }

            /* Filter data for alerts based on Issue type
                -- Show All
                -- Issues
                -- Opportunities */
            function filterQuery() {
                $scope.isQuerying = true;
                if ($scope.issuesOpportunitiesFilter === "Issues") {
                    $scope.myresponse = $filter("filter")($scope.tempresponse, {
                        rank: 5
                    });
                } else if ($scope.issuesOpportunitiesFilter === "Opportunities") {
                    $scope.myresponse = $filter("filter")($scope.tempresponse, {
                        rank: 1
                    });
                } else {
                    $scope.myresponse = angular.copy($scope.tempresponse);
                }
                $scope.filteredresponse = angular.copy($scope.myresponse);
                applyQuery();
                $scope.isQuerying = false;

                /* Update all alerts as read */
                alertsReadService.update();
            }

            /* Filter data based on search text for View Alerts Table */
            $scope.filterViewAlertsSearch = function() {
                $debounce(applyQuery.bind(this), 500);
            };

            $scope.changeFilter = function() {
                $debounce(filterQuery.bind(this), 500);
            };

            $scope.openManageAlertsScreen = function() {
                $location.url("/managealerts");
            };

            $scope.removeAlertRow = function(item) {


                alertsService.destroy(item.id).success(initViewAlertsTable);

            };

            $scope.onClickTab = function(tab) {
                $scope.currentTab = tab.url;
                if ($scope.currentTab === "manageAlerts") {
                    /* Initialize Master configuration Purging, Alerts Master configuration and Email Master configuration */
                    initManageAlertsMasterConfig();

                    /* Initialize Alert Rules in Manage Alerts Tab */
                    initManageAlertsTable();
                    googleAnalyticsService.gTrackPageUsage(config.gaManageAlerts);
                } else {
                    if (($location.path() === "/alerts")) {
                        $route.reload();
                    } else {
                        $location.url("/alerts");
                    }
                    googleAnalyticsService.gTrackPageUsage(config.gaViewAlerts);
                }
            };

            $scope.isActiveTab = function(tabUrl) {
                return tabUrl === $scope.currentTab;
            };

            function fetchUserSetting() {
                alertsUserSettingService.fetch().then(function(config) {
                    if (config.data) {
                        $scope.baseValue = $scope.alertsMainUserSetting.deleteInDays;
                        $scope.alertsMainUserSetting = config.data;
                    }
                });
                toastr.success($filter("translate")("ALERTS.SAVE_NOTIFICATION"), "", {
                    timeOut: 3000
                });
            }

            $scope.callSaveAlerts = function() {
                var saveNotificationMessage, errorNotificationMessage;
                saveNotificationMessage = $filter("translate")("ALERTS.SAVE_NOTIFICATION");
                errorNotificationMessage = $filter("translate")("ALERTS.ERROR_NOTIFICATION");

                angular.forEach($scope.alertRulesData, function(ruleObject) {
                    ruleObject.emailIds = [];
                    angular.forEach($scope.alertsSelectedEmailModel[ruleObject.id], function(emailObject) {
                        ruleObject.emailIds.push(emailObject.emailIds);
                    });
                });

                $scope.saveNotification = {
                    template: saveNotificationMessage,
                    type: "success",
                    hasDelay: true,
                    delay: 3000,
                    position: "top center"
                };
                $scope.errorNotification = {
                    template: errorNotificationMessage,
                    type: "error",
                    hasDelay: true,
                    delay: 3000,
                    position: "top center"
                };

                /* Update Alert Rules - Manage Alerts tab */
                alertsConfigService
                    .update(null, $scope.alertRulesData)
                    .success(function() {

                        /* Update main configuration settings(Purging, Master Email On/Off and Master Alerts On/Off) */
                        if ($scope.alertsMainUserSetting && $scope.alertsMainUserSetting.isNew) {
                            alertsUserSettingService
                                .create($scope.alertsMainUserSetting)
                                .success(function() {
                                    fetchUserSetting();
                                })
                                .error(function() {
                                    toastr.error($filter("translate")("ALERTS.ERROR_NOTIFICATION"), "", {
                                        timeOut: 3000
                                    });
                                });
                        } else {
                            alertsUserSettingService
                                .update($scope.alertsMainUserSetting.id, $scope.alertsMainUserSetting)
                                .success(function() {
                                    fetchUserSetting();
                                })
                                .error(function() {
                                    toastr.error($filter("translate")("ALERTS.ERROR_NOTIFICATION"), "", {
                                        timeOut: 3000
                                    });
                                });
                        }

                    })
                    .error(function() {
                        toastr.error($filter("translate")("ALERTS.ERROR_NOTIFICATION"), "", {
                            timeOut: 3000
                        });
                    });
            };

            $scope.saveAlerts = function() {
                var disallowNoUsersSelected = [],
                    alertNoUsersSelected = false;
                angular.forEach($scope.alertRulesData, function(item) {
                    disallowNoUsersSelected[item.id] = false;
                    disallowNoUsersSelected[item.id] = $scope.alertsMainUserSetting.emailSwitch && $scope.alertsMainUserSetting.featureSwitch && item.featureSwitch && item.emailSwitch && $scope.alertsSelectedEmailModel[item.id].length === 0;
                });
                for (var key in disallowNoUsersSelected) {
                    if (disallowNoUsersSelected[key] === true) {
                        alertNoUsersSelected = true;
                    }
                }

                if (alertNoUsersSelected) {
                    ngDialog.openConfirm({
                        template: "modules/pubAlerts/pubAlertsNoUsersSelectedDialog.html",
                        scope: $scope,
                        controller: "NoUsersSelectedCtrl",
                        closeByDocument: true,
                        closeByEscape: false,
                        showClose: false
                    });
                } else if ($scope.newDeleteValue < $scope.baseValue) {
                    ngDialog.openConfirm({
                        template: "modules/pubAlerts/pubAlertsDeleteConfirmationDialog.html",
                        scope: $scope,
                        controller: "DeleteCtrl",
                        closeByDocument: true,
                        closeByEscape: false,
                        showClose: false
                    }).then(function(data) {
                        if (data) {
                            $scope.alertsMainUserSetting.deleteInDays = $scope.newDeleteValue;
                            $scope.callSaveAlerts();
                        }
                    });
                } else {
                    $scope.callSaveAlerts();
                }

            };
        }
    ]);

}).call(this, angular);
