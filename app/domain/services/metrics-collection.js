/*global angular*/
(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.domain")
        .factory("MetricsCollection", ["MetricModel", function (MetricModel) {

        var defaultMetricLists = {
            publisher: ["revenue", "paidImpressions", "ecpm"],
            buyer: ["spend", "paidImpressions", "ecpm"],
            dsp: ["spend", "paidImpressions", "ecpm"]
        };

        var defaultAgMetricLists = {
            publisher: ["bookedImpressions", "sales"],
            buyer: ["bookedImpressions", "sales"],
            dsp: ["bookedImpressions", "sales"]
        };

        return {

            order: [],
            
            models: [],

            isAG: false,

            /**
             * Adding and removing models
             * @param {array} metrics
             * return {object} self
             */
            reset: function (metrics) {
                metrics = metrics || [];
                this.models = [];
                this.order = [];
                angular.forEach(metrics, function (metric) {
                    var model = MetricModel.newInstance(metric);
                    this.models.push(model);
                }, this);
                return this;
            },

            /**
             * Find all selected metrics and return it sorted by order
             * return {array}
             */
            getSelectedMetrics: function () {
                var selectedMetrics;

                selectedMetrics = this.models.filter(function (model) {
                    return model.getSelected();
                });

                selectedMetrics = selectedMetrics.sort(function (a, b) {
                    return a.getOrder() > b.getOrder();
                });

                return selectedMetrics;
            },

            /**
             * Looks through each model in the models
             * returning the first one <MetricModel> or undefined
             * @param {string} name
             * return {object|undefined}
             */
            findMetricByName: function (name) {
                var models;

                models = this.models.filter(function (model) {
                    return model.getName().toLowerCase() === name.toLowerCase();
                });

                return models[0];
            },

            /**
             * Looks through each model in the models
             * returning the first one <MetricModel> or undefined
             * @param {string} id
             * return {object|undefined}
             */
            findMetricById: function (id) {
                var models;

                models = this.models.filter(function (model) {
                    return model.getId().toLowerCase() === id.toLowerCase();
                });

                return models[0];
            },

            /**
             * Intentionally return default metrics in RIE order (Revenue, Impressions Ecpm).
             * return {object|undefined} 
             */
            getDefaultMetricList: function () {
                var list = this.isAG ? defaultAgMetricLists[this.userType] : defaultMetricLists[this.userType];

                return list.map(function (metricId) {
                    return this.findMetricById(metricId);
                }.bind(this));

            },

            getDefaultIdList: function () {
                var list = this.isAG ? defaultAgMetricLists[this.userType] :  defaultMetricLists[this.userType];

                return list.map(function (metricId) {
                    var model = this.findMetricById(metricId);
                    return model.getId();
                }.bind(this));
            },

            /**
             * @description
             * Return list of metrics with groups
             * return {array}
             */
            getMetricsWithGroups: function () {
                var list, result = [];

                list = this.isAG ? ["agMetrics"] : ["standardMetrics", "bidMetrics"];

                list.forEach(function (groupId) {
                    var groupModel, metrics;
                    groupModel = MetricModel.newInstance({ apiName: groupId });
                    groupModel.isGroup = true;

                    metrics = this.models.filter(function (model) { return model.getGroupId() === groupId; });
                    metrics = metrics.sort(function (a, b) {
                        return (a.getName() < b.getName()) ? -1 : (a.getName() > b.getName()) ? 1 : 0;
                    });

                    if (metrics.length) {
                        groupModel.setName(metrics[0].getGroupName());
                        result.push({
                            groupModel: groupModel,
                            metrics: metrics
                        });
                    }

                }.bind(this));

                if (!this.isAG) {
                    var bidMetricsGroup = result.pop();

                    result.push({
                        groupModel: bidMetricsGroup.groupModel,
                        metrics: bidMetricsGroup.metrics.slice(0, Math.ceil(bidMetricsGroup.metrics.length/2))
                    });
                    result.push({
                        groupModel: bidMetricsGroup.groupModel,
                        metrics: bidMetricsGroup.metrics.slice(Math.ceil(bidMetricsGroup.metrics.length/2))
                    });
                }

                return result;
            }

        };
        
    }]);

}).call(this, angular);


