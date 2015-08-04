(function (angular) {
    "use strict";
    /*jshint validthis:true */

    angular
        .module("pub-ui-analytics.domain")
        .factory("benchmarkService", [
            "$q",
            "dao",
            "benchmarkParsers",
            "pubAnalyticService",
            "DateModel",
            "historicMeasuresService",
            "slicerURLParamsService",
            "dimensionValuesService",
            benchmarkService
        ]);


    function benchmarkService ($q, dao, benchmarkParsers, pubAnalyticService, dateService, historicMeasuresService, slicerURLParamsService, dimensionValuesService) {

        var DIMENSION = "advertiserId",
            PAGE_SIZE = 10,
            INTERQUARTILE_RANGE = 40;

        function BenchmarkService () {}
        BenchmarkService.prototype.dimension = DIMENSION;
        BenchmarkService.prototype.pageSize = PAGE_SIZE;
        BenchmarkService.prototype.interquartileRange = INTERQUARTILE_RANGE;
        BenchmarkService.prototype.selectedAdvertisers = [];
        BenchmarkService.prototype.selectedAdSizes = [];
        BenchmarkService.prototype.selectFilter = selectFilter;
        BenchmarkService.prototype.selectCategory = selectCategory;
        BenchmarkService.prototype.unselectAllDimensionValues = unselectAllDimensionValues;
        BenchmarkService.prototype.selectAdvertiser = selectAdvertiser;
        BenchmarkService.prototype.unselectAllAdvertisers = unselectAllAdvertisers;
        BenchmarkService.prototype.getQuartile = getQuartile;
        BenchmarkService.prototype.getFiltersCollections = getFiltersCollections;
        BenchmarkService.prototype.getAdvertisersByCategory = getAdvertisersByCategory;
        BenchmarkService.prototype.getBenchmarkData = getBenchmarkData;
        BenchmarkService.prototype.createSliceReport = createSliceReport;
        
        function selectFilter(selected, collection) {
            var selectedIds = selected.map(function(obj) { return obj.id; });
            var isAllSelected = selected.length === collection.length || selected.length === 0;
            collection.map(function(model) {
                var index = selectedIds.indexOf(model.id);
                if (index === -1 || isAllSelected) {
                    model.isSelected = false;
                } else {
                    model.isSelected = true;
                }
                return model;
            });
        }

        function selectCategory (selected, collection) {
            var selectedIds = selected.map(function(obj) { return obj.id; });
            var isAllSelected = selected.length === collection.length || selected.length === 0;
            collection.map(function(model) {
                var index = selectedIds.indexOf(model.id);
                if (index === -1 || isAllSelected) {
                    model.isSelected = false;
                } else {
                    model.isSelected = true;
                }
                return model;
            });
        }

        /**
         * @description
         * Unselect all selected dimension values from collection.
         *
         * @params collection {array}
         * @public
         */
        function unselectAllDimensionValues (collection) {
            collection.map(function (item) { item.isSelected = false; });
        }

        function selectAdvertiser (selectedAdvertisers, collection) {
            this.selectedAdvertisers = [];
            selectedAdvertisers
                .filter(function(advertiser) { return advertiser; })
                .forEach(function(advertiser) {
                    var model = collection.filter(function (item) { return item.id === advertiser.id; })[0];
                    if (model) {
                        this.selectedAdvertisers.push(model);
                    }
                }.bind(this));
        }

        /**
         * @description
         * Unselect all selected advertisers from Advertiser collection
         * and clear selectedAdvertisers array.
         *
         * @params collection {array} List of advertisers
         * @public
         */
        function unselectAllAdvertisers (collection) {
            collection.map(function (item) { item.isSelected = false; });
            this.selectedAdvertisers = [];
        }

        /**
         * @description
         * Calculate lower and upper quartile.
         * lowerQuartile = (minValue - median) * (interquartileRange / 100%) + median;
         * lowerQuartile = (maxValue - median) * (interquartileRange / 100%) + median;
         * where `interquartileRange` is equal to 0% - 100%.
         *
         * @params value {number} min or max value
         * @params median {number}
         * @params interquartileRange {number}
         * @returns {number} quartile
         * @public
         */
        function getQuartile (value, median, interquartileRange) {
            return (value - median) * (interquartileRange / 100) + median;
        }

        /**
         * @description
         * Create several requests to Middleware and wait
         * when all of them will be resolved.
         * Data from success response is modified by `benchmarkParsers.measureValues`
         * @returns {object} promise
         * @public
         */
        function getFiltersCollections () {
            var promises = getFilterDimensions().map(function (dimensionId) {
                return getDimensionValues(dimensionId);
            });

            return dao.measureValues.batch(promises).then(function (response) {
                return {
                    salesChannels: benchmarkParsers.measureValues(response[0], "channelId"),
                    platforms: benchmarkParsers.measureValues(response[1], "platformId"),
                    adFormats: benchmarkParsers.measureValues(response[2], "adFormatId"),
                    adSizes: benchmarkParsers.measureValues(response[3], "adSizeId"),
                    categories: benchmarkParsers.measureValues(response[4], "categoryId"),
                    advertisers: benchmarkParsers.measureValues(response[5], "advertiserId")
                };
            });
        }

        /**
         * @public
         */
        function getAdvertisersByCategory (categoryId) {
            var filters;
            if (categoryId === "0") {
                filters = "";
            } else {
                filters = encodeURI("advertiserCategoryId eq " + categoryId);
            }
            return getDimensionValues("advertiserId", filters).then(function (response) {
                return benchmarkParsers.measureValues(response, "advertiserId");
            });
        }

        /**
         * @public
         */
        function getBenchmarkData (filters, tableView, metricsFilter) {
            filters = filters || {};
            dao.benchmark.close();
            var options = getBenchmarkOptions.call(this, filters);

            return dao.benchmark
                .fetch(options)
                .then(benchmarkParsers.advertiserNameParser)
                .then(function (response) {
                    var parser = getParser(this.dimension);
                    var selectedDimensionValues = getSelectedDimensionValues.call(this, this.dimension);
                    response = parser(response, selectedDimensionValues, tableView);
                    response = this.dimension === "advertiserOpportunityId" ? response : benchmarkParsers.metricsFilter(response, metricsFilter, selectedDimensionValues);
                    return response;
                }.bind(this));
        }

        function createSliceReport(options) {
            /** Get historic dimensions and metrics */
            var dimensions = historicMeasuresService.getDimensions();
            var metrics = historicMeasuresService.getMetrics();

            /** Clear cached data and states */
            slicerURLParamsService.reset();

            /** Find all needed dimensions */
            var dsp = dimensions.findDimensionById("dspId");
            var buyer = dimensions.findDimensionById("atdId");
            var advertiser = dimensions.findDimensionById(options.advertiser.id);
            var channel = dimensions.findDimensionById(options.channel.id);
            var platform = dimensions.findDimensionById(options.platform.id);
            var adFormat = dimensions.findDimensionById(options.adFormat.id);
            var adSize = dimensions.findDimensionById(options.adSize.id);

            /** Find all needed metrics */
            var paidImpressions = metrics.findMetricById("paidImpressions");
            var ecpm = metrics.findMetricById("ecpm");
            var revenue = metrics.findMetricById("revenue");
            var averageBidEcpmAdv = metrics.findMetricById("averageBidEcpmAdv");

            /** Keep dimension values in memory. It's needed for Filter page */
            saveDimensionValue(options.advertiser.id, options.advertiser.filters);
            saveDimensionValue(options.channel.id, options.channel.filters);
            saveDimensionValue(options.platform.id, options.platform.filters);
            saveDimensionValue(options.adFormat.id, options.adFormat.filters);
            saveDimensionValue(options.adSize.id, options.adSize.filters);

            /** Set filters to each dimension */
            var coolectIds = function(obj) { return obj.id; };
            advertiser.getFilter().setDimensionValueFilters(options.advertiser.filters.map(coolectIds));
            channel.getFilter().setDimensionValueFilters(options.channel.filters.map(coolectIds));
            platform.getFilter().setDimensionValueFilters(options.platform.filters.map(coolectIds));
            adFormat.getFilter().setDimensionValueFilters(options.adFormat.filters.map(coolectIds));
            adSize.getFilter().setDimensionValueFilters(options.adSize.filters.map(coolectIds));

            /** Select dimensions */
            historicMeasuresService.selectDimension(advertiser);
            historicMeasuresService.selectDimension(dsp);
            historicMeasuresService.selectDimension(buyer);
            historicMeasuresService.selectDimension(channel);
            historicMeasuresService.selectDimension(platform);
            historicMeasuresService.selectDimension(adFormat);
            historicMeasuresService.selectDimension(adSize);

            /** Select metrics */
            historicMeasuresService.unselectMetric(ecpm);
            historicMeasuresService.unselectMetric(revenue);
            historicMeasuresService.selectMetric(paidImpressions);
            historicMeasuresService.selectMetric(ecpm);
            historicMeasuresService.selectMetric(revenue);
            historicMeasuresService.selectMetric(averageBidEcpmAdv);

            /** Set invisible dimensions */
            if (options.advertiser.filters.length < 2) {
                advertiser.setVisible(false);
            } else {
                advertiser.setVisible(true);
            }
            channel.setVisible(false);
            platform.setVisible(false);
            adFormat.setVisible(false);
            adSize.setVisible(false);

            /** Set datepicker data */
            dateService.setStartDate(options.datepicker.startDate);
            dateService.setEndDate(options.datepicker.endDate);
            dateService.setSelectedRangeId(options.datepicker.optionIndex);

            /** Save everything to URL */
            return $q.when().then(slicerURLParamsService.save);
        }

        function saveDimensionValue(dimensionId, dimensionValues) {
            dimensionValues.forEach(function(dimensionValue) {
                var obj = {};
                obj[dimensionId] = {};
                obj[dimensionId][dimensionValue.id] = dimensionValue.name;

                dimensionValuesService.add(obj);
            });
        }

        /**
         * @private
         */
        function getFilterDimensions () {
            return ["channelId", "platformId", "adFormatId", "adSizeId", "advertiserCategoryId", "advertiserId"];
        }

        /**
         * @private
         */
        function getDimensionValues (dimensionId, filters) {
            var options = {};
            filters = filters ? filters : "";
            options.params = {dimensions: dimensionId, filters: filters};
            return dao.measureValues.fetch(options);
        }

        /**
         * @private
         */
        function getBenchmarkOptions (filters) {
            var options = {}, params = {};
            params.dimensions = getDimensions(this.dimension);
            params.metrics = getMetrics(this.dimension);
            params.fromDate = dateService.getStartDate(true);
            params.toDate = dateService.getEndDate(true);
            params.dateUnit = dateService.getAggregation();
            params.pageSize = getPageSize(this.dimension, this.pageSize);
            params.filters = getFilters(filters);

            params.userType = pubAnalyticService.getUserType();
            params.userId = pubAnalyticService.getUserId();

            options.params = params;

            return options;
        }

        // TODO: Replace keys to `advertiserOpportunity`, `advertiser`, `advertiserByPublisher`, ...
        function getDimensions(key) {
            var dimensions = {
                "advertiserOpportunityId": "advertiserId",
                "advertiserId": "advertiserId",
                "advertiserCategoryId": "advertiserCategoryId",
                "advertiserId,pubId": "advertiserId,pubId",
                "adSizeId,pubId": "adSizeId,pubId"
            };

            return dimensions[key];
        }

        /**
         * @description
         * Configuration of metrics depends on dimension.
         * There is mapping of dimensions and metrics.
         * For example for advertiser benchmarking we need `advertiserId` dimension and special list of metrics,
         * where:
         *      ecpm - your result
         *      avgCompEcpm - median
         *      minCompEcpm - lower quartile
         *      maxCompEcpm - upper quartile
         *      etc...
         *
         * @params dimension {string}
         * @returns {string} combination of metrics
         * @private
         */
        function getMetrics (dimension) {
            var measureMapping = {
                "advertiserOpportunityId": "potentialRevenue,revenue,revenueOpportunity,potentialEcpm,ecpm,ecpmOpportunity",
                "advertiserId": "ecpm,avgCompEcpm,minCompEcpm,maxCompEcpm,medianCompEcpm,sow,avgCompSow,minCompSow,maxCompSow,medianCompSow,sov,avgCompSov,minCompSov,maxCompSov,medianCompSov",
                "advertiserCategoryId": "ecpm,avgCompEcpm,minCompEcpm,maxCompEcpm,medianCompEcpm,sow,avgCompSow,minCompSow,maxCompSow,medianCompSow,sov,avgCompSov,minCompSov,maxCompSov,medianCompSov",
                "advertiserId,pubId": "ecpm,avgCompEcpm,minCompEcpm,maxCompEcpm,medianCompEcpm,sow,avgCompSow,minCompSow,maxCompSow,medianCompSow,sov,avgCompSov,minCompSov,maxCompSov,medianCompSov",
                "adSizeId,pubId": "floor"
            };


            return measureMapping[dimension];
        }

        /**
         * @private
         */
        function getParser (dimension) {
            var parserMapping = {
                "advertiserOpportunityId": benchmarkParsers.advertiserOpportunity,
                "advertiserId": benchmarkParsers.advertiser,
                "advertiserCategoryId": benchmarkParsers.category,
                "advertiserId,pubId": benchmarkParsers.advertiserByPublisher,
                "adSizeId,pubId": benchmarkParsers.floor
            };

            return parserMapping[dimension];
        }

        function getSelectedDimensionValues (dimension) {
            var dimensionValuesMapping = {
                "advertiserOpportunityId": [],
                "advertiserId": [],
                "advertiserCategoryId": [],
                "advertiserId,pubId": this.selectedAdvertisers,
                "adSizeId,pubId": this.selectedAdSizes
            };

            return dimensionValuesMapping[dimension];
        }

        /**
         * @private
         */
        function getFilters (attrs) {
            var keys = Object.keys(attrs);
            var filters = keys.reduce(function (result, key) {
                var collection = attrs[key];
                collection = collection.filter(function(item) {return item; });
                var isAllSelected = (collection.filter(function (item) { return item.id === "0"; })[0] || {}).isSelected;
                var filters = collection
                                .filter(function (item) { return item.isSelected; })
                                .map(function (item) { return key + " eq " + item.id; })
                                .join();

                if (!isAllSelected && filters !== "") {
                    result.push(filters);
                }
                return result;
            }, []).join("&filters=");

            return encodeURI(filters);
        }

        /**
         * @private
         */
        function getPageSize (dimensions, pageSize) {
            return dimensions === "advertiserId,pubId" ? "" : pageSize;
        }

        return new BenchmarkService();
    }

}).call(this, angular);