/*global angular*/
(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.domain")
        .factory("pubURLService", ["$rootScope", function ($rootScope) {

        return {
            /**
             * Convert URL hash to NLP search query
             * @params url {string}
             * @returns {string} Converted NLP search query
             */
            urlToNlp: function (url) {
                var nlp;
                nlp = url.replace("#/", "").replace("/", " ");
                return nlp;
            },

            /**
             * Publish 'pubURLService.navigate' event to change URL
             * @params route {string}
              @params replace {string}
             */
            navigate: function (route, replace) {
                window.scrollTo(0,0);
                replace = replace || false;
                $rootScope.$broadcast("navigate", route, replace);
            },

            back: function () {
                window.history.back();
            },

            parse: function (url) {
                url = url.match(/^#?\/?(.*)/).pop();
                return url;
            }
        };
    }]);

}).call(this, angular);
