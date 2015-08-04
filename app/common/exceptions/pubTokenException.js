/*global angular*/
(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.common")
        .factory("pubTokenException", ["pmTokenStorageService", function (tokenStorageService) {

            return function (rejection) {
                // TODO: publish error event to subscribers
                console.log("Token error, status text: ", rejection.data.message);

                var url = tokenStorageService.getRefLoginOriginUrl();
                // Set all the session storage params
                tokenStorageService.setAuthType("");
                tokenStorageService.setAuthToken("");
                tokenStorageService.setRefLoginOriginApp("");
                tokenStorageService.setRefSignoutUrl("");
                window.location = url;
            };

        }]);

}).call(this, angular);
