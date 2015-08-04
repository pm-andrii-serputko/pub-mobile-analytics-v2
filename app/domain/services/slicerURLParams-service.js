/*global angular */
(function (angular) {
    "use strict";

    var app;

    app = angular.module("pub-ui-analytics.domain");


    /**
     * @ngdoc service
     * @name slicerURLParamsService
     * @kind function
     *
     * @description
     * Collect and process data from URL
     * @see {@link https://inside.pubmatic.com:8443/confluence/display/Products/Filtering+in+Analytics+UI|Filtering in Analytics UI}
     */
    app.factory("slicerURLParamsService", [
        "historicMeasuresService",
        "$base64",
        "$location",
        "DateModel",
        "chartModel",
        "mediator",

        function (historicMeasuresService, $base64, $location, dateModel, chartModel, mediator) {
            var onLoadUrl, onLoadUrlValue;
            var service = {
                /**
                 * Resets the model's state from the url hash
                 */
                fetch: function () {
                    var data;
                    data = window.location.hash;
                    data = this.getParameterByName(data, "f");

                    if (data) {
                        data = this.decode(data);

                        data = this.set(data);
                    }
                },

                save: function () {
                    var data, hash;
                    data = this.get();
                    data = this.encode(data);
                    hash = window.location.hash;
                    hash = this.updateQueryStringParameter(hash, "f", data);
                    mediator.publish("nlp.update");

                    location.replace(hash);
                },

                updateQueryStringParameter: function (uri, key, value) {
                    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
                    var separator = uri.indexOf("?") !== -1 ? "&" : "?";
                    if (uri.match(re)) {
                        return uri.replace(re, "$1" + key + "=" + value + "$2");
                    }
                    else {
                        return uri + separator + key + "=" + value;
                    }
                },

                getParameterByName: function (uri, name) {
                    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                        results = regex.exec(uri);
                    return results === null ? "" : results[1].replace(/\+/g, " ");
                },

                reset: function () {
                    historicMeasuresService.unselectAllDimensions();
                    historicMeasuresService.unselectAllMetrics();

                    var date = dateModel.getDateById(dateModel.getDefaultRangeId());

                    dateModel.setStartDate(date.startDate);
                    dateModel.setEndDate(date.endDate);
                    dateModel.setCompareStartDate(date.startDate);
                    dateModel.setCompareEndDate(date.endDate);
                    dateModel.setCompareFlag(false);
                    dateModel.setSelectedRangeId(dateModel.getDefaultRangeId());
                    dateModel.setSelectedRangeName(dateModel.getRangeList()[dateModel.getDefaultRangeId()]);
                    dateModel.setAggregation("date");

                    chartModel.setType("linechart");
                    chartModel.setDimension("");
                    chartModel.setAggregation("date");
                    chartModel.setMetric("");
                },

                getEncodedData: function () {
                    var query;
                    query = this.get();
                    query = this.encode(query);
                    return query;
                },

                getUrl: function (controller, params) {
                    var hash, replacer, key;
                    controller = controller || "";
                    params = params || {};

                    hash = window.location.hash;

                    for (key in params) {
                        hash = this.updateQueryStringParameter(hash, key, params[key]);
                    }

                    replacer = function (match, p1) {
                        return [p1, controller].join("");
                    };

                    hash = hash.replace(/^#(\/)(\w*(?=\?)?)/, replacer);

                    return hash;
                },

                /**
                 * Parse data from URL hash
                 * @params {object} response
                 * @example
                 <example>
                    response = {
                        "d":["0ddddddddd"],
                        "m":["0xxxxxxxxx", "1xxxxxxxxx", "2xxxxxxxxx"],
                        "f":[
                            ["t","yyyyyyyyyy","b",100,"lt",100000000000,[54321,54321,54321,54321]]
                        ],
                        "t":["ddmmyyyy","ddmmyyyy"],
                        "a":"h"
                    }
                 </example>
                 *
                 * @return {object} Parsed object
                 * @example
                 <example>
                    object = {
                        "dimensions":["0ddddddddd","1ddddddddd"],
                        "metrics":["0xxxxxxxxx", "1xxxxxxxxx", "2xxxxxxxxx"],
                        "filters":[
                            {
                                visible: true,
                                metric: "yyyyyyyyyy",
                                rank: "bottom",
                                rankValue: 100,
                                comparison: "lt",
                                compareValue: 100000000000,
                                dimensionValueFilters: [54321,54321,54321,54321]
                            }
                        ],
                        "date":["ddmmyyyy","ddmmyyyy"],
                        "aggregation":"h"
                    }
                 </example>
                 */
                parse: function (response) {
                    var obj = {};
                    response = response || {};
                    obj.dimensions = response.d || [];
                    obj.metrics = response.m || [];
                    obj.filters = response.f || [];
                    obj.date = response.t || [];
                    obj.compareDate = response.ct || [];
                    obj.chart = response.c || {};

                    obj.aggregation = response.a || "date";

                    obj.filters = obj.filters.map(function (i) {
                        var filter = {};

                        // t / f for visible or not-visible
                        filter.visible = i[0] === "t";
                        // list of metrics
                        // TODO: change 'revenue' to $filter("translate")("revenueId")
                        filter.metric = i[1] || "";
                        // rank: b / t for bottom or top
                        filter.rank = i[2] === "b" ? "bottom": "top";
                        // number for topN or bottomN
                        filter.rankValue = i[3];
                        // comparison (eq,lt,gt,le,ge,ne)
                        filter.comparison = i[4];
                        // compare value
                        filter.compareValue = i[5];
                        // dimension value filters
                        filter.dimensionValueFilters = i[6] || [];
                        filter.dimensionValueFilters = filter.dimensionValueFilters.filter(function(el) { return el; });

                        return filter;
                    });

                    return obj;

                },

                /**
                 * Return a copy of the model's attributes for JSON stringification.
                 * This can be used for persistence, serialization, or for augmentation before being sent to url hash.
                 * @params {object} data
                 * @example
                 <example>
                    data = {
                        "dimensions":["0ddddddddd","1ddddddddd"],
                        "metrics":["0xxxxxxxxx", "1xxxxxxxxx", "2xxxxxxxxx"],
                        "filters":[
                            {
                                visible: true,
                                metric: "yyyyyyyyyy",
                                rank: "bottom",
                                rankValue: 100,
                                comparison: "lt",
                                compareValue: 100000000000,
                                dimensionValueFilters: [54321,54321,54321,54321]
                            }
                        ],
                        "date":["ddmmyyyy","ddmmyyyy"],
                        "aggregation":"h"
                    }
                 </example>
                 *
                 * @return {object}
                 * @example
                 <example>
                    object = {
                        "d":["0ddddddddd"],
                        "m":["0xxxxxxxxx", "1xxxxxxxxx", "2xxxxxxxxx"],
                        "f":[
                            ["t","yyyyyyyyyy","b",100,"lt",100000000000,[54321,54321,54321,54321]]
                        ],
                        "t":["ddmmyyyy","ddmmyyyy"],
                        "a":"h"
                    }
                 </example>
                 */
                toJSON: function (data) {
                    var obj = {};
                    data = data || {};
                    obj.d = data.dimensions || [];
                    obj.m = data.metrics || [];
                    obj.f = data.filters || [];
                    obj.t = data.date || [];
                    obj.ct = data.compareDate || [];
                    obj.c = data.chart || {};
                    obj.a = data.aggregation || "data";

                    obj.f = obj.f.map(function (i) {
                        var visible, metric, rank, rankValue, comparison, compareValue, dimensionValueFilters;

                        visible = i.visible;
                        metric = i.metric;
                        rank = i.rank;
                        rankValue = i.rankValue;
                        comparison = i.comparison;
                        compareValue = i.compareValue;
                        dimensionValueFilters = i.dimensionValueFilters;

                        return [visible, metric, rank, rankValue, comparison, compareValue, dimensionValueFilters];
                    });

                    return obj;
                },

                set: function (data) {
                    //TODO: temp change the chart aggregation to hour or date
                    if ((data.aggregation === "hour") || (data.date[0] === 0) || (data.date[0] === 1)  ) {
                        data.chart.a = "hour";
                    }


                    //TODO: modify the dimension and aggregation from date to hour when picker index is 0(today)
                    var dimensionsCollection = historicMeasuresService.getDimensions();
                    if ((data.date[0] === 0)) {
                        data.aggregation = "hour";
                        angular.forEach(data.dimensions, function(dimensionId, index){
                            var dimensionModel = dimensionsCollection.findDimensionById(dimensionId);
                            data.dimensions[index] = (dimensionModel && dimensionModel.getGroupId() === "timeUnits")? "hour": dimensionId;
                        });
                    }


                    // set dimensions to Dimensions Collection
                    this.setDimensions(data);
                    // set metrics to Metrics Collection
                    this.setMetrics(data);
                    // set date
                    this.setDate(data);
                    // set chart settings
                    this.setChart(data);
                    // set aggregation
                    this.setAggregation(data);
                },

                get: function () {
                    var data = {};
                    // get dimensions from Dimensions Collection
                    data.dimensions = this.getDimensions();
                    // get metrics from Metrics Collection
                    data.metrics = this.getMetrics();
                    // get filters from Filter Collection
                    data.filters = this.getFilters();
                    // get date
                    data.date = this.getDate();
                    data.compareDate = this.getCompareDate();
                    // get chart settings
                    data.chart = this.getChart();
                    // get aggregation
                    data.aggregation = this.getAggregation();

                    return data;
                },

                encode: function (data) {
                    data = this.toJSON(data);
                    data = JSON.stringify(data);
                    data = $base64.encode(data);
                    data = encodeURIComponent(data);
                    return data;
                },

                decode: function (data) {
                    data = decodeURIComponent(data);
                    data = $base64.decode(data);
                    data = JSON.parse(data);
                    data = this.parse(data);
                    return data;
                },

                // TODO: move it to DimensionsCollection
                setDimensions: function (data) {
                    var dimensionsCollection, metricsCollection, selectedMetricIds, dimensionsIds, filters;
                    dimensionsCollection = historicMeasuresService.getDimensions();
                    metricsCollection = historicMeasuresService.getMetrics();

                    if (metricsCollection.getSelectedMetrics().length) {
                        selectedMetricIds = metricsCollection.getSelectedMetrics();
                    } else {
                        selectedMetricIds = metricsCollection.getDefaultMetricList();
                    }

                    selectedMetricIds = selectedMetricIds.map(function (metric) { return metric.getId(); });
                    dimensionsIds = data.dimensions;
                    filters = data.filters;

                    var dimensions = dimensionsCollection.models.map(function (dimension) {
                        var id, name, order, selected, visible, groupId, groupName, description;

                        id = dimension.getId();
                        name = dimension.getName();
                        order = dimensionsIds.indexOf(id);
                        selected = order !== -1;
                        visible = filters[order] ? filters[order].visible : false;
                        groupId = dimension.getGroupId();
                        groupName = dimension.getGroupName();
                        description = dimension.getDimensionDescription();

                        return {
                            apiName: id,
                            displayValue: name,
                            order: order,
                            selected: selected,
                            visible: visible,
                            apiGroupName: groupId,
                            groupDisplayValue: groupName,
                            disabled: false,
                            disabledBy: [],
                            description: description
                        };
                    });

                    dimensionsCollection.reset(dimensions);

                    dimensionsCollection.getSelectedDimensions().map(function (dimension) {
                        historicMeasuresService.executeAllowedRules.call(dimensionsCollection, dimension);
                        historicMeasuresService.executeDisallowedRules.call(dimensionsCollection, dimension);
                    });

                    dimensionsIds.map(function (id, index) {
                        var dimension, filter;

                        dimension = dimensionsCollection.findDimensionById(id);

                        filter = data.filters[index];
                        if (selectedMetricIds.indexOf(filter.metric) === -1 && dimension.getGroupId() === "timeUnits") {
                            filter.metric = dimension.getId();
                        }

                        if (selectedMetricIds.indexOf(filter.metric) === -1 && dimension.getGroupId() !== "timeUnits") {
                            filter.metric = selectedMetricIds[0];
                        }

                        dimension.getFilter().setMetric(filter.metric);
                        dimension.getFilter().setRank(filter.rank);
                        dimension.getFilter().setRankValue(filter.rankValue || 10);
                        dimension.getFilter().setComparison(filter.comparison || "");
                        dimension.getFilter().setCompareValue(filter.compareValue || "");
                        dimension.getFilter().setDimensionValueFilters(filter.dimensionValueFilters || []);


                    });
                },

                // TODO: move it to DimensionsCollection
                getDimensions: function () {
                    var dimensionsCollection, dimensionsModels, dimensionsIds;
                    dimensionsCollection = historicMeasuresService.getDimensions();
                    dimensionsModels = dimensionsCollection.getSelectedDimensions();
                    dimensionsIds = dimensionsModels.map(function (model) { return model.getId(); });
                    return dimensionsIds;
                },

                // TODO: move it to MetricsCollection
                setMetrics: function (data) {
                    var metricsCollection, metricIds, filters;
                    metricsCollection = historicMeasuresService.getMetrics();
                    metricIds = data.metrics;
                    filters = data.filters;

                    var metrics = metricsCollection.models.map(function (metric) {
                        var id, name, order, selected, groupId, groupName, description;

                        id = metric.getId();
                        name = metric.getName();
                        order = metricIds.indexOf(id);
                        selected = order !== -1;
                        groupId = metric.getGroupId();
                        groupName = metric.getGroupName();
                        description = metric.getMetricDescription();

                        return {
                            apiName: id,
                            displayValue: name,
                            order: order,
                            selected: selected,
                            apiGroupName: groupId,
                            groupDisplayValue: groupName,
                            disabled: false,
                            disabledBy: [],
                            description: description
                        };
                    });

                    metricsCollection.reset(metrics);

                    metricsCollection.getSelectedMetrics().map(function (metric) {
                        historicMeasuresService.executeAllowedRules.call(metricsCollection, metric);
                        historicMeasuresService.executeDisallowedRules.call(metricsCollection, metric);
                    });
                },

                // TODO: move it to MetricsCollection
                getMetrics: function () {
                    var metricsCollection, metricModels, metricIds;
                    metricsCollection = historicMeasuresService.getMetrics();
                    metricModels = metricsCollection.getSelectedMetrics();
                    metricIds = metricModels.map(function (model) { return model.getId(); });
                    metricIds = metricIds.length ? metricIds : metricsCollection.getDefaultIdList();
                    return metricIds;
                },

                setFilters: function () {

                },

                getFilters: function () {
                    var dimensionsCollection, dimensionsModels, filters;
                    dimensionsCollection = historicMeasuresService.getDimensions();
                    dimensionsModels = dimensionsCollection.getSelectedDimensions();

                    filters = dimensionsModels.map(function (dimension) {
                        var filter = {};

                        // t / f for visible or not-visible
                        filter.visible = dimension.getVisible() ? "t" : "f";
                        // list of metrics
                        // TODO: change 'revenue' to $filter("translate")("revenueId")
                        filter.metric = dimension.getFilter().getMetric();
                        // rank: b / t for bottom or top
                        filter.rank = dimension.getFilter().getRank() === "bottom" ? "b" : "t";
                        // number for topN or bottomN
                        filter.rankValue = dimension.getFilter().getRankValue();
                        // comparison (eq,lt,gt,le,ge,ne)
                        filter.comparison = dimension.getFilter().getComparison();
                        // compare value
                        filter.compareValue = dimension.getFilter().getCompareValue();
                        // dimension value filters
                        filter.dimensionValueFilters = dimension.getFilter().getDimensionValueFilters();

                        return filter;
                    });

                    return filters;
                },
                setTextProcessingData: function (data) {

                    data = this.parse(data);

                    data = this.set(data);
                },

                setDate: function (data) {
                    var date, compareDate, id;
                    id = data.date[0];

                    if (data.date.length === 2) {
                        id = 8;
                    }
                    if (data.compareDate.length === 2) {
                        dateModel.setCompareFlag(true);
                    } else {
                        dateModel.setCompareFlag(false);
                    }

                    date = dateModel.getDateById(id, data.date);
                    compareDate = dateModel.getCompareCustomRange(data.compareDate);

                    dateModel.setStartDate(date.startDate);
                    dateModel.setEndDate(date.endDate);

                    if (dateModel.getCompareFlag()) {
                        dateModel.setCompareStartDate(compareDate.startDate);
                        dateModel.setCompareEndDate(compareDate.endDate);
                    }

                    dateModel.setSelectedRangeId(id);
                    dateModel.setSelectedRangeName(dateModel.getRangeList()[id]);
                },

                getDate: function () {
                    if (dateModel.getSelectedRangeId() === 8) {
                        return [dateModel.getStartDate(true), dateModel.getEndDate(true)];
                    } else {
                        return [dateModel.getSelectedRangeId()];
                    }
                },

                getCompareDate: function () {
                    if (dateModel.getSelectedRangeId() === 8 && dateModel.getCompareFlag()) {
                        return [dateModel.getCompareStartDate(true), dateModel.getCompareEndDate(true)];
                    } else {
                        return [];
                    }
                },

                setAggregation: function (data) {
                    dateModel.setAggregation(data.aggregation);
                },

                getAggregation: function () {
                    return dateModel.getAggregation();
                },

                setChart: function (data) {
                    var chart = data.chart;

                    chartModel.setType(chart.t);
                    chartModel.setDimension(chart.d);
                    chartModel.setAggregation(chart.a);
                    chartModel.setMetric(chart.m);
                },

                getChart: function () {
                    var dimensions, chart = {};

                    dimensions = historicMeasuresService.getDimensions();
                    dimensions = dimensions.getSelectedDimensions();

                    var chartType = (chartModel.getType()) || "linechart";
                    if (dimensions.length < 2  &&  chartType === "heatmap" ){
                        chart.t = "linechart";
                    }
                    else {
                        chart.t = dimensions.length ? chartType :  "linechart";
                    }

                    chart.d = chartModel.getDimension() || "";
                    chart.a = chartModel.getAggregation() || "date";

                    chart.m = chartModel.getMetric() || "";
                    return chart;
                },
                getOnLoadReportUrl: function(){
                    return onLoadUrl;
                },

                setOnLoadReportUrl: function(value){
                    onLoadUrl = value;
                    return onLoadUrl;


                },
                getOnLoadReportUrlValue: function(){
                    return onLoadUrlValue;
                },

                setOnLoadReportUrlValue: function(value){
                    onLoadUrlValue = value;
                    return onLoadUrlValue;
                }
            };

            return {
                parseTextProcessingData:service.setTextProcessingData.bind(service),
                fetch: service.fetch.bind(service),
                save: service.save.bind(service),
                getEncodedData: service.getEncodedData.bind(service),
                getUrl: service.getUrl.bind(service),
                reset: service.reset.bind(service),
                decode: service.decode.bind(service),
                getOnLoadReportUrl: service.getOnLoadReportUrl.bind(service),
                setOnLoadReportUrl: service.setOnLoadReportUrl.bind(service),
                getOnLoadReportUrlValue: service.getOnLoadReportUrlValue.bind(service),
                setOnLoadReportUrlValue: service.setOnLoadReportUrlValue.bind(service),
            };

        }
    ]);

}).call(this, angular);
