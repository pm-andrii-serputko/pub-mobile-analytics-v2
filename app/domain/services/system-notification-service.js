(function (angular) {
    "use strict";
    /*jshint validthis:true */

    angular
        .module("pub-ui-analytics.domain")
        .factory("systemNotificationService", systemNotificationService);

    systemNotificationService.$inject = ["systemNotificationDao"];
    function systemNotificationService(systemNotificationDao) {

        var service = {
            getSystemNotifications: function() {
                return systemNotificationDao.fetch();
            }
        };

        return service;
    }

}).call(this, angular);