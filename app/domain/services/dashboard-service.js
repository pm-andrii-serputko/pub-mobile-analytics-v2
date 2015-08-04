/*global angular*/
(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.domain")
        .factory("dashboardService", [
            "dao",
            "pubAnalyticService",
            "measureValuesParser",
            "daySummaryParser",
            "timeSeriesParser",
            "topQueriesParser",
            dashboardService
        ]);

    function dashboardService (dao, pubAnalyticService, measureValuesParser, daySummaryParser, timeSeriesParser, topQueriesParser) {

        var realtimeDimensions = pubAnalyticService.getRealtimeDimensions();

        /** Interface */
        var service = {
            startPollingDaySummary: startPollingDaySummary,
            startPollingTimeSeries: startPollingTimeSeries,
            startPollingTopQueries: startPollingTopQueries,
            getAllSites: getAllSites,
            stopPollingTopQueries: stopPollingTopQueries,
            stopPolling: stopPolling,
            parseDaySummary: daySummaryParser,
            parseTimeSeries: timeSeriesParser,
            parseTopQueries: topQueriesParser
        };

        /** Implementation */
        function startPollingDaySummary () {
            var options = getDaySummaryOptions();
            return dao.daySummary.fetch(options);
        }

        function startPollingTimeSeries (metricId) {
            var options = getTimeSeriesOptions(metricId);
            return dao.timeSeries.fetch(options);
        }

        function startPollingTopQueries (metricId, dimensionId, siteId) {
            var options = getTopQueriesOptions(metricId, dimensionId, siteId);
            return dao.topQueries.fetch(options);
        }

        function getAllSites () {
            var options = getAllSitesOptions();
            dao.measureValues.fetch(options).then(function (response) {
                response = measureValuesParser(response);
                dao.measureValues.defer.resolve(response);
            });
            return dao.measureValues.defer.promise;
        }

        function stopPolling () {
            stopPollingDaySummary();
            stopPollingTimeSeries();
            stopPollingTopQueries();
        }

        function stopPollingDaySummary () {
            dao.daySummary.close();
        }

        function stopPollingTimeSeries () {
            dao.timeSeries.close();
        }

        function stopPollingTopQueries () {
            dao.topQueries.close();
        }

        function getDaySummaryOptions () {
            var options = {}, params = {};
            params.metrics = pubAnalyticService.getRealtimeMetrics().getDefaultIdList().join();
            params.dimensions = ["timeUnit", realtimeDimensions.getIdByUserType(), "timestamp"].join();
            params.filters = "timeUnit eq DAYS";
            params.sort = "";
            params.pageNumber = 1;
            params.pageSize = 1;
            params.userType = pubAnalyticService.getUserType();
            params.userId = pubAnalyticService.getUserId();

            options.params = params;
            options.delay = 5000;

            return options;
        }

        function getTimeSeriesOptions (metricId) {
            var options = {}, params = {};
            params.metrics = metricId;
            params.dimensions = ["timeUnit", realtimeDimensions.getIdByUserType(), "timestamp"].join();
            params.filters = "timeUnit eq MINUTES";
            params.sort = "-timestamp";
            params.pageNumber = 1;
            params.pageSize = 20;
            params.userType = pubAnalyticService.getUserType();
            params.userId = pubAnalyticService.getUserId();

            options.params = params;
            options.delay = 5000;

            return options;
        }

        function getTopQueriesOptions (metricId, dimensionId, siteId) {
            var options = {}, params = {};
            params.metrics = metricId;
            params.dimensions = pubAnalyticService.getRealtimeDimensions();
            if (pubAnalyticService.getUserType() === "publisher" && siteId !== "allSites") {
                params.dimensions = ["timeUnit", realtimeDimensions.getIdByUserType(), "siteId", dimensionId].join();
            } else {
                params.dimensions = ["timeUnit", realtimeDimensions.getIdByUserType(), dimensionId].join();
            }
            params.filters = ["timeUnit eq DAYS"];
            if (siteId && siteId !== "allSites") {
                params.filters.push("siteId eq " + siteId);
            }
            params.filters = params.filters.join("&filters=");
            params.sort = "-" + metricId;
            params.pageNumber = 1;
            params.pageSize = 10;
            params.userType = pubAnalyticService.getUserType();
            params.userId = pubAnalyticService.getUserId();

            options.params = params;
            options.delay = 10000;

            return options;
        }

        function getAllSitesOptions () {
            var options = {}, params = {dimensions: "siteId"};
            options.params = params;
            return options;
        }

        return service;
    }

}).call(this, angular);