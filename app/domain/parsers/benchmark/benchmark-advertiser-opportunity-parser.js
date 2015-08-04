(function (angular) {
    "use strict";
    /*jshint latedef:false */

    angular
        .module("pub-ui-analytics.domain")
        .factory("benchmarkAdvertiserOpportunityParser", ["MeasureModel", "BenchmarkOpportunityMeasureValueModel", "pubAnalyticService", parser]);

    function parser (MeasureModel, BenchmarkOpportunityMeasureValueModel, pubAnalyticService) {
        return function (data, selectedAdvertisers, tableView) {
            data = angular.copy(data);
            var columns = data.columns,
                secondaryColumns = data.columns,
                rows = data.rows,
                compExpr = /^potential(\w*)|(\w*)Opportunity|(^\w*)/,
                numbersColumnsExpr = /\d/,
                chartColumnsExpr = /potential\w*|\w*Opportunity/,
                secondaryColumnsExpr = tableView === "chart" ? chartColumnsExpr : numbersColumnsExpr,
                columnsExpr = /potential\w*|\w*Opportunity/,
                dynamicColorMeasure = [];

            columns = columns.map(function (measureId) {
                var model = new MeasureModel();
                model.id = measureId;
                model = setNameAndType(model);
                return model;
            });

            rows = rows.map(function (row) {
                return row.map(function (value, valueIndex) {
                    // Initialize mew model
                    var model = new BenchmarkOpportunityMeasureValueModel();
                    // Set id
                    model.id = value;
                    // Set measure id. Example: siteId, revenue, ...
                    model.measureId = data.columns[valueIndex];
                    // Set flag of dynamic text color for the number table
                    model.isDynamicColorMeasure = (dynamicColorMeasure.indexOf(model.measureId) > -1);


                    // Set display value if it exists and type of measure (dimension/metric)
                    if (data.displayValue && data.displayValue[model.measureId]) {
                        model.value = data.displayValue[model.measureId][model.id] || value;
                        model.type = "dimension";
                    } else {
                        model.value = value;
                        model.type = "metric";
                    }

                    if (model.isMetric) {
                        model.measureValue = pubAnalyticService.getBenchmarkMetrics().findMetricById(model.measureId).getName();
                        // set potential value
                        var potentialId = model.measureId.replace(compExpr, potentialReplacer);
                        var potentialIndex = data.columns.indexOf(potentialId);
                        model.potential = row[potentialIndex];

                        // set potential value
                        var opportunityId = model.measureId.replace(compExpr, opportunityReplacer);
                        var opportunityIndex = data.columns.indexOf(opportunityId);
                        model.opportunity = row[opportunityIndex];
                    }

                    return model;
                });
            });

            secondaryColumns = columns.reduce(function (result, measure) {
                if (measure.isMetric && tableView !== "chart") {
                    result.push(measure);
                }
                return result;
            }, []);

            columns = columns.reduce(function (result, measure) {
                if (measure.isDimension || !columnsExpr.test(measure.id)) {
                    result.push(measure);
                }
                return result;
            }, []);

            rows = rows.map(function (row) {
                return row.reduce(function (result, measure) {
                    if (measure.isDimension || !secondaryColumnsExpr.test(measure.measureId)) {
                        result.push(measure);
                    }
                    return result;
                }, []);
            });

            data.columns = columns;
            data.secondaryColumns = secondaryColumns;
            data.rows = rows;
            console.log(data);

            return data;
        };

        function setNameAndType (model) {
            var dimensions = pubAnalyticService.getBenchmarkDimensions(),
                metrics = pubAnalyticService.getBenchmarkMetrics();

            // Set name and type
            if (dimensions.findDimensionById(model.id)) {
                var dimension = dimensions.findDimensionById(model.id);
                model.name = dimension.getName();
                model.type = "dimension";
                model.description = dimension.getDimensionDescription();
            }
            if (metrics.findMetricById(model.id)) {
                var metric = metrics.findMetricById(model.id);
                model.name = metric.getName();
                model.type = "metric";
                model.description = metric.getMetricDescription();
            }

            return model;
        }

        function potentialReplacer (match, p1, p2, p3) {
            return "potential" + parenthesized(p1, p2, p3);
        }

        function opportunityReplacer (match, p1, p2, p3) {
            return parenthesized(p1, p2, p3).toLowerCase() + "Opportunity";
        }

        function parenthesized (p1, p2, p3) {
            var str = [p1, p2, p3].filter(function (el) {  return el; }).join();
            str = str.charAt(0).toUpperCase() + str.slice(1);
            return str;
        }
    }

}).call(this, angular);