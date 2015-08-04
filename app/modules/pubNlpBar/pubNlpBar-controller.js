/*global angular*/
(function(angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");

    app.controller("pubNlpBarCtrl", [
        "$scope",
        "$route",
        "pubAnalyticService",
        "alertsUserSettingService",
        "slicerURLParamsService",
        "alertsCountService",
        "$document",
        "googleAnalyticsService",
        "config",
        "alertsService",
        "$filter",
        "$location",
        "mediator",

        function($scope, $route, pubAnalyticService, alertsUserSettingService, slicerURLParamsService, alertsCountService, $document, googleAnalyticsService, config, alertsService, $filter, $location, mediator) {


            $scope.clearNlp = function() {
                $scope.textProcessed = false;
                slicerURLParamsService.reset();
                $scope.nlpDisplay = "";
            };

            $scope.currentPageIndicator = function(currentPath) {
                $scope.analyticPromise.then(function() {
                    angular.forEach($scope.selectedMenu.links, function(each) {
                        each.class = (each.path === currentPath) ? "selected" : "";
                    });
                });
            };

            $scope.openAlertsConfirm = function() {
                if (!$scope.alertZeroState && $scope.alertCount === 0) {
                    $scope.noAlertsAvailable = true;
                }
                $scope.alertDropdownClosed = true;
                if (!$scope.setMutex) {

                    googleAnalyticsService.gTrackEventUsage("button", "click", config.gaShowAlertDropdown);
                    $scope.alertsNotificationResponse = [];
                    $scope.alertDisplay = true;

                    alertsService.fetch(null, "5").then(function(alerts) {
                        $scope.alertsNotificationResponse = alerts.data;
                        angular.forEach($scope.alertsNotificationResponse, function(item) {
                            var result = item.createdAt.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/i);
                            item.createdAt = new Date(result[1], result[2] - 1, result[3], result[4], result[5]);
                        });
                        $scope.alertsNotificationResponse = $filter("orderBy")($scope.alertsNotificationResponse, ["createdAt"], true);
                        var timezone = pubAnalyticService.getTimezone();
                        angular.forEach($scope.alertsNotificationResponse, function(item) {
                            item.createdAt = $filter("date")(item.createdAt, "EEE, MMM d") + " at " + $filter("date")(item.createdAt, "h:mm a") + " " + timezone;
                        });

                        //if not already set, set mutex to true, if not set it to false to prevent race condition.
                        $scope.setMutex = $scope.setMutex ? false : true;
                        $scope.checkedNotification = !$scope.checkedNotification;
                    });
                } else {
                    $scope.alertDisplay = false;
                    $scope.checkedNotification = !$scope.checkedNotification;
                    $scope.setMutex = false;
                }
            };

            $scope.openListView = function() {
                $scope.alertDisplay = false;
                $scope.alertDropdownClosed = false;
                $scope.checkedNotification = !$scope.checkedNotification;
                $scope.setMutex = false;
                $scope.removeBadge = true;
                if (($location.path() === "/alerts")) {
                    $route.reload();
                } else {
                    $location.url("/alerts");
                }
            };

            //Alert Notification Screen code!
            var addAll = function() {
                var countPromise = alertsCountService.fetch();
                countPromise.then(function(countInfo) {
                    $scope.alertCount = countInfo.data.unreadCount;
                    if ($scope.alertCount === 0) {
                        $scope.removeBadge = true;

                        var userSettingPromise = alertsUserSettingService.fetch();
                        userSettingPromise.then(function(config) {
                            if (config.data.isNew) {
                                $scope.alertZeroState = true;
                                $scope.removeBadge = false;
                                $scope.alertCount = 1;
                            }
                        });
                    } else {
                        $scope.removeBadge = false;
                    }
                });
            };

            var alertInit = function() {
                $scope.removeBadge = true;
                $scope.setMutex = false;
                $scope.checkedNotification = true;
                $scope.alertZeroState = false;
                $scope.alertDropdownClosed = false;
                $scope.noAlertsAvailable = false;
                addAll();
            };

            var updateAlertIcon = function() {
                $scope.isLoadedAlerts = true;
                alertInit();
            };
            $scope.removeBadge = true;

            mediator.subscribe("nlp.updateAlert", function() {
                updateAlertIcon();
            });



            mediator.subscribe("nlp.currentPageIndicator", function(category) {
                $scope.currentPageIndicator(category);
            });
        }
    ]);

}).call(this, angular);
