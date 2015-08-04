(function (angular) {
    "use strict";
    /*jshint validthis:true */

    angular
        .module("pub-ui-analytics.dao")
        .factory("historicDao", historicDao);

    /* @ngInject */
    historicDao.$inject = ["$q", "$http", "feedbackApiService", "historicCompareParser", "historicTableParser"];
    function historicDao ($q, $http, feedbackApiService, historicCompareParser, historicTableParser) {

        /** @constructor */
        function HistoricDao () {
            this.decorate("defaultValue");
        }
        /** Public methods */
        HistoricDao.prototype.fetch = fetch;
        HistoricDao.prototype.decorate = decorate;

        /** Decorators */
        HistoricDao.decorators = {
            defaultValue: {
                fetch: defaultValueFetch
            },
            compareAbsoluteValue: {
                fetch: absoluteValueFetch
            },
            compareAbsoluteChange: {
                fetch: absoluteChangeFetch
            },
            comparePercentage: {
                fetch: percentageFetch
            }
        };

        /** Implementation */
        /** Get historic data */
        function fetch (config, expr) {
            var defer = $q.defer();
            $http(config).then(function (response) {
                // Save the initial response to the feedback service
                feedbackApiService.setResponse(response.data);

                var data = angular.copy(response.data);
                data = historicTableParser(data);
                data = historicCompareParser(data, expr);
                
                defer.resolve(data);
            }).catch(function() {
                defer.reject();
            });

            return defer.promise;
        }

        function defaultValueFetch (config) {
            var expr = /\w*_a|\w*_c|\w*_p/;
            return this.super.fetch(config, expr);
        }

        function absoluteValueFetch (config) {
            var expr = /\w*_c|\w*_p/;
            return this.super.fetch(config, expr);
        }

        function absoluteChangeFetch (config) {
            var expr = /\w*_a|\w*_p/;
            return this.super.fetch(config, expr);
        }

        function percentageFetch (config) {
            var expr = /\w*_a|\w*_c/;
            return this.super.fetch(config, expr);
        }

        function decorate (decorator) {
            var F = function () {}, overrides = this.constructor.decorators[decorator], i, newobj;
            F.prototype = this;
            newobj = new F();
            newobj.super = F.prototype;
            for (i in overrides) {
                if (overrides.hasOwnProperty(i)) {
                    newobj[i] = overrides[i];
                }
            }
            return newobj;
        }

        return new HistoricDao();

    }

}).call(this, angular);