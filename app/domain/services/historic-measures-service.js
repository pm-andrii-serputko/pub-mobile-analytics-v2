(function (angular) {
    "use strict";
    /*jshint validthis:true */

    angular
        .module("pub-ui-analytics.domain")
        .factory("historicMeasuresService", ["pubAnalyticService", "config", historicMeasuresService]);


    function historicMeasuresService (pubAnalyticService, config) {
        /**
         * Interface of historicMeasuresService.
         */
        var service = {
            /** Get collection of dimensions */
            getDimensions: getDimensions,
            /** Select dimension */
            selectDimension: selectDimension,
            /** Unselect dimension */
            unselectDimension: unselectDimension,
            /** Unselect all dimensions */
            unselectAllDimensions: unselectAllDimensions,
            /** Get collection of metrics */
            getMetrics: getMetrics,
            /** Select metric */
            selectMetric: selectMetric,
            /** Unselect metric */
            unselectMetric: unselectMetric,
            /** Unselect all metrics */
            unselectAllMetrics: unselectAllMetrics,
            /** Applie allowed rules*/
            executeAllowedRules: executeAllowedRules,
            /** Applie disallowed rules*/
            executeDisallowedRules: executeDisallowedRules,
            /** Change order in each model */
            orderMeasure: orderMeasure
        };

        return service;


        function getDimensions() {
            return pubAnalyticService.getHistoricDimensions();
        }

        /**
         * @description
         * Select dimension and sort it.
         * Max number of selected dimensions - 10
         * Max number of visible dimensions - 5
         * Max number of invisible dimensions - 5
         * @param {object} dimension<DimensionModel>
         */
        function selectDimension(dimension) {
            if (dimension) {
                /** User can not select dimension if the dimension is disabled */
                if (dimension.getDisabled()) {
                    return;
                }

                var dimensions = getDimensions();
                var metrics = getMetrics();
                var selectedDimensions = dimensions.getSelectedDimensions();
                var visibleDimensions = dimensions.getVisibleDimensions();

                metrics.isAG = selectedDimensions
                                    .concat(dimension)
                                    .some(function(dimension) { return dimension.getGroupId() === "ag"; });

                if (selectedDimensions.length === 0) {
                    unselectAllMetrics({unselectAll: true});
                }

                if (selectedDimensions.length === 1 && selectedDimensions[0].getId() === "date") {
                    unselectAllMetrics({unselectAll: true});
                }

                /** Set dimension selected */
                if (selectedDimensions.length < config.maxSelectedDimensions) {
                    dimension.setSelected(true);
                    if (dimensions.order.indexOf(dimension.getId()) === -1) {
                        dimensions.order.push(dimension.getId());
                    }
                }

                /** Set dimension visible */
                if (selectedDimensions.length < config.maxSelectedDimensions && visibleDimensions.length < config.maxVisibleDimensions) {
                    dimension.setVisible(true);
                }

                executeAllowedRules.call(dimensions, dimension);
                executeDisallowedRules.call(dimensions, dimension);
                orderMeasure.call(dimensions);
            }
        }

        /**
         * @description
         * Unselect selected dimension.
         * @param {object} dimension<DimensionModel>
         */
        function unselectDimension(dimension) {
            if (dimension) {
                var dimensions = getDimensions();
                var metrics = getMetrics();

                dimension.setSelected(false);
                dimension.setVisible(false);
                dimension.setFilter({});

                dimensions.order = dimensions.order.filter(function (id) {
                    return dimension.getId() !== id;
                });

                executeAllowedRules.call(dimensions, dimension);
                executeDisallowedRules.call(dimensions, dimension);
                orderMeasure.call(dimensions);


                var selectedDimensions = dimensions.getSelectedDimensions();

                if (selectedDimensions.length === 0) {
                    metrics.isAG = false;
                    unselectAllMetrics({unselectAll: true});
                }

                if (selectedDimensions.length === 1 && selectedDimensions[0].getId() === "date") {
                    metrics.isAG = false;
                    unselectAllMetrics({unselectAll: true});
                }

                
            }
        }

        /**
         * @description
         * Unselect all selected dimension.
         */
        function unselectAllDimensions() {
            getDimensions().getSelectedDimensions().forEach(unselectDimension);
        }

        function getMetrics() {
            return pubAnalyticService.getHistoricMetrics();
        }

        /**
         * @description
         * Select metric and sort it.
         * Max number of selected metrics - 10
         * @param {object} metric<MetricModel>
         */
        function selectMetric(metric) {
            if (metric) {
                /** User can not select metric if the metric is disabled */
                if (metric.getDisabled()) {
                    return;
                }
                var metrics = getMetrics();
                var selectedMetrics = metrics.getSelectedMetrics();

                if (selectedMetrics.length < config.maxSelectedMetrics) {
                    metric.setSelected(true);
                    metrics.order.push(metric.getId());
                }

                executeAllowedRules.call(metrics, metric);
                executeDisallowedRules.call(metrics, metric);
                orderMeasure.call(metrics);
            }
        }

        /**
         * @description
         * Unselect selected metric.
         * @param {object} dimension<MetricModel>
         * @param {undefined|boolean} unselectAll
         */
        function unselectMetric(metric, options) {
            options = options || {};
            var metrics = getMetrics();
            // User can't unselect metric if it's last selected metric
            if (metrics.getSelectedMetrics().length === 1 && !options.unselectAll) {
                return;
            }

            if (metric) {
                metric.setSelected(false);
                
                metrics.order = metrics.order.filter(function (id) {
                    return metric.getId() !== id;
                });

                executeAllowedRules.call(metrics, metric);
                executeDisallowedRules.call(metrics, metric);
                orderMeasure.call(metrics);
            }
        }

        /**
         * @description
         * Unselect all selected metrics.
         */
        function unselectAllMetrics(options) {
            options = options || {};
            var metrics = getMetrics();
            var selectedMetrics = metrics.getSelectedMetrics();

            selectedMetrics.forEach(function(model) {
                unselectMetric(model, options);
            });

            metrics.getDefaultMetricList().forEach(function(model) {
                selectMetric(model);
            });
        }

        function executeAllowedRules(measure) {
            var allowedRules = pubAnalyticService.getMeasureSelectionRules()[measure.getId()] || []; // ?????

            /** Execute rules if they exist */
            if (allowedRules.length) {
                /** If model is selected disable measure */
                /** if model is unselected enable measure */
                if (measure.getSelected()) {
                    this.models.map(function (model) {
                        var included = allowedRules.indexOf(model.getId()) !== -1;
                        if (!included) {
                            disableSelectedMeasure.call(measure, model);
                        }
                    }.bind(this));
                } else {
                    this.models.map(disableUnselectedMeasure.bind(measure));
                }
            }
        }

        function executeDisallowedRules(measure) {
            var disallowedRules = getDisallowedRules(measure.getId());

            /** Execute rules if they exist */
            if (disallowedRules.length) {
                if (measure.getSelected()) {
                    disallowedRules.map(function (id) {
                        var model = this.models.filter(function (model) { return model.getId() === id; })[0];
                        if (!model) { return false; }
                        disableSelectedMeasure.call(measure, model);
                    }.bind(this));
                } else {
                    disallowedRules.map(function (id) {
                        var model = this.models.filter(function (model) { return model.getId() === id; })[0];
                        if (!model) { return false; }
                        disableUnselectedMeasure.call(measure, model);
                    }.bind(this));
                }
            }
        }

        function getDisallowedRules(id) {
            var disallowedRules = [];
            for (var key in pubAnalyticService.getMeasureSelectionRules()) {
                if (pubAnalyticService.getMeasureSelectionRules()[key].indexOf(id) === -1) {
                    disallowedRules.push(key);
                }
            }
            return disallowedRules;
        }

        function disableSelectedMeasure(model) {
            var disabledBy = [].concat(model.getDisabledBy());
            disabledBy.push(this.getId());
            model.setDisabledBy(disabledBy);
            model.setDisabled(disabledBy.length > 0);
        }

        function disableUnselectedMeasure(model) {
            var disabledBy = model.getDisabledBy();
            disabledBy = disabledBy.filter(function (id) { return this.getId() !== id; }.bind(this));
            model.setDisabledBy(disabledBy);
            model.setDisabled(disabledBy.length > 0);
        }

        /**
         * @description
         * Change order in each model
         */
        function orderMeasure() {
            this.models.forEach(function (model) {
                var id = model.getId();
                var order = this.order.indexOf(id);
                model.setOrder(order);
            }.bind(this));
        }
    }

}).call(this, angular);