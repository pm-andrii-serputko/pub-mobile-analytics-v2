(function(angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.domain")
        .factory("SystemNotification", SystemNotificationProvider);

    SystemNotificationProvider.$inject = [];
    function SystemNotificationProvider() {

        function SystemNotification() {
            this.title = "";
            this.message = "";
        }

        /**
         * SystemNotification factory.
         * Create new instanse of system notification.
         * @param {object} obj
         * @param {string} obj.title
         * @param {string} obj.message
         * @returns {object} systemNotification
         */
        SystemNotification.create = function(obj) {
            var systemNotification = new SystemNotification();
            systemNotification.title = obj.title;
            systemNotification.message = obj.message;
            return systemNotification;
        };

        return SystemNotification;
    }

}).call(this, angular);