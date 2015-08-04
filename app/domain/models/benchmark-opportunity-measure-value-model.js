(function (angular) {
    "use strict";
    /*jshint validthis:true */

    angular
        .module("pub-ui-analytics.domain")
        .factory("BenchmarkOpportunityMeasureValueModel", ["MeasureValueModel", "dataFormattingService", constructor]);

    // +------+---------+--------+-------------+------------+---------------+
    // |  id  |  value  |  type  |  measureId  |  isMetric  |  isDimension  | 
    // +------+---------+--------+-------------+------------+---------------+

    function constructor (MeasureValueModel, dataFormattingService) {
        /** @constructor */
        function BenchmarkOpportunityMeasureValueModel () {}
        /** Inherit MeasureValueModel Сlass */
        BenchmarkOpportunityMeasureValueModel.prototype = new MeasureValueModel();
        /** Extend propertires */
        BenchmarkOpportunityMeasureValueModel.prototype.measureValue = "";
        BenchmarkOpportunityMeasureValueModel.prototype.potential = 0;
        BenchmarkOpportunityMeasureValueModel.prototype.opportunity = 0;

        BenchmarkOpportunityMeasureValueModel.prototype.decorate = function (decorator, currency) {
            var F = function () {}, newobj;
            F.prototype = this;
            newobj = new F();
            BenchmarkOpportunityMeasureValueModel.decorators[decorator].call(newobj, this, currency);
            return newobj;
        };
        
        BenchmarkOpportunityMeasureValueModel.decorators = {
            formatedValue: function (obj, currency) {
                convertToFormattedValue.call(this, "value", obj, currency);
                convertToFormattedValue.call(this, "potential", obj, currency);
                convertToFormattedValue.call(this, "opportunity", obj, currency);
            }
        };

        Object.defineProperty(BenchmarkOpportunityMeasureValueModel.prototype, "valuePercentage", {
            get: function() {
                return convertToPercentage(this.value, this.potential);
            }
        });

        Object.defineProperty(BenchmarkOpportunityMeasureValueModel.prototype, "potentialPercentage", {
            get: function() {
                return convertToPercentage(this.potential, this.potential);
            }
        });

        Object.defineProperty(BenchmarkOpportunityMeasureValueModel.prototype, "opportunityPercentage", {
            get: function() {
                return convertToPercentage(this.opportunity, this.potential);
            }
        });

        function convertToPercentage(value, total) {
            if (value === null || value === undefined) {
                return "N/A";
            } else {
                var valuePercentage = value * 100 / total;
                valuePercentage = valuePercentage.toFixed(1);
                return valuePercentage + "%";
            }
        }

        function convertToFormattedValue(key, object, currency) {
            Object.defineProperty(this, key, {
                get: function() {
                    if (object[key] === null || object[key] === undefined) {
                        return "N/A";
                    } else {
                        return dataFormattingService.format(object.measureId, object[key], currency);
                    }

                }
            });
        }

        return BenchmarkOpportunityMeasureValueModel;
    }

}).call(this, angular);