/*global angular*/
(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.domain")
        .factory("DimensionModel", ["FilterModel", "$filter", "$injector", "dimensionValuesService", function (FilterModel, $filter, $injector, dimensionValuesService) {

        var comparisonMap = {
            gt: ">",
            lt: "<",
            eq: "=",
            gtEq: ">=",
            ltEq: "<=",
            notEq: "!="
        };

        /**
         * @constructor
         */
        var DimensionModel = function (options) {
            this.attributes = this.parse(options);
        };

        DimensionModel.prototype = {

            /**
             * The default attributes of model
             */
            attributes: {
                id: "",
                name: "",
                additionalMetric: "", /** @deprecated */
                selected: false,
                visible: false,
                order: -1,
                filter: new FilterModel(),
                groupId: "",
                groupName: "",
                disabled: false,
                disabledBy: [],
                dimensionDescription: ""
            },

            /**
             * @description
             * The function is passed the raw response object,
             * and should return the attributes hash to be set on the model.
             * @params response {object}
             * @returns {object} attributes hash
             */
            parse: function (response) {
                var attrs = {
                    id: response.apiName || this.attributes.id,
                    name: response.displayValue || this.attributes.name,
                    additionalMetric: response.additionalMetric || this.attributes.additionalMetric,  /** @description */
                    selected: response.selected || this.attributes.selected,
                    visible: response.visible || this.attributes.visible,
                    order: response.order || this.attributes.order,
                    filter: new FilterModel(response.filter, (response.apiGroupName || this.attributes.groupId)) || this.attributes.filter,
                    groupId: response.apiGroupName || this.attributes.groupId,
                    groupName: response.groupDisplayValue || this.attributes.groupName,
                    disabled: response.disabled || this.attributes.disabled,
                    disabledBy: response.disabledBy || this.attributes.disabledBy,
                    dimensionDescription: response.description || this.attributes.dimensionDescription
                };

                attrs.order = response.order === 0 ? response.order : attrs.order;
                attrs.name = $filter("translate")(attrs.name);

                return attrs;
            },

            /**
             * @description
             * Get id (apiName) from the model.
             * @returns {string}
             */
            getId: function () {
                return this.attributes.id;
            },

            /**
             * @description
             * Set id (apiName) to the model.
             * @params value {string}
             */
            setId: function (value) {
                this.attributes.id = value;
            },

            /**
             * @description
             * Get name (displayValue) from the model.
             * @returns {string}
             */
            getName: function () {
                return this.attributes.name;
            },

            /**
             * @description
             * Set name (displayValue) to the model.
             * @params value {string}
             */
            setName: function (value) {
                this.attributes.name = value;
            },

            /**
             * @deprecated it will not be supported after 15 of Aug
             */
            getAdditionalMetric: function () {
                return this.attributes.additionalMetric;
            },

            /**
             * @deprecated it will not be supported after 15 of Aug
             */
            setAdditionalMetric: function (value) {
                this.attributes.additionalMetric = value;
            },

            /**
             * @description
             * Get selected from the model.
             * @returns {boolean}
             */
            getSelected: function () {
                return this.attributes.selected;
            },

            /**
             * @description
             * Set selected from the model.
             * @params value {boolean}
             */
            setSelected: function (value) {
                this.attributes.selected = value;
            },

            /**
             * @description
             * Get visible from the model.
             * @returns {boolean}
             */
            getVisible: function () {
                return this.attributes.visible;
            },

            /**
             * @description
             * Set visible from the model.
             * @params value {boolean}
             */
            setVisible: function (value) {
                this.attributes.visible = value;
            },

            /**
             * @description
             * Get order from the model.
             * @returns {number}
             */
            getOrder: function () {
                return this.attributes.order;
            },

            /**
             * @description
             * Set order from the model.
             * @params value {number}
             */
            setOrder: function (value) {
                this.attributes.order = value;
            },

            /**
             * @description
             * Get filter model<FilterModel>.
             * @returns {object}
             */
            getFilter: function () {
                return this.attributes.filter;
            },

            /**
             * @description
             * Set filter model<FilterModel>.
             * @params attrs {object} params for FilterModel
             */
            setFilter: function (attrs) {
                this.attributes.filter = new FilterModel(attrs, this.attributes.groupId);
            },

            /**
             * @description
             * Get groupId (apiGroupName) from the model.
             * @returns {string}
             */
            getGroupId: function () {
                return this.attributes.groupId;
            },

            /**
             * @description
             * Set groupId (apiGroupName) to the model.
             * @params value {string}
             */
            setGroupId: function (value) {
                this.attributes.groupId = value;
            },

            /**
             * @description
             * Get groupName (groupDisplayValue) from the model.
             * @returns {string}
             */
            getGroupName: function () {
                return this.attributes.groupName;
            },

            /**
             * @description
             * Set groupName (groupDisplayValue) to the model.
             * @params value {string}
             */
            setGroupName: function (value) {
                this.attributes.groupName = value;
            },

            /**
             * @description
             * Get disabled from the model.
             * @returns {string}
             */
            getDisabled: function () {
                return this.attributes.disabled;
            },

            /**
             * @description
             * Set disabled to the model.
             * @params value {string}
             */
            setDisabled: function (value) {
                this.attributes.disabled = value;
            },

            /**
             * @description
             * Get disabledBy from the model.
             * @returns {string}
             */
            getDisabledBy: function () {
                return this.attributes.disabledBy;
            },

            /**
             * @description
             * Set disabledBy to the model.
             * @params value {string}
             */
            setDisabledBy: function (value) {
                this.attributes.disabledBy = value;
            },

             /**
             * @description
             * Get dimensionDescription from the model.
             * @returns {string}
             */
            getDimensionDescription: function () {
                return this.attributes.dimensionDescription;
            },

            /**
             * @description
             * Set dimensionDescription to the model.
             * @params value {string}
             */
            setDimensionDescription: function (value) {
                this.attributes.dimensionDescription = value;
            },

            getDescription: function () {
                var rank, metric, comparison, dimensionValues, pubAnalyticService;
                /* Before using pubAnalyticService for the first time
                 * we need to inject it */
                if (!pubAnalyticService) { pubAnalyticService = $injector.get("pubAnalyticService"); }
                rank = $filter("translate")(this.getFilter().getRank()) + " " + this.getFilter().getRankValue();

                if(pubAnalyticService.getHistoricMetrics().findMetricById(this.getFilter().getMetric())){
                    metric = pubAnalyticService.getHistoricMetrics().findMetricById(this.getFilter().getMetric()).getName();
                } else if (pubAnalyticService.getHistoricDimensions().findDimensionById(this.getFilter().getMetric())) {
                    metric = pubAnalyticService.getHistoricDimensions().findDimensionById(this.getFilter().getMetric()).getName();
                }

                comparison = "Total is " + comparisonMap[this.getFilter().getComparison()] + " " + this.getFilter().getCompareValue() + " ";
                comparison = this.getFilter().getComparison() && this.getFilter().getCompareValue() ? comparison : "";

                dimensionValues = dimensionValuesService.find(this.getId()) || {};

                dimensionValues = this.getFilter().getDimensionValueFilters().map(function (id) {
                    var value = dimensionValues[id] || id;
                    value = value + "";
                    value = value.trim();
                    return value;
                });

                dimensionValues = dimensionValues.sort();
                dimensionValues = dimensionValues.join(", ");
                dimensionValues = dimensionValues.length > 100 ? dimensionValues.slice(0, 100).trim() + "..." : dimensionValues;
                dimensionValues = " Dimension Values are " + dimensionValues + " ";
                dimensionValues = this.getFilter().getDimensionValueFilters().length ? dimensionValues : "";

                return rank + " x " + metric + comparison + dimensionValues;
            }

        };

        return {
            /**
             * Create new instance of DimensionModel
             * @returns {object} <DimensionModel> instance
             */
            newInstance: function (options) {
                options = options || {};
                return new DimensionModel(options);
            }
        };
    }]);


}).call(this, angular);


