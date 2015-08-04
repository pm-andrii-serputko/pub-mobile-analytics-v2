(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.domain")
        .factory("historicCompareParser", historicCompareParser);

    /* @ngInject */
    historicCompareParser.$inject = [];
    function historicCompareParser () {
        return function (data, expr) {
            var columns = data.columns,
                secondaryColumns = data.secondaryColumns,
                rows = data.rows,
                columnsExpr = /\w*_a|\w*_c|\w*_p/,
                selectedSecondaryColumns,
                selectedColumns;


            selectedColumns = columns.reduce(function (result, model, index) {
                if (!columnsExpr.test(model.id)) {
                    result.push(index);
                }
                return result;
            }, []);

            data.columns = columns.filter(function (column, index) {
                return selectedColumns.indexOf(index) !== -1;
            });

            selectedSecondaryColumns = columns.reduce(function (result, model, index) {
                if (!expr.test(model.id)) {
                    result.push(index);
                }
                return result;
            }, []);

            data.secondaryColumns = secondaryColumns.filter(function (column, index) {
                return selectedSecondaryColumns.indexOf(index) !== -1;
            });

            data.rows = rows.map(function (row) {
                return row.filter(function (item, index) {
                    return selectedSecondaryColumns.indexOf(index) !== -1;
                });
            });

            return data;
        };
    }

}).call(this, angular);