/*global angular*/
(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.domain")
        .factory("DimensionsCollection", [
                
        "DimensionModel",
        "config",
        "dimensionsGroupsMap",

        function (DimensionModel, config, dimensionsGroupsMap) {

            return {

                /**
                 * @description
                 * Order array keeps dimension models in right order
                 */
                order: [],
                
                /**
                 * @description
                 * Collection of dimension models
                 */
                models: [],

                /**
                 * @description
                 * Adding and removing models
                 * @param {array} dimensions
                 * return {object} self
                 */
                reset: function (dimensions) {
                    dimensions = dimensions || [];
                    this.models = [];
                    this.order = [];
                    angular.forEach(dimensions, function (dimension) {
                        var model = DimensionModel.newInstance(dimension);
                        if (model.getOrder() > -1) {
                            this.order[model.getOrder()] = model.getId();
                        }
                        this.models.push(model);
                    }, this);
                    return this;
                },

                /**
                 * @description
                 * Find all selected dimensions and return it sorted by order
                 * return {array}
                 */
                getSelectedDimensions: function () {
                    var selectedDimensions;

                    selectedDimensions = this.models.filter(function (model) {
                        return model.getSelected();
                    });

                    selectedDimensions = selectedDimensions.sort(function (a, b) {
                        return a.getOrder() - b.getOrder();
                    });

                    return selectedDimensions;
                },

                /**
                 * @description
                 * Find if the dimensions for heatmap is valid
                 * return {boolean}
                 */
                hasInvalidHeatmapDimensions: function () {
                    var selectedDimensions;
                    var invalid = false;

                    selectedDimensions = this.getSelectedDimensions();
                    if (selectedDimensions.length < 2 ){
                        invalid = true;
                    }
                    return invalid;
                },

                /**
                 * @description
                 * Find if first dimension belong to timeUnit group.
                 * return {boolean}
                 */
                hasFirstTimeunitHeatmapDimensions: function () {
                    var selectedDimensions;
                    var invalid = false;

                    selectedDimensions = this.getSelectedDimensions();

                    if (selectedDimensions[0].getGroupId() === "timeUnits") {
                        invalid = true;
                    }
                    
                    return invalid;
                },

                /**
                 * @description
                 * Find if one of the first two dimensions belong to timeUnit group.
                 * return {boolean}
                 */
                hasTimeunitHeatmapDimensions: function () {
                    var selectedDimensions;
                    var invalid = false;

                    selectedDimensions = this.getSelectedDimensions();

                    if (selectedDimensions[0].getGroupId() === "timeUnits" || selectedDimensions[1].getGroupId() === "timeUnits") {
                        invalid = true;
                    }
                    
                    return invalid;
                },

                /**
                 * @description
                 * Looks through each model in the models
                 * returning list of visible dimension models <DimensionModel>
                 * return {array}
                 */
                getVisibleDimensions: function () {
                    var visibleDimensions;

                    visibleDimensions = this.models.filter(function (model) {
                        return model.getVisible();
                    });

                    visibleDimensions = visibleDimensions.sort(function (a, b) {
                        return a.getOrder() - b.getOrder();
                    });

                    return visibleDimensions;
                },


                getInvisibleDimensions: function () {
                    var selectedDimensions, invisibleDimensions;

                    selectedDimensions = this.models.filter(function (model) {
                        return model.getSelected();
                    });

                    invisibleDimensions = selectedDimensions.filter(function (model) {
                        return !model.getVisible();
                    });

                    invisibleDimensions = invisibleDimensions.sort(function (a, b) {
                        return a.getOrder() - b.getOrder();
                    });

                    return invisibleDimensions;
                },

                /**
                 * @description
                 * Looks through each model in the models by name and
                 * returning the first one <DimensionModel> or undefined
                 * @param {string} name
                 * return {object|undefined}
                 */
                findDimensionByName: function (name) {
                    var models;

                    models = this.models.filter(function (model) {
                        return model.getName().toLowerCase() === name.toLowerCase();
                    });

                    return models[0];
                },

                /**
                 * @description
                 * Looks through each model in the models by id and
                 * returning the first one <DimensionModel> or undefined
                 * @param {string} id
                 * return {object|undefined}
                 */
                findDimensionById: function (id) {
                    var models;

                    models = this.models.filter(function (model) {
                        return model.getId() === id;
                    });

                    return models[0];
                },


                /**
                 * @description
                 * Return list of dimensions with groups
                 * return {array}
                 */
                getDimensionsWithGroups: function () {
                    var list, result = [];

                    list = dimensionsGroupsMap.groupList;

                    list.forEach(function (groupId) {
                        var groupModel, dimensions;
                        groupModel = DimensionModel.newInstance({ apiName: groupId });
                        groupModel.isGroup = true;

                        dimensions = this.models.filter(function (model) { return model.getGroupId() === groupId; });
                        dimensions = dimensions.sort(function (a, b) {
                            return (a.getName() < b.getName()) ? -1 : (a.getName() > b.getName()) ? 1 : 0;
                        });

                        if (dimensions.length) {
                            groupModel.setName(dimensions[0].getGroupName());
                            result.push({
                                groupModel: groupModel,
                                dimensions: dimensions
                            });
                        }
                    }.bind(this));

                    return result;
                },

                getIdByUserType: function () {
                    var dmensions = {
                        publisher: "pubId",
                        buyer: "atdId",
                        dsp: "dspId"
                    };
                    
                    return dmensions[this.userType];
                },

                isValid: function () {
                    var visible, invisible, isValid;

                    visible = this.getVisibleDimensions();
                    invisible = this.getInvisibleDimensions();

                    isValid = visible.length <= config.maxVisibleDimensions && invisible.length <= config.maxInvisibleDimensions;

                    return isValid;
                }
            };
        
        }
    ]);

}).call(this, angular);


