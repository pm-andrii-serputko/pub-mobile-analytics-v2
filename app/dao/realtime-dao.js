(function (angular) {
    "use strict";
    /*jshint newcap:false*/

    angular
        .module("pub-ui-analytics.dao")
        .factory("RealtimeDaoFactory", ["$q", "$resource", "endpoints", "poller", RealtimeDaoFactory]);

    function RealtimeDaoFactory ($q, $resource, endpoints, poller) {
        
        function RealtimeDao () {}
        return RealtimeDao.extend({

            /**
             * Instance of defer
             */
            defer: $q.defer(),

            deferInstances: [],

            /**
             * Empty collection of poller instances
             */
            pollerInstances: [],

            /**
             * Create GET request to middleware
             * and repeat it each 5/10 sec
             */
            fetch: function (options) {
                this.open();
                var pollerInstance = poller.get(this.getResource(options), {delay: options.delay, smart: true});
                this.pollerInstances.push(pollerInstance);
                this.deferInstances.push(this.defer);
                return pollerInstance.promise;
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
             * Close all requests with pending status and stop polling.
             */
            close: function () {
                this.deferInstances.map(function (defer) { defer.resolve(); });
                this.pollerInstances.map(function (pollerInstanse) { pollerInstanse.stop(); });
                this.pollerInstances = [];
                this.deferInstances = [];
            },

            /**
             * Create a resource object that lets you interact with RESTful server-side data sources.
             * @params options {object}
             * @params options.params {object} Set of bound parameters for this action
             * @returns {object}
             */
            getResource: function (options) {
                return $resource(endpoints.realtime + "/:userType/:userId", options.params, {
                    get: {
                        method: "GET",
                        isArray: false,
                        cache : false,
                        timeout: this.defer.promise
                    }
                });
            }

        }, {
            /**
             * @constructor
             * @static
             */
            DaySummaryDao: function DaySummaryDao () {
                this.defer = $q.defer();
                this.pollerInstances = [];
                this.deferInstances = [];
            },
            /**
             * @constructor
             * @static
             */
            TimeSeriesDao: function DaySummaryDao () {
                this.defer = $q.defer();
                this.pollerInstances = [];
                this.deferInstances = [];
            },
            /**
             * @constructor
             * @static
             */
            TopQueriesDao: function DaySummaryDao () {
                this.defer = $q.defer();
                this.pollerInstances = [];
                this.deferInstances = [];
            },
            /**
             * Factory method.
             * @params constructor {string}
             * @returns {object} new instance
             * @static
             */
            create: function (constructor) {
                if (typeof RealtimeDao[constructor] !== "function") {
                    // TODO: Create exception class
                    throw { name: "Error", message: constructor + " doesn't exist" };
                }
                RealtimeDao[constructor].prototype = new RealtimeDao();
                return new RealtimeDao[constructor]();
            }

        });
    }

}).call(this, angular);