(function(angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.domain")
        .factory("benchmarkAdvertiserByPublisherParser", ["MeasureModel", "BenchmarkMeasureValueModel", "dataFormattingService", "pubAnalyticService", benchmarkAdvertiserByPublisherParser]);


    /**
     * @description
     * Parser changes original response from Middleware (input) and
     * modifys the response (output) for presentation layer needs.
     * @example
     * Input and output data:
        var input = {
            columns: ["advertiserId", "pubId", "ecpm", "sow", "sov"],
            rows: [
                ["Nike", "Publisher 1", 2.00, 70, 80],
                ["Nike", "Publisher 2", 1.50, 65, 60],
                ["Puma", "Publisher 1", 1.80, 72, 88],
                ["Puma", "Publisher 2", 1.00, 55, 50]
            ]
        }

        var output = {
            columns: ["Publishers", "Nike", "Puma"],   // <MeasureModel>
            secondaryColumns: ["ecpm", "sow", "sov", "ecpm", "sow", "sov"] // <MeasureModel>
            rows: [
                ["Publisher 1", 2.00, 70, 80, 1.80, 72, 88], // <BenchmarkMeasureValueModel>
                ["Publisher 2", 1.50, 65, 60, 1.00, 55, 50]  // <BenchmarkMeasureValueModel>
            ]
        }
     */

    function benchmarkAdvertiserByPublisherParser(MeasureModel, BenchmarkMeasureValueModel, dataFormattingService, pubAnalyticService) {
        return function(data, advertisers, tableView) {
            var parser = tableView === "chart" ? chartParser : numberParser;
            return parser(data, advertisers);
        };

        function numberParser(data, advertisers) {
            advertisers = advertisers || [];

            var columns = [],
                secondaryColumns = [],
                rows = data.rows,
                metrics = getDefaultMetrics(),
                compExpr = /^avgComp(\w*)|^minComp(\w*)|^maxComp(\w*)|^medianComp(\w*)|(^\w*)/,
                numberColumnsExpr = /^avgComp\w*|^minComp\w*|^medianComp\w*|^maxComp\w*/,
                defaultMetricsRow;

            defaultMetricsRow = metrics.map(function(metric) {
                var model = new BenchmarkMeasureValueModel();
                model.measureId = metric.id;
                model.value = null;
                model.type = "metric";
                return model;
            });


            // Generate columns
            columns = advertisers.map(function(advertiser) {
                var model = new MeasureModel();
                model.id = advertiser.id;
                model.name = advertiser.name;
                model.type = "metric";
                return model;
            });

            // Generate secondary columns
            advertisers.map(function() {
                metrics.map(function(metric) {
                    var model = new MeasureModel();
                    model.id = metric.id;
                    model.name = metric.name;
                    model.type = "metric";
                    model.description = metric.description;

                    secondaryColumns.push(model);
                });
            });

            var model = new MeasureModel();
            model.id = "pubId";
            model.name = "Rank by Revenue";
            model.type = "dimension";

            columns.unshift(model);
            secondaryColumns.unshift(model);

            rows = rows.map(function(row) {
                return row.map(function(value, valueIndex) {
                    // Initialize mew model
                    var model = new BenchmarkMeasureValueModel();
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

                    if (model.isMetric) {
                        model.isDynamicColorMeasure = true;

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
                    }

                    model.bulletChartDataSet = {
                        percentage: (model.value / (model.medianCompValue * 2)) * 100 + "%",
                        min: chartNumberFormatConverter(model.measureId, model.minCompValue),
                        avg: chartNumberFormatConverter(model.measureId, model.avgCompValue),
                        max: chartNumberFormatConverter(model.measureId, model.maxCompValue),
                        median: chartNumberFormatConverter(model.measureId, model.medianCompValue),
                        advertisers : advertisers
                    };

                    return model;
                });
            });


            // Get all unique publishers
            var publishers = rows.map(allPubIds);
            publishers = unique(publishers);
            // Merge rows
            rows = rows.map(function(row) {
                return row.filter(function(measure, index) {
                    return !numberColumnsExpr.test(data.columns[index]);
                });
            });

            rows = publishers.map(function(publisher) {
                var result = [publisher];

                advertisers.map(function(advertiser) {
                    var row = rows.filter(byAdvertiserAndPublisher.bind(this, advertiser.id, publisher.id))[0];
                    if (row) {
                        result = result.concat(row.slice(2, row.length));
                    } else {
                        result = result.concat(defaultMetricsRow);
                    }
                });

                return result;
            });

            secondaryColumns.shift();

            data.columns = columns;
            data.secondaryColumns = secondaryColumns;
            data.rows = rows;

            return data;
        }

        function chartParser(data, advertisers) {
            advertisers = advertisers || [];
            var columns = [],
                secondaryColumns = [],
                rows = data.rows,
                compareRows = [],
                metrics = getDefaultMetrics(),
                compExpr = /^avgComp(\w*)|^minComp(\w*)|^maxComp(\w*)|^medianComp(\w*)|(^\w*)/,
                defaultMetricsRow;

            defaultMetricsRow = metrics.map(function() {
                return null;
            });

            // Generate columns
            columns = metrics.map(function(metric) {
                var model = new MeasureModel();
                model.id = metric.id;
                model.name = metric.name;
                model.type = "metric";
                model.description = metric.description;

                return model;
            });

            var model = new MeasureModel();
            model.id = "pubId";
            model.name = "Rank by Revenue";
            model.type = "dimension";

            columns.unshift(model);

            rows = rows.map(function(row) {
                return row.map(function(value, valueIndex) {
                    // Initialize mew model
                    var model = new BenchmarkMeasureValueModel();
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
                    }

                    model.bulletChartDataSet = {
                        percentage: (model.value / (model.medianCompValue * 2)) * 100 + "%",
                        min: chartNumberFormatConverter(model.measureId, model.minCompValue),
                        avg: chartNumberFormatConverter(model.measureId, model.avgCompValue),
                        max: chartNumberFormatConverter(model.measureId, model.maxCompValue),
                        median: chartNumberFormatConverter(model.measureId, model.medianCompValue),
                        advertisers : advertisers
                    };

                    return model;
                });
            });

            compareRows = rows.filter(function(row) {
                return advertisers[1] && row[0].id === advertisers[1].id;
            });

            compareRows = compareRows.map(removeUnusedCells);

            rows = rows.filter(function(row) {
                return advertisers[0] && row[0].id === advertisers[0].id;
            });

            rows = rows.map(removeUnusedCells);

            data.columns = columns;
            data.secondaryColumns = secondaryColumns;
            data.rows = rows;

            angular.forEach(data.rows,function(row,rowIndex) {
                angular.forEach(row,function(cell,columnIndex) {
                    cell.compareData = compareRows[rowIndex] ? compareRows[rowIndex][columnIndex]: null;
                    if (cell.compareData){
                        cell.compareData.bulletChartDataSet.percentage = (cell.compareData.value / (cell.medianCompValue * 2)) * 100 + "%";
                    }
                });
            });

            return data;
        }


        function chartNumberFormatConverter(measureId, value){
            if (value === null || value === undefined) {
                return "N/A";
            } else {
                return dataFormattingService.format(measureId, value);
            }
        }


        function avgCompReplacer(match, p1, p2, p3, p4, p5) {
            return "avgComp" + parenthesized(p1, p2, p3, p4, p5);
        }

        function minCompReplacer(match, p1, p2, p3, p4, p5) {
            return "minComp" + parenthesized(p1, p2, p3, p4, p5);
        }

        function maxCompReplacer(match, p1, p2, p3, p4, p5) {
            return "maxComp" + parenthesized(p1, p2, p3, p4, p5);
        }

        function medianCompReplacer(match, p1, p2, p3, p4, p5) {
            return "medianComp" + parenthesized(p1, p2, p3, p4, p5);
        }

        function parenthesized(p1, p2, p3, p4, p5) {
            var str = [p1, p2, p3, p4, p5].filter(function(el) {
                return el;
            }).join();
            str = str.charAt(0).toUpperCase() + str.slice(1);
            return str;
        }

        function removeUnusedCells(row) {
            var chartColumnsExpr = /^avgComp\w*|^medianComp\w*|^minComp\w*|^maxComp/;
            return row.filter(function(model, index) {
                return index !== 0 && !chartColumnsExpr.test(model.measureId);
            });
        }

        function allPubIds(row) {
            return row[1];
        }

        function unique(publishers) {
            var result = [];
            var obj = {};

            [].forEach.call(publishers, function(item) {
                if (!obj[item.id]) {
                    result.push(item);
                    obj[item.id] = item;
                }
            });
            return result;
        }

        function byAdvertiserAndPublisher(advertiserId, pubId, row) {
            return row[0].id === advertiserId && row[1].id === pubId;
        }

        function getDefaultMetrics() {
            var benchmarkCollection = pubAnalyticService.getBenchmarkMetrics();
            var metricIds = ["ecpm", "sow", "sov"];
            var metrics = metricIds.map(function(id) {
                var metric = benchmarkCollection.findMetricById(id);
                return {
                    id: metric.getId(),
                    name: metric.getName(),
                    description: metric.getMetricDescription()
                };
            });
            return metrics;
        }
    }

}).call(this, angular);
