(function (angular) {
    "use strict";
    /*jshint latedef:false */

    angular
        .module("pub-ui-analytics.domain")
        .factory("benchmarkParsers", [
            "benchmarkMeasureValuesParser",
            "benchmarkAdvertiserOpportunityParser",
            "benchmarkAdvertiserParser",
            "benchmarkAdvertiserByPublisherParser",
            "benchmarkCategoryParser",
            "benchmarkMetricsFilter",
            "benchmarkAdvertiserNameParser",
            benchmarkParserFacade
        ]);

    function benchmarkParserFacade (measureValuesParser, advertiserOpportunityParser, advertiserParser, advertiserByPublisherParser, categoryParser, metricsFilter, advertiserNameParser) {
        var parsers = {
            measureValues: measureValuesParser,
            advertiserOpportunity: advertiserOpportunityParser,
            advertiser: advertiserParser,
            advertiserByPublisher: advertiserByPublisherParser,
            category: categoryParser,
            metricsFilter: metricsFilter,
            advertiserNameParser: advertiserNameParser
        };
        return parsers;
    }

}).call(this, angular);