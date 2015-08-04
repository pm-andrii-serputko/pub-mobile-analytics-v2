/*global angular*/
(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.domain")
        .factory("MetricModel", ["$filter", function ($filter) {

         /**
         * @constructor
         */
        var MetricModel = function (attrs) {
            this.attributes = this.parse(attrs);
        };

        MetricModel.prototype = {

            /**
             * The default attributes of model
             */
            attributes: {
                id: "",
                name: "",
                selected: false,
                order: -1,
                groupId: "",
                groupName: "",
                disabled: false,
                disabledBy: [],
                metricDescription: ""
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
                    id: response.apiName,
                    name: response.displayValue || "",
                    type: response.type,                          /** @deprecated */
                    selected: response.selected || this.attributes.selected,
                    order: response.order || this.attributes.order,
                    groupId: response.apiGroupName || this.attributes.groupId,
                    groupName: response.groupDisplayValue || this.attributes.groupName,
                    disabled: response.disabled || this.attributes.disabled,
                    disabledBy: response.disabledBy || this.attributes.disabledBy,
                    metricDescription: response.description || this.attributes.metricDescription
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
            setType: function (value) {
                this.attributes.type = value;
            },

            /**
             * @deprecated it will not be supported after 15 of Aug
             */
            getType: function () {
                return this.attributes.type;
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
             * Get metricDescription from the model.
             * @returns {string}
             */
            getMetricDescription: function () {
                return this.attributes.metricDescription;
            },

            /**
             * @description
             * Set metricDescription to the model.
             * @params value {string}
             */
            setMetricDescription: function (value) {
                this.attributes.metricDescription = value;
            }
        };

        return {
            /**
             * Create new instance of MetricModel
             * @returns {object} <MetricModel> instance
             */
            newInstance: function (options) {
                options = options || {};
                return new MetricModel(options);
            }
        };
    }]);

}).call(this, angular);


