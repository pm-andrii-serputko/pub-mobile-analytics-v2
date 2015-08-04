/*global angular*/
(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.domain")
        .value("FilterModel", (function () {

        var FilterModel = function (attrs, groupId) {
            attrs = attrs || {};

            this.attributes.rankValue = groupId === "timeUnits" ? 100 : 10;
            this.attributes.rank = groupId === "timeUnits" ? "bottom" : "top";
            this.attributes = this.parse(attrs);
        };

        FilterModel.prototype = {

            attributes: {
                metric: "",// metric apiName
                rank: "",  // bottom, top
                rankValue: null,  // 10, 25, 50, 100
                comparison: "", // gt, lt, eq, ge, le, ne
                compareValue: "",
                dimensionValueFilters: [] // dimensions apiNames
            },

            parse: function (response) {
                var attrs = {
                    metric: response.metric || this.attributes.metric,
                    rank: response.rank || this.attributes.rank,
                    rankValue: response.rankValue || this.attributes.rankValue,
                    comparison: response.comparison || this.attributes.comparison,
                    compareValue: response.compareValue || this.attributes.compareValue,
                    dimensionValueFilters: response.dimensionValueFilters || this.attributes.dimensionValueFilters
                };
                return attrs;
            },

            getMetric: function () {
                return this.attributes.metric;
            },

            setMetric: function (value) {
                this.attributes.metric = value;
            },

            getRank: function () {
                return this.attributes.rank;
            },

            setRank: function (value) {
                this.attributes.rank = value;
            },

            getRankValue: function () {
                return this.attributes.rankValue;
            },

            setRankValue: function (value) {
                this.attributes.rankValue = value;
            },

            getComparison: function () {
                return this.attributes.comparison;
            },

            setComparison: function (value) {
                this.attributes.comparison = value;
            },

            getCompareValue: function () {
                return this.attributes.compareValue;
            },

            setCompareValue: function (value) {
                this.attributes.compareValue = value;
            },

            getDimensionValueFilters: function () {
                return this.attributes.dimensionValueFilters;
            },

            setDimensionValueFilters: function (value) {
                this.attributes.dimensionValueFilters = value;
            }
        };

        return FilterModel;

    })());

}).call(this, angular);
