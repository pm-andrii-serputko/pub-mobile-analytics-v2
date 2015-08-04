(function (angular) {
    "use strict";
    /*jshint latedef:false */

    angular
        .module("pub-ui-analytics.domain")
        .factory("benchmarkAdvertiserParser", ["MeasureModel", "BenchmarkMeasureValueModel", "pubAnalyticService", "dataFormattingService", parser])
        .factory("benchmarkCategoryParser",   ["MeasureModel", "BenchmarkMeasureValueModel", "pubAnalyticService", "dataFormattingService", parser]);


    /**
     * @description
     * Parser changes original response from Middleware (input) and
     * modifys the response (output) for presentation layer needs.
     * @example
     * Input and output data:
        var input = {
            columns: ["advertiserId", "ecpm", "avgCompEcpm", "sow", "avgCompSow", "sov", "avgCompSov"],
            rows: [
                ["Nike",   1.54, 3.00, 6.5, 6.4, 9.4, 9.1],
                ["Adidas", 2.96, 3.00, 5.1, 6.4, 7.4, 9.1]
            ]
        }

        var output = {
            columns: ["advertiserId", "ecpm", "sow", "sov"],   // <MeasureModel>
            secondaryColumns: ["ecpm", "avgCompEcpm", "sow", "avgCompSow", "sov", "avgCompSov"] // <MeasureModel>
            rows: [
                ["Nike",   1.54, 3.00, 6.5, 6.4, 9.4, 9.1], // <BenchmarkMeasureValueModel>
                ["Adidas", 2.96, 3.00, 5.1, 6.4, 7.4, 9.1]  // <BenchmarkMeasureValueModel>
            ]
        }
     */

    function parser (MeasureModel, BenchmarkMeasureValueModel, pubAnalyticService, dataFormattingService) {
        return function (data, selectedAdvertisers, tableView) {
            data = angular.copy(data);
            var columns = data.columns,
                secondaryColumns = data.columns,
                rows = data.rows,
                compExpr = /^avgComp(\w*)|^minComp(\w*)|^maxComp(\w*)|^medianComp(\w*)|(^\w*)/,
                numbersColumnsExpr = /^minComp\w*|^maxComp\w*/,
                chartColumnsExpr = /^avgComp\w*|^minComp\w*|^medianComp\w*|^maxComp\w*/,
                secondaryColumnsExpr = tableView === "chart" ? chartColumnsExpr : numbersColumnsExpr,
                columnsExpr = /^avgComp\w*|^minComp\w*|^medianComp\w*|^maxComp\w*/,
                dynamicColorMeasure = ["ecpm", "sow", "sov"];

            columns = columns.map(function (measureId) {
                var model = new MeasureModel();
                model.id = measureId;
                model = setNameAndType(model);
                return model;
            });

            rows = rows.map(function (row) {
                return row.map(function (value, valueIndex) {
                    // Initialize mew model
                    var model = new BenchmarkMeasureValueModel();
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
                        // set average competition value
                        var avgCompId = model.measureId.replace(compExpr, avgCompReplacer);
                        var avgCompIndex = data.columns.indexOf(avgCompId);
                        model.avgCompValue = row[avgCompIndex];

                        // set min competition value
                        var minCompId = model.measureId.replace(compExpr, minCompReplacer);
                        var minCompIndex = data.columns.indexOf(minCompId);
                        model.minCompValue = row[minCompIndex];

                        // set max competition value
                        var maxCompId = model.measureId.replace(compExpr, maxCompReplacer);
                        var maxCompIndex = data.columns.indexOf(maxCompId);
                        model.maxCompValue = row[maxCompIndex];

                        // set median competition value
                        var medianCompId = model.measureId.replace(compExpr, medianCompReplacer);
                        var medianCompIndex = data.columns.indexOf(medianCompId);
                        model.medianCompValue = row[medianCompIndex];

                        // set absolut min value
                        model.absolutMinValue = 0;

                        // set absolut max value
                        model.absolutMaxValue = model.maxCompValue > model.value ? model.maxCompValue : model.value;
                        model.absolutMaxValue = model.absolutMaxValue;


                        model.bulletChartDataSet = {
                            percentage: (model.value/ (model.medianCompValue * 2)) * 100 + "%",
                            min: chartNumberFormatConverter(model.measureId, model.minCompValue),
                            avg: chartNumberFormatConverter(model.measureId, model.avgCompValue),
                            max: chartNumberFormatConverter(model.measureId, model.maxCompValue),
                            median: chartNumberFormatConverter(model.measureId, model.medianCompValue)
                        };

                    }

                    return model;
                });
            });



            secondaryColumns = columns.reduce(function (result, measure) {
                if (measure.isMetric && !secondaryColumnsExpr.test(measure.id) && tableView !== "chart") {
                    result.push(measure);
                }
                return result;
            }, []);


            columns = columns.reduce(function (result, measure) {
                if (!columnsExpr.test(measure.id)) {
                    result.push(measure);
                }
                return result;
            }, []);

            rows = rows.map(function (row) {
                return row.reduce(function (result, measure) {
                    if (!secondaryColumnsExpr.test(measure.measureId)) {
                        result.push(measure);
                    }
                    return result;
                }, []);
            });

            data.columns = columns;
            data.secondaryColumns = secondaryColumns;
            data.rows = rows;
            return data;
        };



        function chartNumberFormatConverter(measureId, value){
            if (value === null || value === undefined) {
                return "N/A";
            } else {
                return dataFormattingService.format(measureId, value);
            }
        }


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

        function avgCompReplacer (match, p1, p2, p3, p4, p5) {
            return "avgComp" + parenthesized(p1, p2, p3, p4, p5);
        }

        function minCompReplacer (match, p1, p2, p3, p4, p5) {
            return "minComp" + parenthesized(p1, p2, p3, p4, p5);
        }

        function maxCompReplacer (match, p1, p2, p3, p4, p5) {
            return "maxComp" + parenthesized(p1, p2, p3, p4, p5);
        }

        function medianCompReplacer (match, p1, p2, p3, p4, p5) {
            return "medianComp" + parenthesized(p1, p2, p3, p4, p5);
        }

        function parenthesized (p1, p2, p3, p4, p5) {
            var str = [p1, p2, p3, p4, p5].filter(function (el) {  return el; }).join();
            str = str.charAt(0).toUpperCase() + str.slice(1);
            return str;
        }


    }

}).call(this, angular);