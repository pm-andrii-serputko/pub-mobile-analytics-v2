/*global angular*/
(function (angular) {
    "use strict";

    var app;

    app = angular.module("pub-ui-analytics.domain");

    app.factory("ReportFactory", [
        "$q",
        "$http",
        "middlewareRoutes",
        "ReportsCollection",
        "ReportModel",
        "ScheduleReportModel",
        "UserSharedReportModel",
        function ($q, $http, middlewareRoutes, ReportsCollection, ReportModel, ScheduleReportModel, UserSharedReportModel) {

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
                 * Custom report constructor
                 */
                custom: function () {
                    this.url = middlewareRoutes.saved;
                    this.collection = new ReportsCollection({model: ReportModel});
                    collectionMixin.apply(this, [this.collection]);
                },

                /**
                 * @constructor
                 * Standard report constructor
                 */
                standard: function () {
                    this.url = middlewareRoutes.common;
                    this.collection = new ReportsCollection({model: ReportModel});
                    collectionMixin.call(this, this.collection);
                },

                /**
                 * @constructor
                 * Schedule report constructor
                 */
                schedule: function () {
                    this.url = middlewareRoutes.schedule;
                    this.collection = new ReportsCollection({model: ScheduleReportModel});
                    collectionMixin.call(this, this.collection);
                },

                /**
                 * @constructor
                 * User profile report constructor
                 */
                userShared: function () {
                    this.url = middlewareRoutes.userShared;
                    this.collection = new ReportsCollection({model: UserSharedReportModel});
                    collectionMixin.call(this, this.collection);
                },

                /**
                 * @constructor
                 * Share report constructor when report Id available(report saved in db)
                 */
                sharedSaved: function () {
                    this.url = middlewareRoutes.shareSaved;
                    this.collection = new ReportsCollection({model: function () {
                        this.isvalid = true;
                    }});
                    collectionMixin.call(this, this.collection);
                },

                /**
                 * @constructor
                 * Share report constructor when report Id not available(when report not saved yet in db/new report )
                 */
                sharedNotSaved: function () {
                    this.url = middlewareRoutes.shareNotSaved;
                    this.collection = new ReportsCollection({model: function () {
                        this.isvalid = true;
                    }});
                    collectionMixin.call(this, this.collection);
                }

            };

            /**
             * @constructor
             */
            var ReportFactory = function () {};

            ReportFactory.prototype = {

                deferred: $q.defer(),

                /**
                 * @description
                 * Generate url
                 * @params id {number}
                 * @returns {string} url
                 */
                getUrl: function (id) {
                    return id ? this.url + "/" + id : this.url;
                },

                /**
                 * @description
                 * Makes a RESTful Ajax request to Middleware
                 * @params method {string} type of Ajax request GET|POST|PUT|DELETE
                 * @params data {object} data to be sent to the Middleware.
                 * @params options {object}
                 * @returns {object} <$http>
                 */
                sync: function (method, data, options) {
                    var config, request;

                                  
                    config = {
                        method: method,
                        url: this.getUrl(options.id),
                        cache: false,
                        data: data
                    };

                    request = $http(config);
                    request.success(options.success);

                    this.deferred.resolve(request);

                    return request;
                },

                /**
                 * @description
                 * Get reports from the Middleware.
                 * @returns {object} <$http>
                 */
                fetch: function () {
                    var options = {
                        success: this.collection.reset.bind(this.collection)
                    };

                    return this.sync("GET", {}, options);
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

            ReportFactory.Custom = constructors.custom;
            ReportFactory.Standard = constructors.standard;
            ReportFactory.Schedule = constructors.schedule;
            ReportFactory.userShared = constructors.userShared;
            ReportFactory.sharedSaved = constructors.sharedSaved;
            ReportFactory.sharedNotSaved = constructors.sharedNotSaved;

            return {
                create: function (constructor) {
                    if (typeof ReportFactory[constructor] !== "function") {
                        throw { name: "Error", message: constructor + " doesn't exist" };
                    }

                    ReportFactory[constructor].prototype = new ReportFactory();

                    var reportService = new ReportFactory[constructor]();
                    return reportService;
                }
            };
        }
    ]);

    app.factory("savedReportsService", ["ReportFactory", function (ReportFactory) {
        return ReportFactory.create("Custom");
    }]);

    app.factory("commonReportsService", ["ReportFactory", function (ReportFactory) {
        return ReportFactory.create("Standard");
    }]);

    app.factory("scheduleReportsService", ["ReportFactory", function (ReportFactory) {
        return ReportFactory.create("Schedule");
    }]);

    app.factory("userSharedReportsService", ["ReportFactory", function (ReportFactory) {
        return ReportFactory.create("userShared");
    }]);

    app.factory("sharedSavedReportsService", ["ReportFactory", function (ReportFactory) {
        return ReportFactory.create("sharedSaved");
    }]);

    app.factory("sharedNotSavedReportsService", ["ReportFactory", function (ReportFactory) {
        return ReportFactory.create("sharedNotSaved");
    }]);
}).call(this, angular);