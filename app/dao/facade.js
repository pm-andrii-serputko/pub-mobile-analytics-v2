(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.dao")
        .factory("dao", ["RealtimeDaoFactory", "measureValuesDao", "benchmarkDao", daoFacade]);

    function daoFacade (RealtimeDaoFactory, measureValuesDao, benchmarkDao) {
        var dao = {
            daySummary: RealtimeDaoFactory.create("DaySummaryDao"),
            timeSeries: RealtimeDaoFactory.create("TimeSeriesDao"),
            topQueries: RealtimeDaoFactory.create("TopQueriesDao"),
            measureValues: measureValuesDao,
            benchmark: benchmarkDao,

            closeAllConnections: closeAllConnections
        };

        function closeAllConnections () {
            dao.daySummary.close();
            dao.timeSeries.close();
            dao.topQueries.close();
            dao.benchmark.close();
        }

        return dao;
    }

}).call(this, angular);