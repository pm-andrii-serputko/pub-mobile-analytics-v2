/*global angular*/
(function(angular) {
    "use strict";

    var app;

    app = angular.module("pubSlicerApp");

    app.controller("PubDashboardCtrl", [
        "$scope",
        "$filter",
        "pubAnalyticService",
        "dataFormattingService",
        "dashboardService",
        "googleAnalyticsService",
        "config",
        "pubUniversalAnalyticService",
        "$location",



        function($scope, $filter, pubAnalyticService, dataFormattingService, dashboardService, googleAnalyticsService, config, pubUniversalAnalyticService, $location) {


            var isPublisher = pubAnalyticService.getUserType() === "publisher";
            var isBuyer = pubAnalyticService.getUserType() === "buyer";
            var isDSP = pubAnalyticService.getUserType() === "dsp";
            $scope.metadataTimezone = pubAnalyticService.getTimezone();
            $scope.dimensionDropdownFlag = true;
            $scope.dimensionSelectionsModel = [];
            $scope.selectedDimensions = [];
            $scope.dimensionIndex = 0;
            $scope.isReadyDimensions = false;
            $scope.selectDimensionFilter = selectDimensionFilter;
            $scope.selectionsCancel = function() {};
            $scope.dimensionSelectionsSettings = {
                align: "right",
                labelProp: "name",
                idProp: "name",
                externalIdProp: "name",
                showSelectAll: true,
                showDeselectAll: true
            };

            $scope.getClass = function() {
                return "dash-table-left";
            };

            $scope.radioBtnClick = function(metric) {
                $scope.radoBtnCheckList[metric].checked = !$scope.radoBtnCheckList[metric].checked;
                if ($scope.radoBtnCheckList[metric].checked) {
                    $scope.totalRadioBtnChecked++;
                    $scope.radoBtnCheckList[metric].btnClass = "fa fa-circle";
                } else {
                    $scope.totalRadioBtnChecked--;
                    $scope.radoBtnCheckList[metric].btnClass = "fa fa-circle-o";
                }
            };

            /* Live Bar controller */
            $scope.colorFunction = function(metric) {
                return function(d, i) {
                    return $scope[metric + "Color"][i];
                };
            };

            /*
                The UTC epoch date/time in the realtime DataTorrent response is unfortunately in UTC of the Account's time zone.
                If you convert this directly to a Javascript Date object, Javascript with always try to convert this to
                your local browser's timezone.
                To correct this fault of the DT platform, we add the timezone offset to the epochtime to get back to Account's time
                (also add the Daylight Savings Time (dst) offset to the timezone offset)
             */
            function correctEpochTimeOfRealtimeDataTorrent(epochTime) {
                var d = new Date();
                var timezoneOffsetInMilliseconds = d.getTimezoneOffset() * 60 * 1000; // offset in minutes * 60 min * 1000ms
                var dateInAccountTimeZone = new Date(epochTime + timezoneOffsetInMilliseconds);

                return dateInAccountTimeZone;
            }

            $scope.xAxisTimeFunction = function() {
                return function(d) {
                    //if ((i=== 0) || (i === $scope["revenueRealTimeData"][0].values.length-1))  {
                    var date = correctEpochTimeOfRealtimeDataTorrent(d);
                    var formattedTime = $filter("date")(date, "hh:mm");
                    return formattedTime;
                    //}
                    // else {
                    //   return "";
                    // }
                };
            };

            $scope.yAxisFunction = function(metricId, currency) {
                return function(d) {
                    return dataFormattingService.format(metricId, d, currency);
                };
            };

            $scope.toolTipFunction = function(key, x, y, e) {
                var date = correctEpochTimeOfRealtimeDataTorrent(e.point[0]);
                var formattedTime = $filter("date")(date, "h:mm a");

                return "<p>" + formattedTime + "<br/>" + key + ": " + y + "</p>";
            };

            $scope.toggleLiveData = function(val) {
                $scope.isLive = val;

                if ($scope.isLive === false) {
                    dashboardService.stopPolling();
                } else {
                    $scope.getLiveData();
                }
            };

            $scope.updateDailySummary = function(response) {
                $scope.dailySummary = dashboardService.parseDaySummary(response);
                var accountTime = correctEpochTimeOfRealtimeDataTorrent(Number($scope.dailySummary.timestamp));
                $scope.currentDate = $filter("date")(accountTime, "MMM dd, yyyy");
            };

            $scope.getLiveData = function() {
                dashboardService.startPollingDaySummary().then(null, null, $scope.updateDailySummary);

                $scope.metricList.map(function(metric) {
                    dashboardService.startPollingTimeSeries(metric.getId()).then(null, null, function(response) {
                        $scope.updateTimeSeries(response, metric.getId());
                    });
                });

                $scope.changeMetric();

            };

            $scope.updateTimeSeries = function(response, metricId) {
                $scope[metricId + "Currency"] = response.currency;
                $scope[metricId + "RealTimeData"] = dashboardService.parseTimeSeries(response, metricId);
            };

            ///////////////////////////////////////////////////////
            //Live data ends here
            //////////////////////////////////////////////////////



            //////////////////////////////////////////////////////
            //Top ten starts here
            //////////////////////////////////////////////////////


            $scope.updateAllSites = function(response) {
                //TODO translate select site
                $scope.allSites.push($scope.selectedSite);
                $scope.allSites = $scope.allSites.concat(response);
                $scope.selectedSite = $scope.allSites[0];
            };

            $scope.getTopTenByDimensionList = function() {
                var topTenByDimensionList = $scope.dimensions.models.filter(function(model) {
                    var list = ["timeUnit", "timestamp"];
                    return list.indexOf(model.getId()) === -1;
                });

                if (isDSP) {
                    topTenByDimensionList = topTenByDimensionList.filter(function(model) {
                        var list = ["dspId"];
                        return list.indexOf(model.getId()) === -1;
                    });
                }

                if (isPublisher) {
                    topTenByDimensionList = topTenByDimensionList.filter(function(model) {
                        var list = ["pubId", "siteId"];
                        return list.indexOf(model.getId()) === -1;
                    });
                }

                if (isBuyer) {
                    topTenByDimensionList = topTenByDimensionList.filter(function(model) {
                        var list = ["atdId"];
                        return list.indexOf(model.getId()) === -1;
                    });
                }

                return topTenByDimensionList;
            };

            function findByName(obj, value) {
                var match = false;
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i].name === value) {
                        match = true;
                    }
                }
                return match;
            }

            function selectDimensionFilter(itemObject) {
                angular.forEach($scope.availableDimensions, function(model) {
                    if (findByName(itemObject, model.name)) {
                        model.ticked = true;
                    } else {
                        model.ticked = false;
                    }
                });

                $scope.selectedDimensions = $scope.availableDimensions.filter(function(model) {
                    return model.ticked;
                });
            }

            $scope.updateTopTenByDimension = function(response, dimension) {

                if ($scope.availableDimensions.length === 0) {

                    $scope.availableDimensions = $scope.getTopTenByDimensionList().map(function(model) {
                        return {
                            name: model.getName(),
                            contents: [],
                            ticked: true
                        };
                    });
                }

                $scope.loadingTopTen = false;
                $scope.isReadyDimensions = true;
                angular.forEach($scope.availableDimensions, function(each) {
                    if (dimension === each.name) {
                        each.contents = response;
                        for (var i = response.length; i < 10; i++) {
                            each.contents.push({
                                "name": "",
                                "value": ""
                            });
                        }
                    }
                });

                $scope.selectedDimensions = $scope.availableDimensions.filter(function(model) {
                    return model.ticked;
                });
            };

            $scope.changeMetric = function() {
                if (!$scope.isLive) {
                    return;
                }

                dashboardService.stopPollingTopQueries();

                var metricId = $scope.currentViewBy.getId();
                var siteId = isPublisher ? $scope.selectedSite.id : null;
                $scope.currentViewByName = $scope.currentViewBy.getName();
                $scope.dimensionSelectionsModel = $scope.getTopTenByDimensionList().map(function(model) {
                    return {
                        name: model.getName()
                    };
                });
                angular.forEach($scope.getTopTenByDimensionList(), function(dimension) {
                    dashboardService.startPollingTopQueries(metricId, dimension.getId(), siteId).then(null, null, function(response) {
                        response = dashboardService.parseTopQueries(response, metricId, dimension.getId());
                        $scope.updateTopTenByDimension(response, dimension.getName());
                    });
                });
            };

            $scope.changeSelectedSite = function() {
                $scope.changeMetric();

                $scope.isInitialSiteSelected = true;
                $scope.loadingTopTen = true;
                $scope.changeCurrentViewBy();
            };

            $scope.changeCurrentViewBy = function() {
                $scope.changeMetric();
                angular.forEach($scope.availableDimensions, function(each) {
                    each.contents = [{
                        "name": "Loading...",
                        "value": "N/A"
                    }];
                });
                angular.forEach($scope.selectedDimensions, function(each) {
                    each.contents = [{
                        "name": "Loading...",
                        "value": "N/A"
                    }];
                });
            };



            //set dashboard default values;
            $scope.dashboardInit = function() {
                if (pubUniversalAnalyticService.isAggregator()) {
                    $location.url("/");
                } else {
                    $scope.navigateNLP("dashboard");
                    $scope.currentPageIndicator("dashboard");
                }
                googleAnalyticsService.gTrackPageUsage(config.gaDashboard);



                var publisherList, metrics;

                publisherList = pubAnalyticService.getPublisherList();
                metrics = pubAnalyticService.getRealtimeMetrics();
                $scope.metricList = metrics.getDefaultMetricList();

                // NOTE: now application uses first publisherId from publisherList.
                $scope.publisherId = publisherList[0];
                $scope.dailySummary = [];
                $scope.revenueColor = ["#2ca02c"];
                $scope.spendColor = ["#2ca02c"];
                $scope.paidImpressionsColor = ["#3182bd"];
                $scope.ecpmColor = ["#cb981f"];
                $scope.currentViewBy = $scope.metricList[0];
                $scope.dimensions = pubAnalyticService.getRealtimeDimensions();
                $scope.availableDimensions = [];
                $scope.isLive = true;
                $scope.showSites = false;
                $scope.isInitialSiteSelected = false;

                $scope.allSites = [];



                $scope.radoBtnCheckList = {};
                $scope.radoBtnCheckList.paidImpressions = {
                    "checked": true,
                    "btnClass": "fa fa-circle"
                };
                $scope.radoBtnCheckList.ecpm = {
                    "checked": true,
                    "btnClass": "fa fa-circle"
                };

                if (isPublisher) {
                    $scope.showSites = true;
                    $scope.radoBtnCheckList.revenue = {
                        "checked": true,
                        "btnClass": "fa fa-circle"
                    };
                    $scope.selectedSite = {
                        name: "All Sites",
                        id: "allSites"
                    };
                    dashboardService.getAllSites().then($scope.updateAllSites);

                    $scope.loadingTopTen = true;
                }
                if (isBuyer) {
                    $scope.radoBtnCheckList.spend = {
                        "checked": true,
                        "btnClass": "fa fa-circle"
                    };
                    $scope.loadingTopTen = true;
                }
                if (isDSP) {
                    $scope.radoBtnCheckList.spend = {
                        "checked": true,
                        "btnClass": "fa fa-circle"
                    };
                    $scope.loadingTopTen = true;
                }
                $scope.getLiveData();
                $scope.totalRadioBtnChecked = 3;

            };

            $scope.dashboardInit();
        }
    ]);
}).call(this, angular);
