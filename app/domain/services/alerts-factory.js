/*global angular*/
(function (angular) {
    "use strict";

    var app;

    app = angular.module("pub-ui-analytics.domain");

    app.factory("AlertsFactory", [
        "$q",
        "$http",
        "middlewareRoutes",
        "AlertsModel",
        "AlertsCountModel",
        "AlertsConfigModel",
        "AlertsUserSettingModel",
        "AlertsCollection",
        function ($q, $http, middlewareRoutes, AlertsModel, AlertsCountModel, AlertsConfigModel, AlertsUserSettingModel, AlertsCollection) {

            /**
             * @constructor
             * Mix enumerable methods
             */
            var collectionMixin = function (collection) {
                collection.methods.map(function(method) {
                    this[method] = collection[method].bind(collection);
                }, this);
            };

            var constructors = {

                /**
                 * @constructor
                 * Alerts constructor
                 */
                alerts: function () {
                    this.url = middlewareRoutes.alerts;
                    this.collection = new AlertsCollection({model: AlertsModel});
                    collectionMixin.apply(this, [this.collection]);
                },

                /**
                 * @constructor
                 * Alerts Count constructor
                 */
                alertsCount: function () {
                    this.url = middlewareRoutes.alertsCount;
                    this.collection = new AlertsCollection({model: AlertsCountModel});
                    collectionMixin.apply(this, [this.collection]);
                },

                /**
                 * @constructor
                 * Alerts Count constructor
                 */
                alertsRead: function () {
                    this.url = middlewareRoutes.alertsRead;
                    this.collection = new AlertsCollection({model: function () {
                        this.isvalid = true;
                    }});
                    collectionMixin.call(this, this.collection);
                },
                 /**
                 * @constructor
                 * Alerts Config constructor
                 */
                alertsConfig: function () {
                    this.url = middlewareRoutes.alertsConfig;
                    this.collection = new AlertsCollection({model: AlertsConfigModel});
                    collectionMixin.apply(this, [this.collection]);
                },

                 /**
                 * @constructor
                 * Alerts Config constructor
                 */
                alertsUserSetting: function () {
                    this.url = middlewareRoutes.alertsUserSetting;
                    this.collection = new AlertsCollection({model: AlertsUserSettingModel});
                    collectionMixin.apply(this, [this.collection]);
                }

            };

            /**
             * @constructor
             */
            var AlertsFactory = function () {};

            AlertsFactory.prototype = {

                deferred: $q.defer(),

                /**
                 * @description
                 * Generate url
                 * @params id {number}
                 * @returns {string} url
                 */
                getUrl: function (id, pageSize) {
                    var retVal;
                    pageSize = pageSize || "";
                    if(id || id===0){
                        retVal = this.url + "/" + id + "?pageSize=" + pageSize;
                    }else{
                        retVal = this.url + "?pageSize=" + pageSize;
                    }
                    return retVal;
                },

                /**
                 * @description
                 * Generate url
                 * @params id {number}
                 * @params type {string}
                 * @returns {string} url
                 */
                getUrlAlertsConfig: function (type) {
                    if(type){
                        return this.url + "?alertType=" + type ;
                    }
                },

                /**
                 * @description
                 * Makes a RESTful Ajax request to Middleware
                 * @params method {string} type of Ajax request GET|POST|PUT|DELETE
                 * @params data {object} data to be sent to the Middleware.
                 * @params options {object}
                 * @returns {object} <$http>
                 */
                sync: function (method, data, options, type, pageSize) {
                    var config, request;
                    if(type){
                        config = {
                            method: method,
                            url: this.getUrlAlertsConfig(type),
                            cache: false,
                            data: data
                        };
                    }else{
                        config = {
                            method: method,
                            url: this.getUrl(options.id, pageSize),
                            cache: false,
                            data: data
                        };
                    }

                    request = $http(config);
                    request.success(options.success);

                    this.deferred.resolve(request);

                    return request;
                },


                /**
                 * @description
                 * Get alerts from the Middleware.
                 * @returns {object} <$http>
                 */
                fetch: function (type, pageSize) {
                    var options = {
                        success: this.collection.reset.bind(this.collection)
                    };

                    return this.sync("GET", {}, options, type, pageSize);
                },

                /**
                 * @description
                 * Create a report
                 * @params data {object} data to be sent to the Middleware.
                 * @returns {object} <$http>
                 */
                create: function (data) {
                    var options = {
                        success: this.collection.add.bind(this.collection)
                    };

                    data = data || {};

                    return this.sync("POST", data, options);
                },

                /**
                 * @description
                 * Update report
                 * @params id {number}
                 * @params data {object} data to be sent to the Middleware.
                 * @returns {object} <$http>
                 */
                update: function (id, data) {
                    var options = {
                        id: id,
                        success: this.collection.update.bind(this.collection, id, data)
                    };

                    return this.sync("PUT", data, options);
                },

                /**
                 * @description
                 * Destroy report
                 * @params id {number}
                 * @returns {object} <$http>
                 */
                destroy: function (id) {
                    var options = {
                        id: id,
                        success: this.collection.destroy.bind(this.collection, id)
                    };

                    return this.sync("DELETE", {}, options);
                }

            };

            AlertsFactory.Alerts = constructors.alerts;
            AlertsFactory.AlertsCount = constructors.alertsCount;
            AlertsFactory.AlertsRead = constructors.alertsRead;
            AlertsFactory.AlertsConfig = constructors.alertsConfig;
            AlertsFactory.AlertsUserSetting = constructors.alertsUserSetting;
            return {
                create: function (constructor) {
                    if (typeof AlertsFactory[constructor] !== "function") {
                        throw { name: "Error", message: constructor + " doesn't exist" };
                    }

                    AlertsFactory[constructor].prototype = new AlertsFactory();

                    var alertsService = new AlertsFactory[constructor]();
                    return alertsService;
                }
            };
        }
    ]);


    app.factory("alertsService", ["AlertsFactory", function (AlertsFactory) {
        return AlertsFactory.create("Alerts");
    }]);
    app.factory("alertsCountService", ["AlertsFactory", function (AlertsFactory) {
        return AlertsFactory.create("AlertsCount");
    }]);
    app.factory("alertsReadService", ["AlertsFactory", function (AlertsFactory) {
        return AlertsFactory.create("AlertsRead");
    }]);
    app.factory("alertsConfigService", ["AlertsFactory", function (AlertsFactory) {
        return AlertsFactory.create("AlertsConfig");
    }]);
    app.factory("alertsUserSettingService", ["AlertsFactory", function (AlertsFactory) {
        return AlertsFactory.create("AlertsUserSetting");
    }]);
}).call(this, angular);