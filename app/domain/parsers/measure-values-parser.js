(function (angular) {
    "use strict";
    /*jshint latedef:false */

    angular
        .module("pub-ui-analytics.domain")
        .factory("measureValuesParser", ["$filter", measureValuesParser]);

    function measureValuesParser ($filter) {
        return function (response) {
            response = response.map(function (obj) {
                return { id: obj.id, name: obj.value };
            });

            response = $filter("orderBy")(response, "name", false);

            return response;
        };
    }

}).call(this, angular);