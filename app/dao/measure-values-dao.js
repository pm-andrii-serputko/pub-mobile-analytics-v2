(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.dao")
        .factory("measureValuesDao", ["$q", "$resource", "endpoints", measureValuesDao]);

    function measureValuesDao ($q, $resource, endpoints) {
        function MeasureValuesDao () {}
        MeasureValuesDao.extend({
            
            /**
             * Instance of defer
             */
            defer: $q.defer(),

            /**
             * Create GET request to middleware
             */
            fetch: function (options) {
                this.open();
                return this.getResource(options).query().$promise;
            },

            /**
             * Create batch of request.
             */
            batch: function (promises) {
                return $q.all(promises);
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
                return $resource(endpoints.measureValues, options.params, {
                    query: {
                        method: "GET",
                        isArray: true,
                        cache : true,
                        timeout: this.defer.promise
                    }
                });
            }
        });
        
        return new MeasureValuesDao();
        
    }

}).call(this, angular);