/*global angular*/
(function (angular) {
    "use strict";

    var app, API;

    app = angular.module("pubSlicerApp");

    app.factory("pubTableService", ["MeasureModel", "MeasureValueModel", function (MeasureModel, MeasureValueModel) {

        API = {
            
            /**
             * @description
             * Inject set of dimensions to columns.
             * @example:
               <example>
                    // Selected dimensions: Advertiser, Site, DSP
                    // Selected metrics: R, I, C
                        var columnsInput = [Advertiser, R, I, C];
                        var columnsOutput = [Advertiser, Site, DSP, R, I, C];
               </example>
             * @params columns {array}
             * @params options {object} Contain information about dimensions
             * @returns {array} Modified columns array
             */
            parseColumns: function (columns, options) {
                var result = [], dimensions;

                dimensions = options.dimensions || [];
                dimensions = dimensions.map(function (dimension) {
                    var model = new MeasureModel();
                    model.id = dimension.getId();
                    model.name = dimension.getName();
                    model.type = "dimension";
                    return model;
                });
                dimensions = dimensions.slice(1, dimensions.length);

                result = this.insertArrayAt(columns, 1, dimensions);

                return result;
            },

            /**
             * @description
             * Inject set of dimensions to each row depends on level of grouping.
             * @example:
               <example>
                    // Selected dimensions: Advertiser, Site, DSP
                    // Selected metrics: R, I, C
                    // Level of Grouping: 1
                        var rowInput = [Advertiser, R, I, C];
                        var rowOutput = [Advertiser, Site, DSP, R, I, C];
                    // Level of Grouping: 2
                        var rowInput = [Site, R, I, C];
                        var rowOutput = [Site, DSP, R, I, C];
               </example>
             * @params rows {array}
             * @params options {object} Contain information about dimensions and level of grouping
             * @returns {array} Modified rows array
             */
            parseRows: function (rows, options) {
                var result = [], dimensions, groupingLevel;

                groupingLevel = options.groupingLevel || 1;
                dimensions = options.dimensions || [];
                dimensions = dimensions.map(function (dimension) {
                    var model = new MeasureValueModel();
                    model.type = "dimension";
                    model.measureId = dimension.getId();
                    return model;
                });
                dimensions = dimensions.slice(groupingLevel, dimensions.length);

                angular.forEach(rows, function (row) {
                    row = this.insertArrayAt(row, 1, dimensions);
                    result.push(row);
                }, this);
                
                return result;
            },

            parse: function (slicerData, options) {
                var tableData = {};

                options = options || {};

                tableData.columns = this.parseColumns(slicerData.columns, options);
                tableData.rows = this.parseRows(slicerData.rows, options);

                return tableData;
            },

            insertArrayAt: function (array, index, arrayToInsert) {
                Array.prototype.splice.apply(array, [index, 0].concat(arrayToInsert));
                return array;
            }
        };

        return {
            parse: API.parse.bind(API),
            parseRows: API.parseRows.bind(API),
            parseColumns: API.parseColumns.bind(API)
        };
    }]);

}).call(this, angular);