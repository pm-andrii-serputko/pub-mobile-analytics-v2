/*global angular*/
(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.domain")
        .factory("DimensionValuesProxy", [function () {

            var DimensionValuesProxy = function () {};

            DimensionValuesProxy.prototype.cache = {};

            DimensionValuesProxy.prototype.add = function (data) {
                for (var dimensionId in data) {
                    var cached = this.cache[dimensionId] || {};
                    var newData = data[dimensionId];
                    this.cache[dimensionId] = extend(cached, newData);
                }
            };

            DimensionValuesProxy.prototype.find = function (dimensionId) {
                return this.cache[dimensionId];
            };

            function extend (destination, source) {
                destination = destination || {};
                source = source || {};
                for (var property in source) {
                    destination[property] = source[property];
                }
                return destination;
            }

            return DimensionValuesProxy;

        }]);


    // TODO: this service is depricated
    angular
        .module("pub-ui-analytics.dao")
        .factory("dimensionValuesService", [
        
        "$q",
        "$http",
        "middlewareRoutes",
        "DimensionValuesProxy",
        "measureValuesParser",

        function ($q, $http, middlewareRoutes, DimensionValuesProxy, measureValuesParser) {

            var dimensionValuesProxy = new DimensionValuesProxy();

            return {

                fetch: function (params) {
                    var deferred = $q.defer();
                    var config = {
                        method: "GET",
                        url: middlewareRoutes.filterDimensionValues,
                        cache: true,
                        params: params
                    };

                    var request = $http(config);
                    request.success(function (response) {
                        /** Parse data */
                        response = measureValuesParser(response);
                        /** Resolve response */
                        deferred.resolve(response);
                    }.bind(this));

                    return deferred.promise;
                },

                getAllDimensionValues: function () {
                    var deferred = $q.defer();
                    var config = {
                        method: "POST",
                        url: middlewareRoutes.filterDimensionValuesLookup,
                        cache: false,
                        data: dimensionValuesProxy.cache
                    };

                    var request = $http(config);
                    request.success(function (response) {
                        this.add(response);
                        /** Resolve response */
                        deferred.resolve(response);
                    }.bind(this));

                    return deferred.promise;
                },

                add: function (data) {
                    dimensionValuesProxy.add(data);
                },

                find: function (dimensionId) {
                    return dimensionValuesProxy.find(dimensionId);
                }
            };

        }
    ]);

}).call(this, angular);