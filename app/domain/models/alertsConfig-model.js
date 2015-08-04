/*global angular*/
(function (angular) {
    "use strict";

    var app;

    app = angular.module("pub-ui-analytics.domain");

    app.factory("AlertsConfigModel", [function () {

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
                description: "",
                title: "",
                userId: null,
                emailIds: [],
                rank: 0,
                createdAt: "",
                updatedAt: "",
                emailSwitch: false,
                triggerFrequency: "",
                emailContentType: "",
                featureSwitch: false,
                id: null,
                type: "",
                query: ""
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
                    description: response.description || this.attributes.description,
                    title: response.title || this.attributes.title,
                    userId: response.userId || this.attributes.userId,
                    emailIds: response.emailIds || this.attributes.emailIds,
                    rank: response.rank || this.attributes.rank,
                    createdAt: response.createdAt || this.attributes.createdAt,
                    updatedAt: response.updatedAt || this.attributes.updatedAt,
                    emailSwitch: response.emailSwitch || this.attributes.emailSwitch,
                    triggerFrequency: response.triggerFrequency || this.attributes.triggerFrequency,
                    emailContentType: response.emailContentType || this.attributes.emailContentType,
                    featureSwitch: response.featureSwitch || this.attributes.featureSwitch,
                    id: response.id || this.attributes.id,
                    type: response.type || this.attributes.type,
                    query: response.query || this.attributes.query
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

            getDescription: function () {
                return this.attributes.description;
            },

            setDescription: function (value) {
                this.attributes.description = value;
            },

            getUserId: function () {
                return this.attributes.userId;
            },

            setUserId: function (value) {
                this.attributes.userId = value;
            },

            getTitle: function () {
                return this.attributes.title;
            },

            setTitle: function (value) {
                this.attributes.title = value;
            },

            getEmailIds: function () {
                return this.attributes.emailIds;
            },

            setEmailIds: function (value) {
                this.attributes.emailIds = value;
            },
            getRank: function () {
                return this.attributes.rank;
            },

            setRank: function (value) {
                this.attributes.rank = value;
            },

            getCreatedAt: function () {
                return this.attributes.createdAt;
            },

            setCreatedAt: function (value) {
                this.attributes.createdAt = value;
            },

            getUpdatedAt: function () {
                return this.attributes.updatedAt;
            },

            setUpdatedAt: function (value) {
                this.attributes.updatedAt = value;
            },

            getTriggerFrequency: function () {
                return this.attributes.triggerFrequency;
            },

            setTriggerFrequency: function (value) {
                this.attributes.triggerFrequency = value;
            },

            getEmailContentType: function () {
                return this.attributes.emailContentType;
            },

            setEmailContentType: function (value) {
                this.attributes.emailContentType = value;
            },

            getFeatureSwitch: function () {
                return this.attributes.featureSwitch;
            },

            setFeatureSwitch: function (value) {
                this.attributes.featureSwitch = value;
            },

            getEmailSwitch: function () {
                return this.attributes.emailSwitch;
            },

            setEmailSwitch: function (value) {
                this.attributes.emailSwitch = value;
            },

            getType: function () {
                return this.attributes.type;
            },

            setType: function (value) {
                this.attributes.type = value;
            },

            getQuery: function () {
                return this.attributes.query;
            },

            setQuery: function (value) {
                this.attributes.query = value;
            },

            isValid : function(){
                //TODO: Implement validate method here.
                return true;
            },
        };

        return ReportModel;

    }]);

}).call(this, angular);