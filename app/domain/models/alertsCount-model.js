/*global angular*/
(function (angular) {
    "use strict";

    var app;

    app = angular.module("pub-ui-analytics.domain");

    app.factory("AlertsCountModel", [function () {

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
                readCount: 0,
                unreadCount: 0
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
                    readCount: response.readCount || this.attributes.readCount,
                    unreadCount: response.unreadCount || this.attributes.unreadCount,
                };

                return attrs;
            },

            get: function (attr) {
                return this.attributes[attr];
            },

            getReadCount: function () {
                return this.attributes.readCount;
            },

            getUnreadCount: function () {
                return this.attributes.unreadCount;
            },

            isValid : function(){
                //TODO: Implement validate method here.
                return true;
            }
        };

        return ReportModel;

    }]);
}).call(this, angular);