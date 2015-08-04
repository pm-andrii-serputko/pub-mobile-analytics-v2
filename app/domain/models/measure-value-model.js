(function (angular) {
    "use strict";
    /*jshint validthis:true */

    // TODO: Looks like this model should be separated to
    //  - MeasureValueModel(:id, :value, :type, :measureId, :isMetric, :isDimension)
    //  - CompareMeasureValueModel(:id, :value, :type, :measureId, :isMetric, :isDimension, :compare, :isCompare)
    //  - BenchmarkMeasureValueModel(:id, :value, :type, :measureId, :isMetric, :isDimension, :mix, :max)

    angular
        .module("pub-ui-analytics.domain")
        .factory("MeasureValueModel", constructor);

    // +------+---------+--------+-------------+------------+---------------+-----------+-------------+
    // |  id  |  value  |  type  |  measureId  |  isMetric  |  isDimension  |  compare  |  isCompare  |
    // +------+---------+--------+-------------+------------+---------------+-----------+-------------+

    /** @ngInject */
    constructor.$inject = ["dataFormattingService"];
    function constructor (dataFormattingService) {
        /** @constructor*/
        function MeasureValueModel () {}

        /** Attributes */
        MeasureValueModel.prototype.id = null;
        MeasureValueModel.prototype.value = "";
        MeasureValueModel.prototype.type = "";
        MeasureValueModel.prototype.measureId = null;
        MeasureValueModel.prototype.isCompare = false;
        MeasureValueModel.prototype.compare = "equal"; // higher, lower, equal

        Object.defineProperty(MeasureValueModel.prototype, "isMetric", {
            get: function() {
                return this.type === "metric";
            }
        });

        Object.defineProperty(MeasureValueModel.prototype, "isDimension", {
            get: function() {
                return this.type === "dimension";
            }
        });

        /** Methods */
        MeasureValueModel.prototype.set = function (attrs) {
            for (var key in attrs) {
                this[key] = attrs[key];
            }
        };

        MeasureValueModel.prototype.decorate = function (decorator, currency) {
            var F = function () {}, newobj;
            F.prototype = this;
            newobj = new F();
            MeasureValueModel.decorators[decorator].call(newobj, this, currency);
            return newobj;
        };

        MeasureValueModel.decorators = {
            formatedValue: function (obj, currency) {
                Object.defineProperty(this, "value", {
                    get: function() {
                        if (obj.value === null || obj.value === undefined) {
                            return "N/A";
                        } else {
                            return dataFormattingService.format(obj.measureId, obj.value, currency);
                        }

                    }
                });
            },
            formatedWidthValue: function (obj, currency) {
                Object.defineProperty(this, "value", {
                    get: function() {
                        if (obj.value === null || obj.value === undefined) {
                            return 0;
                        } else {
                            return dataFormattingService.format(obj.measureId, obj.value, currency);
                        }

                    }
                });
            }
        };

        return MeasureValueModel;
    }

}).call(this, angular);