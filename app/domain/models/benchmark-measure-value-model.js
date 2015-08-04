(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.domain")
        .factory("BenchmarkMeasureValueModel", ["MeasureValueModel", constructor]);

    // +------+---------+----------------+----------------+----------------+-------------------+-------------------+--------+----------+--------+-------------+------------+---------------+
    // |  id  |  value  |  avgCompValue  |  minCompValue  |  maxCompValue  |  medianCompValue  |  absolutMinValue  |  absolutMaxValue  |  type  |  measureId  |  isMetric  |  isDimension  |
    // +------+---------+----------------+----------------+----------------+-------------------+-------------------+--------+----------+--------+-------------+------------+---------------+

    function constructor (MeasureValueModel) {
        /** @constructor */
        function BenchmarkMeasureValueModel () {}
        /** Inherit MeasureValueModel Сlass */
        BenchmarkMeasureValueModel.prototype = new MeasureValueModel();
        /** Extend propertires */
        BenchmarkMeasureValueModel.prototype.avgCompValue = 0;
        BenchmarkMeasureValueModel.prototype.minCompValue = 0;
        BenchmarkMeasureValueModel.prototype.maxCompValue = 0;
        BenchmarkMeasureValueModel.prototype.medianCompValue = 0;
        BenchmarkMeasureValueModel.prototype.absolutMinValue = 0;
        BenchmarkMeasureValueModel.prototype.absolutMaxValue = 0;
        BenchmarkMeasureValueModel.prototype.bulletChartDataSet = {};
        /** Inherit decorators */
        BenchmarkMeasureValueModel.decorators = MeasureValueModel.decorators;

        return BenchmarkMeasureValueModel;
    }

}).call(this, angular);