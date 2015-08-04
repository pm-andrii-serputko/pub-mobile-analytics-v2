/*global angular*/
(function (angular) {
    "use strict";

    var app;

    app = angular.module("pub-ui-analytics.domain");

    app.factory("AlertsModel", [function () {

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
            attributes:  {
                id: null,
                ruleId: null,
                title: "",
                description: "",
                message: "",
                rank: null,
                readFlag: false,
                createdAt: "",
                updatedAt: ""
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
                    ruleId: response.ruleId || this.attributes.ruleId,
                    title: response.title || this.attributes.title,
                    description: response.description || this.attributes.description,
                    message: response.message || this.attributes.message,
                    rank: response.rank || this.attributes.rank,
                    readFlag: response.readFlag || this.attributes.readFlag,
                    createdAt: response.createdAt || this.attributes.createdAt,
                    updatedAt: response.updatedAt || this.attributes.updatedAt
                };

                return attrs;
            },

            get: function (attr) {
                return this.attributes[attr];
            },

            getId: function () {
                return this.attributes.id;
            },

            getUrl: function () {
                return this.attributes.url;
            },

            getRuleId: function () {
                return this.attributes.ruleId;
            },

            getTitle: function () {
                return this.attributes.title;
            },

            getDescription: function () {
                return this.attributes.description;
            },

            getReadFlag: function () {
                return this.attributes.readFlag;
            },

            getCreatedAt: function () {
                return this.attributes.createdAt;
            },

            getUpdatedAt: function () {
                return this.attributes.updatedAt;
            },

            isValid : function(){
                //TODO: Implement validate method here.
                return true;
            }
        };

        return ReportModel;

    }]);
}).call(this, angular);