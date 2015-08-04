(function(angular) {
    "use strict";

    var app;

    app = angular.module("pubSlicerApp");


    app.controller("PubSlicerScreenCtrl", [
        "$scope",
        "$rootScope",
        "pubAnalyticService",
        "ngDialog",
        "$filter",
        "historicApiService",
        "DateModel",
        "slicerURLParamsService",
        "pmTokenStorageService",
        "chartModel",
        "savedReportsService",
        "commonReportsService",
        "$location",
        "dataFormattingService",
        "toastr",
        "pubURLService",
        "mediator",
        "googleAnalyticsService",
        "config",
        "$document",
        "dimensionValuesService",
        "pageModel",


        function($scope, $rootScope, pubAnalyticService, ngDialog, $filter, historicApiService, DateModel, slicerURLParamsService, tokenStorageService, chartModel, savedReportsService, commonReportsService, $location, dataFormattingService, toastr, pubURLService, mediator, googleAnalyticsService, config, $document, dimensionValuesService, pageModel) {

            $scope.showChart = function() {
                googleAnalyticsService.gTrackEventUsage("button", "click", config.gaShowChart);
                $scope.displayChart = true;
                var dimensions = pubAnalyticService.getHistoricDimensions(),
                    metrics = pubAnalyticService.getHistoricMetrics(),
                    isCompareOn = DateModel.getCompareFlag();

                if (isHeatMapCompareOn(dimensions, isCompareOn) || isScatterBubbleCompareOn(isCompareOn) || checkMetricLength(metrics)) {
                    $scope.changeChartType("barchart");
                }
            };

            var isHeatMapCompareOn = function(dimensions, isCompareOn) {
                var retValue = false;
                if ($scope.selectedChart === "heatmap" && dimensions.hasTimeunitHeatmapDimensions() && isCompareOn) {
                    retValue = true;
                }
                return retValue;
            };

            var isScatterBubbleCompareOn = function(isCompareOn) {
                var retValue = false;
                if (($scope.selectedChart === "scatterchart" || $scope.selectedChart === "bubblechart") && isCompareOn) {
                    retValue = true;
                }
                return retValue;
            };

            var checkMetricLength = function(metrics) {
                var retValue = false;
                if (($scope.selectedChart === "scatterchart" && metrics.getSelectedMetrics().length < 2) || ($scope.selectedChart === "bubblechart" && metrics.getSelectedMetrics().length < 3)) {
                    retValue = true;
                }
                return retValue;
            };

            $scope.tryAgain = function() {
                slicerScreenInit();
                if ($scope.updateDefaultChart) {
                    $scope.updateDefaultChart();
                }
            };

            $scope.buttonRedirect = function(destination) {
                pageModel.setIsModifyingExistingReport(true);

                var params = "";

                if ($location.search().customReportId) {
                    params = "&customReportId=" + $location.search().customReportId;
                }
                var hash = slicerURLParamsService.getUrl(destination, {
                    f: slicerURLParamsService.getEncodedData()
                });
                pubURLService.navigate(hash, true);
            };

            $scope.changeChartType = function(type) {
                if (type === "hide") {
                    $scope.displayChart = false;
                    $scope.selectedChart = type;

                    return;
                } else {
                    $scope.displayChart = true;
                }

                //if ($scope.selectedChart !== type){
                $scope.selectedChart = type;
                var chartAndTimeSeriesByArray = type.split("-");
                if (chartAndTimeSeriesByArray.length > 1) {
                    type = "linechart";
                    chartModel.setAggregation(chartAndTimeSeriesByArray[0]);
                }

                chartModel.setType(type);
                chartModel.setChangeChart(true);
                slicerURLParamsService.save();
                //}
            };


            $scope.showExportDropDown = false;
            $scope.exportDownloadHide = true;
            $scope.createIframe = function(src) {

                var iframe = angular.element("<iframe style='display:none' src=" + src + "></iframe>");
                var body = $document.find("body").eq(0);
                body.append(iframe);
            };

            /**
             * Export result to CSV
             */
            $scope.exportCSV = function() {
                googleAnalyticsService.gTrackEventUsage("button", "click", config.gaDownloadCSV);
                toastr.warning($filter("translate")("NOTIFICATION.DOWNLOAD_NOTIFIER"), "", {
                    timeOut: 5000
                });
                $scope.createIframe(historicApiService.exportData({
                    type: "csv"
                }));
                $scope.showExportDropDown = false;
            };

            /**
             * Export result to XLSX
             */
            $scope.exportXlsx = function() {
                googleAnalyticsService.gTrackEventUsage("button", "click", config.gaDownloadExcel);
                toastr.warning($filter("translate")("NOTIFICATION.DOWNLOAD_NOTIFIER"), "", {
                    timeOut: 5000
                });
                $scope.createIframe(historicApiService.exportData({
                    type: "xls"
                }));
                $scope.showExportDropDown = false;
            };



            /**
             * Open the save report dialog.
             */
            $scope.openSaveReport = function() {
                ngDialog.openConfirm({
                    template: "modules/popup/saveReport.html",
                    scope: $scope,
                    controller: "saveReportCtrl",
                    closeByDocument: true
                }).then(setEncodedUrl);
            };

            $scope.resetReportTypeAndId = function() {
                if ($location.search().customReportId) {
                    $scope.reportId = $location.search().customReportId;
                    $scope.reportType = "CUSTOM";
                } else if ($location.search().standardReportId) {
                    $scope.reportId = $location.search().standardReportId;
                    $scope.reportType = "STANDARD";
                } else {
                    $scope.reportType = "NEW";
                }
            };
            $scope.resetReportTypeAndId();

            /**
             * Open the create schedule report dialog.
             */
            $scope.createSharedReport = function() {
                $scope.loadReportUrl = slicerURLParamsService.getOnLoadReportUrl();
                $scope.resetReportTypeAndId();
                $scope.saveObject = {
                    reportName: $scope.reportTitle,
                    selectedUsersValueIds: [],
                    message: ""
                };

                ngDialog.openConfirm({
                    template: "modules/pubSharedReports/createSharedReports.html",
                    scope: $scope,
                    controller: "sharedReportCtrl",
                    closeByDocument: true,
                    closeByEscape: false
                }).then(function(isModified) {
                    if (isModified) {
                        setEncodedUrl();
                    }
                });
            };

            /**
             * Open the create schedule report dialog.
             */
            $scope.createScheduleReport = function() {
                googleAnalyticsService.gTrackPageUsage(config.gaScheduleAreportWindow);
                $scope.resetReportTypeAndId();
                $scope.scheduleReportId = null;

                ngDialog.openConfirm({
                    template: "modules/pubScheduleReports/create-editScheduleReports.html",
                    scope: $scope,
                    controller: "scheduleReportCtrl",
                    closeByDocument: true,
                    closeByEscape: false
                });
            };

            /**
             * Open the pub date dialog.
             */
            $scope.openConfirm = function() {
                DateModel.setOriginalAggregation(DateModel.getAggregation());
                if ($scope.dateCollectionObject.optionIndex === 8) {
                    $scope.dateParam = {
                        optionIndex: $scope.dateCollectionObject.optionIndex,
                        startDate: $scope.dateCollectionObject.startDate,
                        endDate: $scope.dateCollectionObject.endDate
                    };
                } else {
                    $scope.dateParam = {
                        optionIndex: $scope.dateCollectionObject.optionIndex
                    };
                }
                $scope.dateParam = JSON.stringify($scope.dateParam);

                ngDialog.openDropDown({
                    template: "<pub-date-dialog date-object=" + $scope.dateParam + " ></pub-date-dialog>",
                    plain: true,
                    containerClassName: "ngdropdown"
                }).then(function(dateCollectionObject) {

                    if (DateModel.getAggregation() === "hour") {
                        chartModel.setAggregation("hour");
                    } else {
                        chartModel.setAggregation("date");
                    }

                    if (dateCollectionObject.compareFlag === true) {
                        DateModel.setCompareFlag(true);
                        DateModel.setCompareStartDate(DateModel.tweakDate(dateCollectionObject.compareStartDate).startDate);
                        DateModel.setCompareEndDate(DateModel.tweakDate(dateCollectionObject.compareEndDate).endDate);
                        DateModel.setCompareValue("compareAbsoluteValue");
                        historicApiService.decorate("compareAbsoluteValue");
                    } else {
                        DateModel.setCompareFlag(false);
                        historicApiService.decorate("defaultValue");
                    }


                    DateModel.setStartDate(DateModel.tweakDate(dateCollectionObject.startDate).startDate);
                    DateModel.setEndDate(DateModel.tweakDate(dateCollectionObject.endDate).endDate);

                    dateCollectionObject.startDate = DateModel.getStartDate();
                    dateCollectionObject.endDate = DateModel.getEndDate();
                    $scope.dateCollectionObject = dateCollectionObject;

                    DateModel.setSelectedRangeId(dateCollectionObject.optionIndex);


                    slicerURLParamsService.save();
                }, function() {
                    DateModel.setAggregation(DateModel.getOriginalAggregation());
                    //call back function after trigger cancel button.
                });
            };

            $scope.changeCompareValue = function() {
                historicApiService.decorate($scope.compareValue);
                DateModel.setCompareValue($scope.compareValue);
                mediator.publish("compareValue_change");
                getTableData();
                getTotalData();
                mediator.publish("update-chart");
            };

            $scope.goToBenchmarking = function() {
                pubURLService.navigate("/benchmark");
            };

            $scope.updateChart = function(selected) {
                $scope.$broadcast("updateChart", selected);
            };

            //Multi drop down cancel selection function
            $scope.selectionsCancel = function() {};

            $scope.updateChartPrimaryMetric = function(selectedMetricModel) {
                //Handle for multi-select case since it return array only
                if (Array.isArray(selectedMetricModel)) {
                    selectedMetricModel = selectedMetricModel[0];
                }

                chartModel.setMetric(selectedMetricModel.id);
                if ($scope.selectedChart === "hour-linechart" || $scope.selectedChart === "date-linechart" || $scope.selectedChart === "week-linechart" || $scope.selectedChart === "month-linechart" || $scope.selectedChart === "quarter-linechart") {
                    $scope.availableMetricDualScaleList = [];
                    angular.forEach($scope.metricsCollection.getSelectedMetrics(), function(each) {
                        if (each.getId() !== chartModel.getMetric()) {
                            $scope.availableMetricDualScaleList.push({
                                name: each.getName(),
                                id: each.getId()
                            });
                        }
                    });

                    if ($scope.selectedDualScaleMetric[0] && $scope.selectedDualScaleMetric[0].id === selectedMetricModel.id) {
                        $scope.selectedDualScaleMetric = [$scope.availableMetricDualScaleList[0]];
                        chartModel.setDualScaleMetric($scope.selectedDualScaleMetric[0].id);
                        $scope.dualMetricName = $scope.metricsCollection.findMetricById($scope.selectedDualScaleMetric[0].id).getName() + DateModel.getCompareValueObject(1).label;
                    }
                } else if ($scope.selectedChart === "scatterchart" || $scope.selectedChart === "bubblechart") {
                    $scope.availableSecondaryMetricList = [];
                    $scope.availableTertiaryMetricList = [];
                    $scope.selectedSecondaryChartMetric = [];
                    $scope.selectedTertiaryChartMetric = [];
                    angular.forEach($scope.metricsCollection.getSelectedMetrics(), function(each) {
                        if (each.getId() !== chartModel.getMetric()) {
                            $scope.availableSecondaryMetricList.push({
                                name: each.getName(),
                                id: each.getId()
                            });
                        }
                    });
                    $scope.selectedSecondaryChartMetric = [$scope.availableSecondaryMetricList[0]];
                    angular.forEach($scope.availableSecondaryMetricList, function(each) {
                        if (each.id !== $scope.selectedSecondaryChartMetric[0].id) {
                            $scope.availableTertiaryMetricList.push({
                                name: each.name,
                                id: each.id
                            });
                        }
                    });
                    $scope.selectedTertiaryChartMetric = [$scope.availableTertiaryMetricList[0]];

                    updateScatterBubbleOrder();
                }

                $scope.updateChart($scope.selectedTableDimension);
            };

            $scope.updateChartSecondaryMetric = function() {
                $scope.availableTertiaryMetricList = [];
                $scope.selectedTertiaryChartMetric = [];
                angular.forEach($scope.availableSecondaryMetricList, function(each) {
                    if (each.id !== $scope.selectedSecondaryChartMetric[0].id) {
                        $scope.availableTertiaryMetricList.push({
                            name: each.name,
                            id: each.id
                        });
                    }
                });
                $scope.selectedTertiaryChartMetric = [$scope.availableTertiaryMetricList[0]];
                updateScatterBubbleOrder();
                $scope.updateChart($scope.selectedTableDimension);
            };

            $scope.updateChartTertiaryMetric = function(selectedMetricModel) {
                $scope.selectedTertiaryChartMetric = [];
                $scope.selectedTertiaryChartMetric = selectedMetricModel;
                updateScatterBubbleOrder();
                $scope.updateChart($scope.selectedTableDimension);
            };

            $scope.updateDualScaleMetric = function() {
                if (!$scope.selectedDualScaleMetric[0] || !$scope.selectedDualScaleMetric[0].id) {
                    chartModel.setIsDualScale(false);
                    chartModel.setDualScaleMetric(null);
                    $scope.isDualScale = false;
                } else {
                    chartModel.setIsDualScale(true);
                    chartModel.setDualScaleMetric($scope.selectedDualScaleMetric[0].id);
                    $scope.isDualScale = true;
                    $scope.dualMetricName = $scope.metricsCollection.findMetricById($scope.selectedDualScaleMetric[0].id).getName() + DateModel.getCompareValueObject(1).label;
                }
                $scope.updateChart($scope.selectedTableDimension);
            };

            function updateScatterBubbleOrder() {
                var scatterBubbleMetricOrder = [];
                if ($scope.selectedPrimaryChartMetric[0] && $scope.selectedSecondaryChartMetric[0]) {
                    scatterBubbleMetricOrder.push($scope.selectedPrimaryChartMetric[0].id);
                    scatterBubbleMetricOrder.push($scope.selectedSecondaryChartMetric[0].id);
                }
                if ($scope.selectedTertiaryChartMetric[0]) {
                    scatterBubbleMetricOrder.push($scope.selectedTertiaryChartMetric[0].id);
                }
                chartModel.setScatterBubbleMetricOrder(scatterBubbleMetricOrder);
            }

            function getTableData() {
                return historicApiService.getTableData().then(getTableDataSuccess, getDataError);
            }

            function getTableDataSuccess(data) {
                $scope.currencyError = data.alert;

                $scope.datafreshnessIndicator = "";
                //Data freshness code
                if (data.dataFreshness && data.dataFreshness.dataFreshnessHour) {
                    $scope.datafreshnessIndicator = $filter("date")(data.dataFreshness.dataFreshnessHour, "MMM d, y ha") + " " + data.dataFreshness.timeZone;
                }

                var currencyMetrics = data.columns.filter(function(column) {
                    return dataFormattingService.isCurrency(column.id);
                });

                $scope.showCurrencyError = (currencyMetrics.length > 0 && $scope.currencyError);

                $scope.slicerData = data;
                var tempDimensions = pubAnalyticService.getHistoricDimensions();
                tempDimensions = tempDimensions.getVisibleDimensions();

                $scope.tableDimensionList = [];
                if ($scope.slicerData.displayValue && tempDimensions[0]) {
                    angular.forEach($scope.slicerData.displayValue[tempDimensions[0].getId()], function(each, key) {
                        $scope.tableDimensionList.push({
                            id: key,
                            value: each
                        });
                    });
                }

                $scope.selectedTableDimension = [];
                $scope.tabularSpinner = false;

                if (chartModel.getType() === "heatmap") {
                    chartModel.setChangeChart(false);
                }
            }

            function getDataError() {
                $scope.tabularApiFailed = true;
                $scope.tabularSpinner = false;
            }

            function getTotalData() {
                return historicApiService.getTotalData({
                    total: true
                }).then(getTotalDataSuccess, getDataError);
            }

            function getTotalDataSuccess(data) {
                $scope.totalsData = data;
            }


            function chartListInit() {
                $scope.chartTypeList = [];
                if ($scope.lineHourEnable) {
                    $scope.chartTypeList.push({
                        label: "Time Series (Hour)",
                        value: "hour-linechart",
                        icon: "pmcc-ico-line"
                    });
                }
                if ($scope.lineDateEnable) {
                    $scope.chartTypeList.push({
                        label: "Time Series (Day)",
                        value: "date-linechart",
                        icon: "pmcc-ico-line"
                    });
                }
                if ($scope.lineWeekEnable) {
                    $scope.chartTypeList.push({
                        label: "Time Series (Week)",
                        value: "week-linechart",
                        icon: "pmcc-ico-line"
                    });
                }
                if ($scope.lineMonthEnable) {
                    $scope.chartTypeList.push({
                        label: "Time Series (Month)",
                        value: "month-linechart",
                        icon: "pmcc-ico-line"
                    });
                }
                if ($scope.lineQuarterEnable) {
                    $scope.chartTypeList.push({
                        label: "Time Series (Quarter)",
                        value: "quarter-linechart",
                        icon: "pmcc-ico-line"
                    });
                }

                var dropDownObject;
                dropDownObject = {
                    label: "Bar Chart",
                    value: "barchart",
                    icon: "pmcc-ico-bars"
                };
                if ($scope.totalDimensionNum === 0) {
                    dropDownObject.disable = true;
                    dropDownObject.title = $filter("translate")("SLICER.BARCHART_ALERT");
                }
                $scope.chartTypeList.push(dropDownObject);


                dropDownObject = {
                    label: "Pie Chart",
                    value: "piechart",
                    icon: "pmcc-ico-pie"
                };
                if ($scope.totalDimensionNum === 0) {
                    dropDownObject.disable = true;
                    dropDownObject.title = $filter("translate")("SLICER.PIECHART_ALERT");
                } else if ($scope.isCompare) {
                    dropDownObject.disable = true;
                    dropDownObject.title = $filter("translate")("SLICER.PIECHART_COMPARE_ALERT");
                }
                $scope.chartTypeList.push(dropDownObject);


                dropDownObject = {
                    label: "Scatter Plot",
                    value: "scatterchart",
                    icon: "pmcc-ico-scatter"
                };
                if ($scope.totalDimensionNum === 0 || $scope.totalMetricsNum < 2) {
                    dropDownObject.disable = true;
                    dropDownObject.title = $filter("translate")("SLICER.SCATTER_ALERT");
                } else if ($scope.isCompare) {
                    dropDownObject.disable = true;
                    dropDownObject.title = $filter("translate")("SLICER.SCATTER_COMPARE_ALERT");
                }

                $scope.chartTypeList.push(dropDownObject);

                dropDownObject = {
                    label: "Bubble Chart",
                    value: "bubblechart",
                    icon: "pmcc-ico-bubble"
                };
                if ($scope.totalDimensionNum === 0 || $scope.totalMetricsNum < 3) {
                    dropDownObject.disable = true;
                    dropDownObject.title = $filter("translate")("SLICER.BUBBLE_ALERT");
                } else if ($scope.isCompare) {
                    dropDownObject.disable = true;
                    dropDownObject.title = $filter("translate")("SLICER.BUBBLE_COMPARE_ALERT");
                }
                $scope.chartTypeList.push(dropDownObject);

                // dropDownObject = { label: "Heatmap", value: "heatmap", icon: "pmcc-ico-treemap"};
                // if ($scope.invalidHeatmapDimensions){
                //     dropDownObject.disable = true;
                //     dropDownObject.title = $filter("translate")("SLICER."+$scope.heatmapErrorMessage);
                // }
                // $scope.chartTypeList.push(dropDownObject);

                //$scope.chartTypeList.push({type: "divider" });
                $scope.chartTypeList.push({
                    label: "Hide Chart",
                    value: "hide"
                });
            }

            function basicPageComponentsInit() {
                $scope.convertedNlpDisplay = $scope.nlpDisplay;
                $scope.convertedNlpDisplay = $scope.convertedNlpDisplay.replace("&nbsp;", " ");

                $scope.isAggregator = pubAnalyticService.isAggregator();
                $scope.reportTitle = "";
                $scope.reportId = "";
                $scope.reportDescription = "";
                $scope.isBenchmarkReport = false;

                if ($location.search().customReportId) {
                    $scope.currentPageIndicator("custom");
                    googleAnalyticsService.gTrackPageUsage(config.gaCustomReport);
                    var savedReportModel = savedReportsService.findById($location.search().customReportId);
                    $scope.reportTitle = savedReportModel.getName();
                    $scope.reportId = savedReportModel.getId();
                    $scope.reportDescription = savedReportModel.getDescription();
                    if (slicerURLParamsService.getOnLoadReportUrlValue() === true) {
                        setEncodedUrl();
                    }
                } else if ($location.search().standardReportId) {
                    $scope.currentPageIndicator("standard");
                    googleAnalyticsService.gTrackPageUsage(config.gaStandardReport);
                    var commonReportModel = commonReportsService.findById($location.search().standardReportId);
                    $scope.reportTitle = commonReportModel.getName();
                    $scope.reportDescription = commonReportModel.getDescription();
                } else if ($location.search().benchmark) {
                    $scope.currentPageIndicator("benchmarkMain");
                    $scope.isBenchmarkReport = true;
                    var firstAdvertiseName = dimensionValuesService.find("advertiserId")[$location.search().adv1];
                    var secondAdvertiseName = dimensionValuesService.find("advertiserId")[$location.search().adv2];
                    if (firstAdvertiseName) {
                        $scope.reportTitle = "Advertiser Benchmarking Report: " + firstAdvertiseName;
                    }
                    if (secondAdvertiseName) {
                        $scope.reportTitle = "Advertiser Benchmarking Report: " + secondAdvertiseName;
                    }

                    if (firstAdvertiseName && secondAdvertiseName) {
                        $scope.reportTitle = "Advertiser Benchmarking Report: " + firstAdvertiseName + " and " + secondAdvertiseName;
                    }
                    googleAnalyticsService.gTrackPageUsage(config.gaBenchmarkReport);
                } else {
                    $scope.currentPageIndicator("dimensions");
                    googleAnalyticsService.gTrackPageUsage(config.gaSlicerScreen);
                }
            }

            function chartComponentsInit() {
                var dimensions = pubAnalyticService.getHistoricDimensions(),
                    metrics = pubAnalyticService.getHistoricMetrics();

                $scope.timeUnitDimension = pubAnalyticService.getHistoricDimensions().getSelectedDimensions().filter(function(el) {
                    return el.getGroupId() === "timeUnits";
                });


                var datepickerAggregation = DateModel.getAggregation();
                $scope.lineHourEnable = (datepickerAggregation === "hour" || DateModel.getSelectedRangeId() === 0 || DateModel.getSelectedRangeId() === 1) ? true : false;
                $scope.lineDateEnable = (DateModel.getSelectedRangeId() !== 1 && (datepickerAggregation === "quarter" || datepickerAggregation === "month" || datepickerAggregation === "week" || datepickerAggregation === "date")) ? true : false;


                $scope.lineWeekEnable = (datepickerAggregation === "quarter" || datepickerAggregation === "month" || datepickerAggregation === "week") ? true : false;
                $scope.lineMonthEnable = (datepickerAggregation === "quarter" || datepickerAggregation === "month") ? true : false;
                $scope.lineQuarterEnable = (datepickerAggregation === "quarter") ? true : false;

                $scope.totalDimensionNum = dimensions.getSelectedDimensions().length;
                $scope.totalMetricsNum = metrics.getSelectedMetrics().length;

                if ($scope.totalDimensionNum < 2) {
                    $scope.invalidHeatmapDimensions = true;
                    $scope.heatmapErrorMessage = "HEATMAP_SIZE_ALERT";
                } else if (dimensions.hasInvalidHeatmapDimensions()) {
                    $scope.invalidHeatmapDimensions = true;
                    $scope.heatmapErrorMessage = "HEATMAP_DIMENSIONS_ALERT";
                } else if (dimensions.hasFirstTimeunitHeatmapDimensions()) {
                    $scope.invalidHeatmapDimensions = true;
                    $scope.heatmapErrorMessage = "HEATMAP_TIMEUNIT_DIMENSIONS_ALERT";
                } else if (dimensions.hasTimeunitHeatmapDimensions() && DateModel.getCompareFlag()) {
                    $scope.invalidHeatmapDimensions = true;
                    $scope.heatmapErrorMessage = "HEATMAP_TIMEUNIT_DIMENSIONS_COMPARISON_ALERT";
                } else {
                    $scope.invalidHeatmapDimensions = false;
                }


                $scope.defaultChart = true;
                chartModel.setIsDefaultChart(true);

                //TODO don't know what it does
                // if (chartModel.getType() !== "heatmap"){
                //     $scope.displayChart = chartModel.getChangeChart();
                //     chartModel.setChangeChart(false);
                // }

                $scope.selectedChart = chartModel.getType();
                if ($scope.selectedChart === "linechart") {
                    $scope.selectedChart = chartModel.getAggregation() + "-" + $scope.selectedChart;

                    $scope.timeseriesBy = chartModel.getAggregation();

                    //Disable the table dimension list drop down for special cases
                    var firstDimension = pubAnalyticService.getHistoricDimensions().getVisibleDimensions()[0];
                    var timeseriesBy = chartModel.getAggregation();

                    if (firstDimension && firstDimension.getId() === "date" && (timeseriesBy === "week" || timeseriesBy === "month" || timeseriesBy === "quarter")) {
                        $scope.disableTableDimensionControl = true;
                    } else if (firstDimension && firstDimension.getId() === "week" && (timeseriesBy === "month" || timeseriesBy === "quarter")) {
                        $scope.disableTableDimensionControl = true;
                    } else if (firstDimension && firstDimension.getId() === "month" && timeseriesBy === "quarter") {
                        $scope.disableTableDimensionControl = true;
                    }
                }



                chartListInit();
                $scope.selectedChartObject = $scope.chartTypeList[0];
                angular.forEach($scope.chartTypeList, function(each) {
                    if (each.value === $scope.selectedChart) {
                        $scope.selectedChartObject = each;
                    }
                });


                $scope.chartDimensionIdCollection = [];
                $scope.showChart();
                updateScatterBubbleOrder();
            }

            function tableComponentsInit() {
                $scope.chartMetricIconSelected = "active";
                $scope.chartMetricIconUnselected = "gray";
                $scope.selectedIconClass = "active";

                $scope.tabularSpinner = true;
                $scope.tabularApiFailed = false;
                $scope.currencyError = "";
                $scope.showCurrencyError = false;

                getTableData();
                getTotalData();
                $scope.slicerData = {};
            }

            function dateComponentsInit() {
                $scope.compareFlag = DateModel.getCompareFlag();
                if ($scope.compareFlag) {
                    $scope.compareStartDate = DateModel.getCompareStartDate();
                    $scope.compareEndDate = DateModel.getCompareEndDate();
                }

                $scope.rangeList = DateModel.getSelectRangeList();

                $scope.dateCollectionObject = {
                    startDate: DateModel.getStartDate(),
                    endDate: DateModel.getEndDate(),
                    optionIndex: DateModel.getSelectedRangeId(),
                    optionName: DateModel.getSelectedRangeName()
                };
            }

            function nlpComponentsInit() {
                if (angular.isUndefined($scope.nlpDisplay) || $scope.nlpDisplay === "") {
                    $scope.updateNlp();
                }
                if (($scope.nlpDisplay && $scope.nlpDisplay.indexOf("slice") !== 0) && ($scope.textProcessed !== true)) {
                    $scope.updateNlp();
                }
            }

            function actionEventInit() {
                $scope.isCompare = DateModel.getCompareFlag();
                if ($scope.isCompare) {
                    historicApiService.decorate(DateModel.getCompareValue());
                }
                $scope.compareValue = DateModel.getCompareValue();
                $scope.compareOptions = [{
                    id: "compareAbsoluteValue",
                    name: "Absolute Value"
                }, {
                    id: "compareAbsoluteChange",
                    name: "Absolute Change"
                }, {
                    id: "comparePercentage",
                    name: "Percent Change"
                }];

                $scope.showScheduleButton = $location.search().customReportId || $location.search().standardReportId;

                $scope.dimensionSelectionsSettings = {
                    labelProp: "value",
                    showSelectAll: false,
                    showDeselectAll: true,
                    selectionLimit: 5,
                    align: "left",
                };

                $scope.selectionsSettings = {
                    labelProp: "name",
                    showSelectAll: false,
                    showDeselectAll: true,
                    align: "left",
                };

                var tempMetric = pubAnalyticService.getHistoricMetrics();
                tempMetric = tempMetric.getSelectedMetrics().length ? tempMetric.getSelectedMetrics() : tempMetric.getDefaultMetricList();
                chartModel.setMetric(chartModel.getMetric() || tempMetric.map(function(model) {
                    return model.getId();
                })[0]);

                $scope.metricsCollection = pubAnalyticService.getHistoricMetrics();
                $scope.availableMetricList = [];
                $scope.selectedPrimaryChartMetric = [];
                angular.forEach($scope.metricsCollection.getSelectedMetrics(), function(each) {
                    if (each.getId() === chartModel.getMetric()) {
                        $scope.selectedPrimaryChartMetric.push({
                            name: each.getName(),
                            id: each.getId()
                        });
                    }
                    $scope.availableMetricList.push({
                        name: each.getName(),
                        id: each.getId()
                    });
                });

                $scope.availableMetricDualScaleList = [];
                $scope.selectedDualScaleMetric = [];
                angular.forEach($scope.metricsCollection.getSelectedMetrics(), function(each) {
                    if (each.getId() !== chartModel.getMetric()) {
                        $scope.availableMetricDualScaleList.push({
                            name: each.getName(),
                            id: each.getId()
                        });
                    }
                });

                $scope.selectedSecondaryChartMetric = [];
                $scope.selectedTertiaryChartMetric = [];
                $scope.availableSecondaryMetricList = [];
                $scope.availableTertiaryMetricList = [];


                angular.forEach($scope.availableMetricList, function(each) {
                    if (each.id !== chartModel.getMetric()) {
                        $scope.availableSecondaryMetricList.push({
                            name: each.name,
                            id: each.id
                        });
                    }
                });
                $scope.selectedSecondaryChartMetric = [$scope.availableSecondaryMetricList[0]];

                angular.forEach($scope.availableSecondaryMetricList, function(each) {
                    if (each.id !== $scope.selectedSecondaryChartMetric[0].id) {
                        $scope.availableTertiaryMetricList.push({
                            name: each.name,
                            id: each.id
                        });
                    }
                });
                $scope.selectedTertiaryChartMetric = [$scope.availableTertiaryMetricList[0]];

                $scope.downloadOptionList = [];
                $scope.downloadOptionList.push({
                    label: $filter("translate")("SLICER.DOWNLOAD_EXCEL_FILE"),
                    value: "excel",
                    action: $scope.exportXlsx
                });
                $scope.downloadOptionList.push({
                    label: $filter("translate")("SLICER.DOWNLOAD_CSV_FILE"),
                    value: "csv",
                    action: $scope.exportCSV
                });
                $scope.selectedDownloadOption = {};
            }

            function setEncodedUrl() {
                var url = slicerURLParamsService.getEncodedData();
                slicerURLParamsService.setOnLoadReportUrl(url);
                slicerURLParamsService.setOnLoadReportUrlValue(false);
            }

            /**
             * Slicer screen init
             */
            function slicerScreenInit() {
                //fetch historical data, like title, report type...
                slicerURLParamsService.fetch();

                //basic page components
                basicPageComponentsInit();

                //NLP
                nlpComponentsInit();

                //Date picker / date model
                dateComponentsInit();

                //actions like compare option select, schedule button...
                actionEventInit();

                //Chart components
                chartComponentsInit();

                //table components
                tableComponentsInit();
            }


            slicerScreenInit();

        }
    ]);


}).call(this, angular);
