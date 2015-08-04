"use strict";
angular.module("pubUniversalAnalyticService", [])
    .factory("pubUniversalAnalyticService", [
        "$q",
        "$http",

        function($q, $http) {

            return {

                deferred: $q.defer(),

                /**
                 * Analytic data collection
                 */
                attributes: {},

                /**
                 * Parse and modify response from Middleware
                 * @params response {object}
                 * @returns {object} destination object
                 */
                parse: function(response) {
                    var attr = {};
                    attr.isBenchmarkAvailable = (response.benchmarkConfiguration) ? !angular.equals({}, response.benchmarkConfiguration) : false;
                    attr.resourceName = response.resourceName;
                    attr.email = response.email;
                    attr.userType = response.userType;
                    attr.firstName = response.firstName;
                    attr.lastName = response.lastName;
                    if (response.subTypes && response.subTypes.length !== 0) {
                        attr.accountSubtype = response.subTypes[0];
                    } else {
                        attr.accountSubtype = "default";
                    }

                    return attr;
                },

                /**
                 * Make GET request to analytic middleware resource.
                 * Set response to analytic data collection.
                 */
                fetch: function() {
                    var request, config;

                    config = {
                        method: "GET",
                        url: "http://staging.analytics-api.matrix.pubmatic.com/v1/analytics/user",
                        cache: false
                    };


                    request = $http(config);
                    request.success(this.fetchSuccess.bind(this));

                    this.deferred.resolve(request);

                    return this.deferred.promise;

                },

                fetchSuccess: function(response) {

                    this.attributes = this.parse(response);
                    return response;
                },

                getResourceName: function() {
                    return this.attributes.resourceName || "";
                },

                getUserEmail: function() {
                    return this.attributes.email || "";
                },

                getUserFirstName: function() {
                    return this.attributes.firstName || "";
                },

                getUserLastName: function() {
                    return this.attributes.lastName || "";
                },

                getUserType: function() {
                    return this.attributes.userType || "";
                },

                isBenchmarkAvailable: function() {
                    return this.attributes.isBenchmarkAvailable;
                },

                getAccountSubtype: function() {
                    return this.attributes.accountSubtype;
                },

                isAggregator: function() {
                    return (this.attributes.accountSubtype === "aggregator") ? true : false;
                }
            };
        }
    ]);
