/*global angular*/
(function (angular) {
    "use strict";

    var app;

    app = angular.module("pub-ui-analytics.domain");

    app.factory("UserSharedReportModel", [function () {

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
                url: "",
                firstName: "",
                lastName: "",
                email: ""
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
                    url: response.url || this.attributes.url,
                    firstName: response.firstName || this.attributes.firstName,
                    lastName: response.lastName || this.attributes.lastName,
                    email: response.email || this.attributes.email
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

            getFirstName: function () {
                return this.attributes.firstName;
            },

            getLastName: function () {
                return this.attributes.lastName;
            },

            getEmail: function () {
                return this.attributes.email;
            },

            isValid : function(){
                //TODO: Implement validate method here.
                return true;
            },
        };

        return ReportModel;

    }]);

}).call(this, angular);