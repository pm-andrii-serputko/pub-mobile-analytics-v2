(function (angular) {
    "use strict";

    var state = {
        startDate: null,
        endDate: null,
        optionIndex: 5,
        aggregation: "month",
        salesChannels: [],
        salesChannelSelectionsModel: [],
        platforms: [],
        platformSelectionsModel: [],
        adFormats: [],
        adFormatSelectionsModel: [],
        adSizes: [],
        adSizeSelectionsModel: [],
        categories: [],
        categorySelectionsModel: [{id: "0", name: "All"}],
        advertisersByCategory: [],
        firstAdvertiserSelectionsModel: [],
        secondAdvertiserSelectionsModel: [],
        selectedAdvertisers: [],
        tableViewBy: "chart",
        metrics: [{id: "ecpm", name: "eCPM"}, {id: "sow", name: "SOW"}, {id: "sov", name: "SOV"}],
        metricsSelectionsModel: [{id: "ecpm", name: "eCPM"}, {id: "sow", name: "SOW"}, {id: "sov", name: "SOV"}],
        advByPubColspan: 3,
        sortingOptions: {column: 1, type: "desc"}
    };

    angular
        .module("pub-ui-analytics")
        .controller("pubBenchmarkCtrl", ["$scope", "benchmarkService", "pubAnalyticService", "ngDialog", "DateModel", "$debounce", "$filter", "validator", "benchmarkValidation","googleAnalyticsService", "config", "benchmarkStateService", "slicerURLParamsService", "pubURLService", pubBenchmarkCtrl]);
    function pubBenchmarkCtrl ($scope, benchmarkService, pubAnalyticService, ngDialog, dateService, $debounce, $filter, validator, benchmarkValidation, googleAnalyticsService, config, benchmarkStateService, slicerURLParamsService, pubURLService) {
        $scope.isTrial = !benchmarkStateService.getBenchmarkPaid();
        if ($scope.isTrial){
            $scope.trialLeft = Math.floor((benchmarkStateService.getTrialEndDate() - new Date()) /(1000*60*60*24));
        }

        /**
         * Scope interface
         */
        // Date picker
        dateService.setStartDate(state.startDate || dateService.getLastMonth().startDate);
        dateService.setEndDate(state.endDate || dateService.getLastMonth().endDate);
        dateService.setSelectedRangeId(state.optionIndex);
        dateService.setAggregation(state.aggregation);
        $scope.startDate = state.startDate || dateService.getLastMonth().startDate;
        $scope.endDate = state.endDate || dateService.getLastMonth().endDate;
        $scope.optionIndex = state.optionIndex;
        $scope.rangeList = dateService.getBenchmarkSelectRangeList();
        $scope.openDatepicker = openDatepicker;
        // Filters
        $scope.salesChannels = state.salesChannels;
        $scope.salesChannelSelectionsModel = state.salesChannelSelectionsModel;

        $scope.platforms = state.platforms;
        $scope.platformSelectionsModel = state.platformSelectionsModel;

        $scope.adFormats = state.adFormats;
        $scope.adFormatSelectionsModel = state.adFormatSelectionsModel;

        $scope.adSizes = state.adSizes;
        $scope.adSizeSelectionsModel = state.adSizeSelectionsModel;

        $scope.selectFilter = selectFilter;
        // Advertiser by Publisher (Categories)
        var selectedCategoryId = "";
        $scope.categories = state.categories;
        $scope.categorySelectionsModel = state.categorySelectionsModel;
        $scope.selectCategory = selectCategory;

        // Advertiser by Publisher (Advertisers By Category)
        $scope.advertisersByCategory = state.advertisersByCategory;
        $scope.firstAdvertiserSelectionsModel = state.firstAdvertiserSelectionsModel;
        $scope.secondAdvertiserSelectionsModel = state.secondAdvertiserSelectionsModel;
        $scope.selectFirstAdvertiser = selectFirstAdvertiser;
        $scope.selectSecondAdvertiser = selectSecondAdvertiser;
        // Advertiser by Publisher (Selected Advertisers)
        $scope.selectedAdvertisers = state.selectedAdvertisers;

        $scope.isAdvertiserSelected = false;

        $scope.clearAll = clearAll;

        // Benchmark view
        $scope.benchmarkViews = [];
        $scope.selectedBenchmarkView = "";
        $scope.changeBenchmarkView = changeBenchmarkView;
        // Limit/Page size
        $scope.limits = [];
        $scope.selectedLimit = 0;
        $scope.changeLimit = changeLimit;
        // Highlight

        $scope.outlierThreshold = benchmarkService.interquartileRange;  // 0% - 100%
        $scope.outlierThresholdControl = {};
        $scope.isHiddenThresholdBlueBar = true;
        $scope.outlierThresholdBlurHandler = outlierThresholdBlurHandler;
        $scope.outlierThresholdDragstart = outlierThresholdDragstart;
        $scope.outlierThresholdDragend = outlierThresholdDragend;

        $scope.changeInterquartileRange = changeInterquartileRange;
        $scope.fillBarColor = fillBarColor;
        $scope.getQuartile = benchmarkService.getQuartile;
        // Table data
        $scope.currency = "";
        $scope.tableViewBy = state.tableViewBy;
        $scope.changeTableViewBy = changeTableViewBy;
        $scope.data = {};
        $scope.userId = pubAnalyticService.getUserId();
        // State properties
        $scope.isReady = false;
        $scope.isTableError = false;
        $scope.isTableReady = false;
        $scope.isAdvertisersByCategoryError = false;
        $scope.isAdvertisersByCategoryReady = false;

        $scope.selectionsSettings = {
            labelProp: "name",
            showSelectAll: true,
            showDeselectAll: true,
            align: "left",
        };

        $scope.adSizeSelectionsSettings = {
            labelProp: "name",
            showSelectAll: true,
            showDeselectAll: true,
            align: "right",
        };

        $scope.metricsSelectionsSettings = $scope.adSizeSelectionsSettings;
        $scope.metrics = state.metrics;
        $scope.metricsSelectionsModel = state.metricsSelectionsModel;
        $scope.selectMetric = selectMetric;
        $scope.advByPubColspan = state.advByPubColspan;

        $scope.selectionsCancel = function selectionsCancel() {};


        var WARNING = "warning";
        var ALERT_RED = "alert";
        var SUCCESS_GREEN = "success";

        // Sorting
        $scope.sortingOptions = state.sortingOptions;
        $scope.sortColumn = sortColumn;

        $scope.toggleToolTip = toggleToolTip;
        $scope.toggleLegend = toggleLegend;

        $scope.createAdvertiserReport = createAdvertiserReport;
        $scope.createAdvertiserByPublisherReport = createAdvertiserByPublisherReport;

        $scope.toolTipDisplay = false;

        $scope.isSOW = isSOW;
        $scope.isSOV = isSOV;


        function createAdvertiserReport(advertiser) {
            advertiser.name = advertiser.value;
            createReport([advertiser]);
        }

        function createAdvertiserByPublisherReport() {
            var ids = function(obj) { return obj.id; };
            var advertiserIds = $scope.selectedAdvertisers.map(ids);
            var advertisers = $scope.advertisersByCategory.filter(function(advertiser) {
                return advertiserIds.indexOf(advertiser.id) !== -1;
            });
            advertisers = advertisers.sort(function(a, b) {
                var aIndex = advertiserIds.indexOf(a.id);
                var bIndex = advertiserIds.indexOf(b.id);
                if (aIndex < bIndex) {
                    return -1;
                }
                if (aIndex > bIndex) {
                    return 1;
                }
                return 0;
            });
            createReport(advertisers);
        }

        function createReport(advertisers) {
            function bySelected(obj) {
                return obj.isSelected;
            }

            var salesChannes = $scope.salesChannels.filter(bySelected);
            var platforms = $scope.platforms.filter(bySelected);
            var adFormats = $scope.adFormats.filter(bySelected);
            var adSizes = $scope.adSizes.filter(bySelected);

            benchmarkService.createSliceReport({
                advertiser: {id: "advertiserId", filters: advertisers},
                channel: {id: "channelId", filters: salesChannes},
                platform: {id: "platformId", filters: platforms},
                adFormat: {id: "adFormatId", filters: adFormats},
                adSize: {id: "adSizeId", filters: adSizes},
                datepicker: {
                    startDate: $scope.startDate,
                    endDate: $scope.endDate,
                    optionIndex: $scope.optionIndex
                }
            }).then(function() {
                googleAnalyticsService.gTrackEventUsage("button", "click", config.gaBenchmarkReport);
                // Get id of first advertiser
                var adv1 = advertisers[0] || {};
                adv1 = adv1.id || "";
                // Get id of second advertiser
                var adv2 = advertisers[1] || {};
                adv2 = adv2.id || "";
                // Generate url
                var hash = slicerURLParamsService.getUrl("slice", {f: slicerURLParamsService.getEncodedData()});
                hash = hash + "&benchmark=true&adv1=" + adv1 + "&adv2=" + adv2;
                // Change url
                pubURLService.navigate(hash);
            });
        }

        initialize();

        function initialize () {
            $scope.benchmarkViews = [
                // ADS-1932: Remove Advertiser Opportunity Report from UI
                // {id: "advertiserOpportunityId", name: "Advertiser Opportunity"},
                {id: "advertiserId", name: "Advertiser"},
                {id: "advertiserId,pubId", name: "Advertiser by Publisher"},
                {id: "advertiserCategoryId", name: "Categories"}
            ];
            $scope.selectedBenchmarkView = benchmarkService.dimension;
            captureBenchmarkPageUsage();


            $scope.limits = [10, 25, 50, 100];
            $scope.selectedLimit = benchmarkService.pageSize;
            benchmarkService.interquartileRange = $scope.outlierThreshold;


            benchmarkService.getFiltersCollections().then(function (response) {
                // Set state. If collections are empty response will be set to collection.
                state.salesChannels = state.salesChannels.length ? state.salesChannels : response.salesChannels;
                state.platforms = state.platforms.length ? state.platforms : response.platforms;
                state.adFormats = state.adFormats.length ? state.adFormats : response.adFormats;
                state.adSizes = state.adSizes.length ? state.adSizes : response.adSizes;
                state.categories = state.categories.length ? state.categories : response.categories;
                state.advertisersByCategory = state.advertisersByCategory.length ? state.advertisersByCategory : response.advertisers;

                // fill filter collections
                $scope.salesChannels = state.salesChannels.length ? state.salesChannels : response.salesChannels;
                $scope.platforms = state.platforms.length ? state.platforms : response.platforms;
                $scope.adFormats = state.adFormats.length ? state.adFormats : response.adFormats;
                $scope.adSizes = state.adSizes.length ? state.adSizes : response.adSizes;
                $scope.categories = state.categories.length ? state.categories : response.categories;
                $scope.advertisersByCategory = state.advertisersByCategory.length ? state.advertisersByCategory : response.categories;
                if (!state.isAddedAllOption) {
                    $scope.categories.unshift({id: "0", name: "All", isSelected: true});
                    state.isAddedAllOption = true;
                }
                // Show content
                $scope.isReady = true;

                getBenchmarkData();
            });
        }


        function toggleToolTip(chartObject){
            if (chartObject){
                $scope.activeChartObject = chartObject;
                chartObject.display = true;
                $scope.toolTipDisplay = true;
            }
            else {
                $scope.activeChartObject.display = false;
                $scope.toolTipDisplay = false;
            }
        }

        function toggleLegend(display){
            $scope.legendDisplay = display;
        }

        function openDatepicker () {
            var dateParam = {};
            if ($scope.optionIndex === 7){
                dateParam.optionIndex = $scope.optionIndex;
                dateParam.startDate = $scope.startDate;
                dateParam.endDate = $scope.endDate;
            } else {
                dateParam.optionIndex = $scope.optionIndex;
            }
            dateParam = JSON.stringify(dateParam);

            ngDialog.openDropDown({
                template: "<benchmark-date-dialog date-object=" + dateParam + "></benchmark-date-dialog>",
                plain: true,
                appendTo: "#benchmark-date-dropdown-button",
                containerClassName: "ngbenchmarkdropdown"
            }).then(function (dateCollectionObject) {
                dateService.setStartDate(dateService.tweakDate(dateCollectionObject.startDate).startDate);
                dateService.setEndDate(dateService.tweakDate(dateCollectionObject.endDate).endDate);
                dateService.setSelectedRangeId(dateCollectionObject.optionIndex);
                // Set date to scope
                $scope.startDate = dateService.getStartDate();
                $scope.endDate = dateService.getEndDate();
                $scope.optionIndex = dateService.getSelectedRangeId();
                // Set date to state
                state.startDate = dateService.getStartDate();
                state.endDate = dateService.getEndDate();
                state.optionIndex = dateService.getSelectedRangeId();
                state.aggregation = dateService.getAggregation();

                getBenchmarkData();
            }, function () {
                dateService.setAggregation(dateService.getOriginalAggregation());
            });
        }

        function selectFilter(selected, collection) {
            benchmarkService.selectFilter(selected, collection);
            getBenchmarkData();
        }

        function selectCategory (selected, collection) {
            clearSelectedAdvertisers();
            benchmarkService.selectCategory(selected, collection);
            if (selected[0]) {
                getAdvertisersByCategory(selected[0].id);
            }
        }

        function getAdvertisersByCategory (id) {
            $scope.isAdvertisersByCategoryReady = false;
            $scope.isAdvertisersByCategoryError = false;
            selectedCategoryId = id;
            return benchmarkService.getAdvertisersByCategory(id).then(function (response) {
                state.advertisersByCategory = response;
                $scope.advertisersByCategory = response;
                $scope.isAdvertisersByCategoryReady = true;
                return response;
            }, function (error) {
                if (error.status !== 0) {
                    $scope.isAdvertisersByCategoryError = true;
                }
            });
        }

        function selectFirstAdvertiser (selected) {
            if (selected[0]) {
                selected[0].isSelected = true;
                $scope.selectedAdvertisers[0] = selected[0];
                state.selectedAdvertisers[0] = selected[0];
            } else {
                $scope.selectedAdvertisers[0] = undefined;
                state.selectedAdvertisers[0] = undefined;
                clearSelectedAdvertisersList();
            }
            benchmarkService.selectAdvertiser($scope.selectedAdvertisers, $scope.advertisersByCategory);
            getBenchmarkData();
        }

        function selectSecondAdvertiser (selected) {
            if (selected[0]) {
                selected[0].isSelected = true;
                $scope.selectedAdvertisers[1] = selected[0];
                state.selectedAdvertisers[1] = selected[0];
            } else {
                $scope.selectedAdvertisers[1] = undefined;
                state.selectedAdvertisers[1] = undefined;
                clearSelectedAdvertisersList();
            }

            benchmarkService.selectAdvertiser($scope.selectedAdvertisers, $scope.advertisersByCategory);
            getBenchmarkData();
        }

        function clearSelectedAdvertisersList() {
            $scope.selectedAdvertisers = $scope.selectedAdvertisers.filter(function(item) { return item; });
            state.selectedAdvertisers = state.selectedAdvertisers.filter(function(item) { return item; });
        }

        function selectMetric(metricsSelectionsModel) {
            $scope.metricsSelectionsModel = metricsSelectionsModel;
            $scope.advByPubColspan = metricsSelectionsModel.length;
            state.advByPubColspan = metricsSelectionsModel.length;
            getBenchmarkData();
        }

        function clearAll () {
            $scope.isTableReady = true;
            $scope.isTableError = false;
            $scope.searchCategory = "";
            clearCategories();
            clearAdvertisers();
            clearSelectedAdvertisers();
            clearSelectedAdSizes();
        }

        function clearCategories () {
            benchmarkService.unselectAllDimensionValues($scope.categories);
        }

        function clearAdvertisers () {
            benchmarkService.unselectAllAdvertisers($scope.advertisersByCategory);
            $scope.isAdvertisersByCategoryReady = false;
            $scope.isAdvertiserSelected = false;
        }

        function clearSelectedAdvertisers () {
            $scope.selectedAdvertisers = [];
            $scope.firstAdvertiserSelectionsModel = [];
            $scope.secondAdvertiserSelectionsModel = [];
            $scope.data = [];
            state.selectedAdvertisers = [];
            state.firstAdvertiserSelectionsModel = [];
            state.secondAdvertiserSelectionsModel = [];
        }

        function clearSelectedAdSizes () {
            benchmarkService.unselectAllDimensionValues($scope.adSizes);
            $scope.data = [];
        }

        function changeBenchmarkView () {
            captureBenchmarkPageUsage();
            benchmarkService.dimension = $scope.selectedBenchmarkView;
            clearAll();
            getBenchmarkData();
        }

        function changeLimit () {
            benchmarkService.pageSize = $scope.selectedLimit;
            getBenchmarkData();
        }

        function changeTableViewBy (view) {
            // Set new value of table view
            $scope.tableViewBy = view;
            state.tableViewBy = view;
            // Update sorting options
            changeSortingState();
            // Get data
            getBenchmarkData();
        }

        function changeSortingState() {
            if ($scope.selectedBenchmarkView === "advertiserId,pubId") {
                if ($scope.tableViewBy === "chart") {
                    $scope.sortingOptions.column = $scope.sortingOptions.column === 4 ? 1 : $scope.sortingOptions.column;
                    $scope.sortingOptions.column = $scope.sortingOptions.column === 5 ? 2 : $scope.sortingOptions.column;
                    $scope.sortingOptions.column = $scope.sortingOptions.column === 6 ? 3 : $scope.sortingOptions.column;
                }
            }

            if ($scope.selectedBenchmarkView === "advertiserOpportunityId" || $scope.selectedBenchmarkView === "advertiserId" || $scope.selectedBenchmarkView === "advertiserCategoryId") {
                if ($scope.tableViewBy === "number") {
                    $scope.sortingOptions.column = $scope.sortingOptions.column === 0 ? $scope.sortingOptions.column : $scope.sortingOptions.column * 2 - 1;
                } else {
                    $scope.sortingOptions.column = $scope.sortingOptions.column % 2 ? ($scope.sortingOptions.column + 1) / 2 : $scope.sortingOptions.column / 2;
                }
            }

            state.sortingOptions = $scope.sortingOptions;
        }

        function changeInterquartileRange (data) {
            var errors = validator.validate({interquartileRange: data}, benchmarkValidation);
            if (!errors) {
                $scope.outlierThreshold = parseFloat(data, 10);
                benchmarkService.interquartileRange = $scope.outlierThreshold;
                fillBarColor();
            } else if (!data) {
                $scope.outlierThreshold = 0;
                benchmarkService.interquartileRange = $scope.outlierThreshold;
            } else {
                $scope.outlierThreshold = benchmarkService.interquartileRange;
            }
        }

        function fillBarColor () {
            if ($scope.selectedBenchmarkView === "advertiserOpportunityId") {
                return;
            }
            angular.forEach($scope.data.rows, function(row) {
                angular.forEach(row, function(cell, $index) {
                    if ($index !== 0) {
                        cell.bulletChartDataSet.color = colorCalculator(cell, cell.medianCompValue);
                        if (cell.compareData) {
                            cell.compareData.bulletChartDataSet.color = colorCalculator(cell.compareData, cell.medianCompValue);
                        }
                    }
                });
            });
        }


        function colorCalculator(item, compValue){
            var color;

            if (isSOV(item) || isSOW(item)) {
                color = item.value ? SUCCESS_GREEN : ALERT_RED;
                return color;
            }

            if ((compValue - ($scope.outlierThreshold / 100 * compValue) > item.value)) {
                color = ALERT_RED;
            }
            else if (compValue + ($scope.outlierThreshold / 100 * compValue) < item.value) {
                color = SUCCESS_GREEN;
            }
            else {
                color = WARNING;
            }

            return color;
        }


        function getBenchmarkData () {
            $scope.isTableReady = false;
            $scope.isTableError = false;
            if ($scope.selectedBenchmarkView === "advertiserId,pubId" && $scope.selectedAdvertisers.length === 0) {
                $scope.data = [];
                $scope.isTableReady = true;
                return;
            }
            var filters = {
                channelId: $scope.salesChannels,
                platformId: $scope.platforms,
                adFormatId: $scope.adFormats,
                adSizeId: $scope.adSizes,
                advertiserId: $scope.selectedAdvertisers
            };

            benchmarkService.getBenchmarkData(filters, $scope.tableViewBy, $scope.metricsSelectionsModel).then(function (data) {
                $scope.data = data;
                $scope.currency = data.currency;
                sortColumn($scope.sortingOptions.column, false);
                fillBarColor();
                $scope.isTableReady = true;
            }, function (error) {
                if (error.status !== 0) {
                    $scope.isTableError = true;
                }
            });
        }

        function sortColumn (column, reverse) {
            if (column === $scope.sortingOptions.column) {
                if (reverse) {
                    $scope.sortingOptions.type = $scope.sortingOptions.type === "asc" ? "desc" : "asc";
                }
            } else {
                $scope.sortingOptions.column = column;
                $scope.sortingOptions.type = "asc";
            }
            if ($scope.data.rows[0] && column > ($scope.data.rows[0].length -1)) {
                $scope.sortingOptions.column = 0;
            }

            var isDesc = ($scope.sortingOptions.type === "desc") ? true : false;
            var orderBy = $filter("orderBy");
            var sortBy = function (array){
                return (array[$scope.sortingOptions.column].value) ? array[$scope.sortingOptions.column].value: -1;
            };
            $scope.data.rows = orderBy($scope.data.rows, sortBy, isDesc);
            state.sortingOptions = $scope.sortingOptions;
        }


        function captureBenchmarkPageUsage(){
            if ($scope.selectedBenchmarkView === "advertiserCategoryId"){
                googleAnalyticsService.gTrackPageUsage(config.gaBenchmarkCategories);
            }
            else if ($scope.selectedBenchmarkView === "advertiserId,pubId"){
                googleAnalyticsService.gTrackPageUsage(config.gaBenchmarkAdvByPub);
            }
            else {
                googleAnalyticsService.gTrackPageUsage(config.gaBenchmarkAdvertiser);
            }
        }


        function outlierThresholdBlurHandler() {
            if (!$scope.isDragStarted) {
                $scope.isHiddenThresholdBlueBar = true;
            }
        }

        function outlierThresholdDragstart() {
            $scope.isDragStarted = true;
            $scope.isHiddenThresholdBlueBar = false;
        }

        function outlierThresholdDragend() {
            $scope.isDragStarted = false;
            $scope.isHiddenThresholdBlueBar = true;
        }

        function isSOW(measureValue) {
            return measureValue.measureId === "sow";
        }

        function isSOV(measureValue) {
            return measureValue.measureId === "sov";
        }
    }

}).call(this, angular);