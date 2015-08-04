(function (angular) {
    "use strict";
    /*jshint latedef:false */

    angular
        .module("pub-ui-analytics.domain")
        .factory("benchmarkAdvertiserNameParser", benchmarkAdvertiserNameParserProvider);

    /**
     * @description
     * The parser hides advertisers where `Name is not available`
     * See: ADS-1820
     */
    function benchmarkAdvertiserNameParserProvider () {
        return function benchmarkAdvertiserNameParser(res) {
            var undefinedAdvertisers = [];
            if (res.displayValue.advertiserId) {
                angular.forEach(res.displayValue.advertiserId, function(name, id) {
                    var exp = /Name is not available|Unknown/gi;
                    var isUndefined = !name.match(exp);
                    if (isUndefined) {
                        undefinedAdvertisers.push(id);
                    }
                });

                res.rows = res.rows.filter(function(row) {
                    var advertiserId = row[0];
                    return undefinedAdvertisers.indexOf(advertiserId) !== -1;
                });
            }
            return res;
        };
    }

}).call(this, angular);