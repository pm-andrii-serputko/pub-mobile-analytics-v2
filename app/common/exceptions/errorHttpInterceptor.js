/*global angular*/
(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.common")
        .factory("errorHttpInterceptor", [
            "$q",
            "pubTokenException",

            function ($q, pubTokenException) {

                /**
                 * Map of Client Error Status Codes and Exceptions
                 */
                var exceptions = {
                    500: pubTokenException,
                    401: pubTokenException
                };

                return {

                    /**
                     * @description
                     * Interceptor gets called when a previous interceptor threw an error
                     * or resolved with a rejection.
                     */
                    responseError: function (rejection) {
                        /**
                         * Handle Client Error Status Codes
                         */
                        if (exceptions[rejection.status]) {
                            exceptions[rejection.status](rejection);
                        }

                        /**
                         * Handle Server Error Status Codes
                         */
                        if (rejection.status >= 405) {
                            //TODO: Handle Server Error Status Codes
                            console.log("Analytics UI is received a rejection status of " + rejection.status);
                        }

                        return $q.reject(rejection);
                    }
                };

            }
        ]);

}).call(this, angular);
