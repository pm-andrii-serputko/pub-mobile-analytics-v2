(function(angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.dao")
        .factory("systemNotificationDao", systemNotificationDaoProvider);

    systemNotificationDaoProvider.$inject = ["$resource", "endpoints", "SystemNotification"];
    function systemNotificationDaoProvider($resource, endpoints, SystemNotification) {

        var notificationCollection = [];

        var dao = {
            fetch: fetch
        };

        return dao;

        function fetch() {
            return resource()
                .query()
                .$promise
                .then(function(res) {
                    var notifications = res.notifications || [];
                    notificationCollection = notifications.map(SystemNotification.create);
                    return notificationCollection;
                });
        }

        function resource() {
            return $resource(endpoints.systemNotification, null, {
                    query: {
                        method: "GET",
                        isArray: false
                    }
                });
        }
    }

}).call(this, angular);