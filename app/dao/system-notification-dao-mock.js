(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.dao")
        .factory("systemNotificationsMock", systemNotificationsMock)
        .run(["$httpBackend", "endpoints", "systemNotificationsMock", systemNotificationMockE2E]);

    /**
     * Set up fake Backend.
     */
    function systemNotificationMockE2E ($httpBackend, endpoints, systemNotificationsMock) {
        $httpBackend.whenGET(endpoints.systemNotification).respond(systemNotificationsMock);
        
    }

    /** Mocked data of system notifications */
    function systemNotificationsMock () {
        return {
            "notifications": [
                {
                    "title": "Reporting Delay",
                    "message": "We are currently experiencing a data delay from October 27th, in which minimal number of reports will be effected. \nThere is no data loss and all reports will be updated in full within the next few hours. \nWe have identified the cause and actively working to correct this issue as highest priority. \nWe will update you regularly on the progress. \nShould you have any questions, please contact a member of your account team. \nWe apologize for the inconvenience.\nThe PubMatic Support Team"
                }
            ]
        };
    }

}).call(this, angular);