(function (angular) {
    "use strict";
    /*jshint latedef:false */

    angular
        .module("pub-ui-analytics.domain")
        .factory("historicTableParser", historicTableParser);

    /* @ngInject */
    historicTableParser.$inject = ["MeasureModel", "MeasureValueModel", "pubAnalyticService", "timePeriodComparisonRules", "$filter"];
    function historicTableParser (MeasureModel, MeasureValueModel, pubAnalyticService, timePeriodComparisonRules, $filter) {
        
        return function (data) {
            var columns, secondaryColumns, rows;

            columns = data.columns.map(function (column) {
                var model = new MeasureModel();
                model.id = column;
                model = setNameAndType(model);
                return model;
            });

            secondaryColumns = data.columns.map(function (column) {
                var model = new MeasureModel();
                model.id = column;
                model = setNameAndType(model);
                if (model.type === "") {
                    model.name = $filter("translate")("SLICER.PAST_PERIOD");
                }
                if (model.isDimension || model.isMetric) {
                    model.name =  $filter("translate")("SLICER.CURRENT_PERIOD");
                }

                return model;
            });


            rows = data.rows.map(function (row) {
                return row.map(function (value, valueIndex) {
                    // Initialize mew model
                    var model = new MeasureValueModel();
                    // Set id 
                    model.id = value;
                    // Set measure id. Example: siteId, revenue, ...
                    model.measureId = data.columns[valueIndex];
                    // Set display value if it exists and type of measure (dimension/metric)
                    if (data.displayValue && data.displayValue[model.measureId]) {
                        model.value = data.displayValue[model.measureId][model.id] || value;
                        model.type = "dimension";
                    } else {
                        model.value = value;
                        model.type = "metric";
                    }

                    model.value = model.value === "Infinity" ? 100: model.value;

                    // Set compare state (higher/lower/equal)
                    if (model.type === "metric") {
                        var compareExpr = /_a$|_c$|_p$/gi;

                        var currentMetricId = model.measureId.replace(compareExpr, "");
                        var compareMetricId = currentMetricId + "_c";
                        var compareMetricIdIndex = data.columns.indexOf(compareMetricId);
                        var compareValue = row[compareMetricIdIndex];

                        var change = timePeriodComparisonRules.execute(currentMetricId, compareValue);
                        if (change === 0) {
                            model.compare = "equal";
                        }
                        if (change > 0) {
                            model.compare = "higher";
                        }
                        if (change < 0) {
                            model.compare = "lower";
                        }

                        model.isCompare = compareExpr.test(model.measureId);
                    }

                    return model.decorate("formatedValue", data.currency);
                });
            });


            data.columns = columns;
            data.secondaryColumns = secondaryColumns;
            data.rows = rows;

            return data;
        };

        function setNameAndType (model) {
            var dimensions = pubAnalyticService.getHistoricDimensions(),
                metrics = pubAnalyticService.getHistoricMetrics();

            // Set name and type
            if (dimensions.findDimensionById(model.id)) {
                var dimension = dimensions.findDimensionById(model.id);
                model.name = dimension.getName();
                model.type = "dimension";
            }
            if (metrics.findMetricById(model.id)) {
                var metric = metrics.findMetricById(model.id);
                model.name = metric.getName();
                model.type = "metric";
            }

            return model;
        }
    }

}).call(this, angular);