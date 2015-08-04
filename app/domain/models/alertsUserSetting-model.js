/*global angular*/
(function (angular) {
    "use strict";

    var app;

    app = angular.module("pub-ui-analytics.domain");

    app.factory("AlertsUserSettingModel", [function () {

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
                userId: null,
                emailSwitch: false,
                deleteInDays: null,
                featureSwitch: false,
                id: null
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
                    userId: response.userId || this.attributes.userId,
                    emailSwitch: response.emailSwitch || this.attributes.emailSwitch,
                    featureSwitch: response.featureSwitch || this.attributes.featureSwitch,
                    id: response.id || this.attributes.id
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

            getUserId: function () {
                return this.attributes.userId;
            },

            setUserId: function (value) {
                this.attributes.userId = value;
            },

            getEmailSwitch: function () {
                return this.attributes.emailSwitch;
            },

            setEmailSwitch: function (value) {
                this.attributes.emailSwitch = value;
            },

            getFeatureSwitch: function () {
                return this.attributes.featureSwitch;
            },

            setFeatureSwitch: function (value) {
                this.attributes.featureSwitch = value;
            },

            isValid : function(){
                //TODO: Implement validate method here.
                return true;
            },
        };

        return ReportModel;

    }]);

}).call(this, angular);