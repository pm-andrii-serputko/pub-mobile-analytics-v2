/*global angular*/
(function (angular) {
    "use strict";

    // TODO: separete dao and domain functionality
    // MetadataDao
    // MetadataService
    //  - UserModel
    //  - DimensionFactory
    //  - MetricsFactore

    var app;

    app = angular.module("pub-ui-analytics.domain");

    app.factory("pubAnalyticService", [
        "$q",
        "$http",
        "middlewareRoutes",
        "DimensionsCollection",
        "MetricsCollection",
        "pubLocale",
        "config",

        function ($q, $http, middlewareRoutes, DimensionsCollection, MetricsCollection, pubLocale, config) {

            var PUBLISHER = "publisher",
                BUYER = "buyer",
                DSP = "dsp";

            return {

                deferred: $q.defer(),

                /**
                 * Analytic data collection
                 */
                attributes: {},

                /**
                 * Copy all of the properties in the source object over to the destination object,
                 * and return the destination object.
                 * @params destination {object}
                 * @params source {object}
                 * @returns {object} destination object
                 */
                extend: function (destination, source) {
                    destination = destination || {};
                    source = source || {};
                    for (var property in source) {
                        destination[property] = source[property];
                    }
                    return destination;
                },

                /**
                 * Parse and modify response from Middleware
                 * @params response {object}
                 * @returns {object} destination object
                 */
                parse: function (response) {
                    var attr, historicDimensions, historicMetrics, realtimeDimensions, realtimeMetrics, benchmarkDimensions, benchmarkMetrics;

                    historicDimensions = this.extend({userType: response.userType}, DimensionsCollection);

                    historicMetrics = this.extend({userType: response.userType}, MetricsCollection);
                    realtimeDimensions = this.extend({userType: response.userType}, DimensionsCollection);
                    realtimeMetrics = this.extend({userType: response.userType}, MetricsCollection);
                    benchmarkDimensions = this.extend({userType: response.userType}, DimensionsCollection);
                    benchmarkMetrics = this.extend({userType: response.userType}, MetricsCollection);

                    attr = {};


                    attr.publisherList = response.publisherList;
                    attr.buyerList = response.buyerList;
                    attr.dspList = response.dspList;
                    attr.userType = response.userType;
                    attr.firstName = response.firstName;
                    attr.lastName = response.lastName;
                    attr.email = response.email;
                    attr.userAccessory = response.userAccessory;
                    attr.measureSelectionRules = response.dimensionDependencyMap;

                    attr.locale = response.locale || "en-us";
                    attr.locale = attr.locale.toLowerCase();

                    attr.timezone = response.timezone;

                    attr.historicDimensions = historicDimensions.reset(response.historicConfiguration.dimensions);
                    attr.historicMetrics = historicMetrics.reset(response.historicConfiguration.metrics);

                    attr.realtimeDimensions = realtimeDimensions.reset(response.realtimeConfiguration.dimensions);
                    attr.realtimeMetrics = realtimeMetrics.reset(response.realtimeConfiguration.metrics);

                    attr.isBenchmarkAvailable = !!response.benchmarkConfiguration;
                    response.benchmarkConfiguration = response.benchmarkConfiguration || {};
                    
                    attr.benchmarkDimensions = benchmarkDimensions.reset(response.benchmarkConfiguration.dimensions || []);
                    attr.benchmarkMetrics = benchmarkMetrics.reset(response.benchmarkConfiguration.metrics || []);

                    if (response.subTypes && response.subTypes.length !== 0){
                        attr.accountSubtype = response.subTypes[0];
                    }
                    else {
                        attr.accountSubtype = "default";
                    }


                    return attr;
                },

                /**
                 * Make GET request to analytic middleware resource.
                 * Set response to analytic data collection.
                 */
                fetch: function () {
                                       
                    var request, config;

                    config = {
                        method: "GET",
                        url: middlewareRoutes.analytic,
                        cache: false
                    };
                                       
                    request = $http(config);
                    request.success(this.fetchSuccess.bind(this));

                    this.deferred.resolve(request);

                    return this.deferred.promise;

                },

                fetchSuccess: function (response) {
                                       
                                       
                    this.attributes = this.parse(response);
                    this.setLocale(this.attributes.locale);

                    return response;
                },

                getPublisherList: function () {
                    return this.attributes.publisherList || [];
                },

                getBuyerList: function () {
                    return this.attributes.buyerList || [];
                },

                getDspList: function () {
                    return this.attributes.dspList || [];
                },

                getUserType: function () {
                    return this.attributes.userType || "";
                },

                getUserId: function () {
                    var userId;
                    if (this.getUserType() === PUBLISHER) {
                        userId = this.getPublisherList()[0];
                    }

                    if (this.getUserType() === BUYER) {
                        userId = this.getBuyerList()[0];
                    }

                    if (this.getUserType() === DSP) {
                        userId = this.getDspList()[0];
                    }
                    return userId;
                },

                getUserFirstName: function () {
                    return this.attributes.firstName || "";
                },

                getUserLastName: function () {
                    return this.attributes.lastName || "";
                },

                getUserEmail: function () {
                    return this.attributes.email || "";
                },

                getUserAccessory: function () {
                    return this.attributes.userAccessory || "";
                },

                getRealtimeDimensions: function () {
                    return this.attributes.realtimeDimensions || {};
                },

                getRealtimeMetrics: function () {
                    return this.attributes.realtimeMetrics || {};
                },

                getHistoricDimensions: function () {
                    return this.attributes.historicDimensions || {};
                },

                getHistoricMetrics: function () {
                    return this.attributes.historicMetrics || {};
                },

                getBenchmarkDimensions: function () {
                    return this.attributes.benchmarkDimensions;
                },

                getBenchmarkMetrics: function () {
                    return this.attributes.benchmarkMetrics;
                },

                getTimezone: function () {
                    return this.attributes.timezone || "PST";
                },

                getLocale: function () {
                    return this.attributes.locale || config.defaultLocale;
                },

                isBenchmarkAvailable: function () {
                    return this.attributes.isBenchmarkAvailable;
                },

                getAccountSubtype: function() {
                    return this.attributes.accountSubtype;
                },

                isAggregator: function() {
                    return (this.attributes.accountSubtype === "aggregator")? true:false;
                },


                setLocale: function (locale) {
                    locale = locale || "";
                    this.attributes.locale = locale.toLowerCase();

                    pubLocale.set(this.attributes.locale).then(
                        function success () {}.bind(this),
                        function error () {
                            this.setLocale(config.defaultLocale);
                        }.bind(this));
                },

                getMeasureSelectionRules: function() {
                    return this.attributes.measureSelectionRules;
                }
            };
        }
    ]);

}).call(this, angular);