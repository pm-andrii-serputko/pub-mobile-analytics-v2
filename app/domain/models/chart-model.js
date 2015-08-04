/*global angular*/
(function (angular) {
    "use strict";

    var app;

    app = angular.module("pub-ui-analytics.domain");

    app.factory("chartModel", [

        function () {

             
            return {
                /**
                 * The default attributes of model
                 */
                attributes: {
                    type: "linechart", // linechart, barchart, piechart, heatmap
                    dimension: "",
                    aggregation: "date", //date, hour
                    metric: "",
                    changeChart: false,
                    isDefaultChart: true,
                    timeList: [],
                    isDualScale: false,
                    dualScaleMetric: ""
                },

                getType: function () {
                    return this.attributes.type;
                },

                setType: function (value) {
                    this.attributes.type = value;
                },

                getDimension: function () {
                    return this.attributes.dimension;
                },

                setDimension: function (value) {
                    this.attributes.dimension = value;
                },

                getAggregation: function () {
                    return this.attributes.aggregation;
                },

                setAggregation: function (value) {
                    this.attributes.aggregation = value;
                },

                getMetric: function () {
                    return this.attributes.metric;
                },

                setMetric: function (value) {
                    this.attributes.metric = value;
                },

                getIsDualScale: function () {
                    return this.attributes.isDualScale;
                },

                setIsDualScale: function (value) {
                    this.attributes.isDualScale = value;
                },

                getDualScaleMetric: function () {
                    return this.attributes.dualScaleMetric;
                },

                setDualScaleMetric: function (value) {
                    this.attributes.dualScaleMetric = value;
                },

                getChangeChart: function () {
                    return this.attributes.changeChart;
                },

                setChangeChart: function (value) {
                    this.attributes.changeChart = value;
                },

                getIsDefaultChart: function () {
                    return this.attributes.isDefaultChart;
                },

                setIsDefaultChart: function (value) {
                    this.attributes.isDefaultChart = value;
                },

                getTimeList: function () {
                    return this.attributes.timeList;
                },

                setTimeList: function (value) {
                    this.attributes.timeList = value;
                },

                getScatterBubbleMetricOrder: function () {
                    return this.attributes.scatterBubbleMetricOrder;
                },

                setScatterBubbleMetricOrder: function (value) {
                    this.attributes.scatterBubbleMetricOrder = value;
                }
            };
        
        }
    ]);

}).call(this, angular);