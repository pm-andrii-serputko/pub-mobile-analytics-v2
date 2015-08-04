  /*global angular*/
(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.domain")
        .factory("ReportModel", ["slicerURLParamsService", "pubAnalyticService", "dimensionValuesService", function (slicerURLParamsService, pubAnalyticService, dimensionValuesService) {

        /**
         * @constructor
         */
        var ReportModel = function (attrs) {
            attrs = attrs || {};
            this.attributes = this.parse(attrs);
        };


        ReportModel.prototype = {

            /**
             * The default attributes of model
             */
            attributes: {
                id: null,
                url: "",
                name: "",
                description: "",
                groupId: null,
                groupName: "",
                updatedAt: "",
                sharedByUser:{
                    userId: null,
                    firstName: "",
                    lastName: "",
                    email: ""
                },
                shared: false
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
                    id: response.id || this.attributes.id,
                    url: response.url || this.attributes.url,
                    name: response.name || this.attributes.name,
                    description: response.description || this.attributes.description,
                    groupId: response.groupId || this.attributes.groupId,
                    groupName: response.groupName || this.attributes.groupName,
                    updatedAt: response.modificationDate || this.attributes.updatedAt,
                    sharedByUser:response.sharedByUser || this.attributes.sharedByUser,
                    shared: response.shared || this.attributes.shared
                };

                return attrs;
            },

            get: function (attr) {
                return this.attributes[attr];
            },

            set: function (attrs) {
                for (var key in attrs) {
                    this.attributes[key] = attrs[key];
                }
            },

            getId: function () {
                return this.attributes.id;
            },

            setId: function (value) {
                this.attributes.id = value;
            },

            getUrl: function () {
                return this.attributes.url;
            },

            setUrl: function (value) {
                this.attributes.url = value;
            },

            getName: function () {
                return this.attributes.name;
            },

            setName: function (value) {
                this.attributes.name = value;
            },

            getDescription: function () {
                return this.attributes.description || "";
            },

            setDescription: function (value) {
                this.attributes.description = value;
            },

            getGroupId: function () {
                return this.attributes.groupId;
            },

            setGroupId: function (value) {
                this.attributes.groupId = value;
            },

            getGroupName: function () {
                return this.attributes.groupName;
            },

            setGroupName: function (value) {
                this.attributes.groupName = value;
            },

            getUpdatedAt: function () {
                return this.attributes.updatedAt;
            },

            setUpdatedAt: function (value) {
                this.attributes.updatedAt = value;
            },
            getShared: function () {
                return this.attributes.shared;
            },

            setShared: function (value) {
                this.attributes.shared = value;
            },
            getSharedByUserInformation: function () {
                return this.attributes.sharedByUser.firstName + this.attributes.sharedByUser.lastName;
            },

            isValid: function () {
                return this.validate();
            },

            validate: function () {
                var urlData, dimensionIds = [], dimensions;

                urlData = this.getUrl();
                urlData = urlData.replace(/^#?\/slice(\?f=)?/, "");
                // It's needed because some urls were saved with standardReportId
                urlData = urlData.replace(/&standardReportId=\w*/gi, "");
                // It's needed because some urls were saved with customReportId
                urlData = urlData.replace(/&customReportId=\d*/gi, "");


                // TODO: Andrew - it will be moved to service layer after refactoring
                if (urlData) {
                    var data = slicerURLParamsService.decode(urlData);
                    data = data.dimensions.reduce(function (result, dimensionId, index) {
                        if (data.filters[index].dimensionValueFilters.length) {
                            var dimensionValues = data.filters[index].dimensionValueFilters;
                            result[dimensionId] = dimensionValues.reduce(function (obj, id) {
                                obj[id] = null;
                                return obj;
                            }, {});
                        }
                        return result;
                    }, {});

                    dimensionValuesService.add(data);
                }

                dimensions = pubAnalyticService.getHistoricDimensions();
                dimensionIds = urlData ? slicerURLParamsService.decode(urlData).dimensions : [];
                dimensionIds = dimensionIds.map(function (id) { return dimensions.findDimensionById(id); });

                return !dimensionIds.some(function (dimensionModel) { return !dimensionModel; });
            }

        };

        return ReportModel;

    }]);

}).call(this, angular);