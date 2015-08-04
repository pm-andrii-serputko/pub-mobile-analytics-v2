(function (angular) {
    "use strict";
    /*jshint validthis:true */

    angular
        .module("pub-ui-analytics.domain")
        .factory("MeasureModel", constructor);

    // +------+--------+--------+-----------+-------------+------------+---------------+
    // |  id  |  name  |  type  |  groupId  |  groupName  |  isMetric  |  isDimension  |
    // +------+--------+--------+-----------+-------------+------------+---------------+

    /* @ngInject */
    constructor.$inject = [];
    function constructor () {

        /** @constructor*/
        function MeasureModel () {}

        /** Attributes */
        MeasureModel.prototype.id = null;
        MeasureModel.prototype.name = "";
        MeasureModel.prototype.type = "";
        MeasureModel.prototype.groupId = null;
        MeasureModel.prototype.groupName = "";


        Object.defineProperty(MeasureModel.prototype, "isMetric", {
            get: function() {
                return this.type === "metric";
            }
        });

        Object.defineProperty(MeasureModel.prototype, "isDimension", {
            get: function() {
                return this.type === "dimension";
            }
        });

        /** Methods */
        MeasureModel.prototype.set = function (attrs) {
            for (var key in attrs) {
                this[key] = attrs[key];
            }
        };


        return MeasureModel;
    }

}).call(this, angular);