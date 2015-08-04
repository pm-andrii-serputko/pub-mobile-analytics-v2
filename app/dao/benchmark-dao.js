(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.dao")
        .factory("benchmarkDao", ["$q", "$resource", "endpoints", benchmarkDao]);

    function benchmarkDao ($q, $resource, endpoints) {
        function BenchmarkDao () {}
        BenchmarkDao.extend({
            
            /**
             * Instance of defer
             */
            defer: $q.defer(),

            /**
             * Create GET request to middleware
             */
            fetch: function (options) {
                options = options || {};
                this.open();
                // TODO: remove it when Middleware is ready
                if (options.params.metrics === "potentialRevenue,revenue,revenueOpportunity,potentialEcpm,ecpm,ecpmOpportunity") {
                    return $q.when(advertiserOpportunityMock());
                }
                return this.getResource(options).query().$promise;
            },

            /**
             * Create new instance of defer.
             * @returns {object} defer
             */
            open: function () {
                this.defer = $q.defer();
                return this.defer;
            },

            /**
             * Close all requests with pending status.
             */
            close: function () {
                this.defer.resolve();
            },

            /**
             * Create a resource object that lets you interact with RESTful server-side data sources.
             * @params options {object}
             * @params options.params {object} Set of bound parameters for this action
             * @returns {object}
             */
            getResource: function (options) {
                return $resource(endpoints.benchmark + "/:userType/:userId", options.params, {
                    query: {
                        method: "GET",
                        isArray: false,
                        cache : true,
                        timeout: this.defer.promise
                    }
                });
            }
        });

        // TODO: remove it when Middleware is ready
        function advertiserOpportunityMock() {
            return {
                "columns": ["advertiserId", "potentialRevenue", "revenue", "revenueOpportunity", "potentialEcpm", "ecpm", "ecpmOpportunity"],
                "rows": [
                    ["47337", 11434, 401, 11033, 3.54, 2.70, 0.84],
                    ["24255", 10478, 387, 10091, 1.40, 1.20, 0.20],
                    ["2507", 9745, 744, 9001, 2.43, 2.22, 0.21],
                    ["7921", 9541, 1041, 8500, 1.98, 1.78, 0.20],
                    ["3349", 9388, 1388, 8005, 2.90, 1.74, 1.26]
                ],
                "displayValue": {
                    "advertiserId": {
                        "3686": "Citigroup Inc",
                        "115468": "Name is not available (115468)",
                        "2507": "Audi",
                        "7921": "Allstate Insurance Company",
                        "47337": "QuickBooks Intuit",
                        "24255": "Att",
                        "42473": "Kelloggs",
                        "3349": "Verizon",
                        "92474": "Name is not available (92474)",
                        "92523": "Name is not available (92523)"
                    }
                },
                "currency": "USD",
                "alert": null,
                "dataFreshness": {
                    "dataFreshnessHour": null,
                    "timeZone": null
                }
            };
        }
        
        return new BenchmarkDao();
        
    }

}).call(this, angular);