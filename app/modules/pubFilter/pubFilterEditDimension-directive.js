/*global angular*/
(function(angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");

    app.directive("pubFilterEditDimension", function() {
        return {
            templateUrl: "modules/pubFilter/pubFilterEditDimension.html",
            restrict: "A",
            replace: true,
            scope: {
                editableDimension: "=",
                cancelEditing: "=",
                save: "="
            },
            controller: [
                "$scope",
                "pubAnalyticService",
                "dimensionValuesService",
                "$debounce",
                "$filter",

                function($scope, pubAnalyticService, dimensionValuesService, $debounce, $filter) {
                    $scope.metricsCollection = pubAnalyticService.getHistoricMetrics();

                    $scope.metricList = $scope.metricsCollection.getSelectedMetrics().length ? $scope.metricsCollection.getSelectedMetrics() : $scope.metricsCollection.getDefaultMetricList();

                    if ($scope.editableDimension.getGroupId() === "timeUnits") {
                        $scope.metricList.unshift($scope.editableDimension);
                    }

                    $scope.showExtraComparisonFilter = false;
                    $scope.showExtraDimensionValueFilter = false;
                    $scope.showExtraValueChangeFilter = false;

                    $scope.toggleExtraFilter = function(extraFilterName) {
                        if (extraFilterName === "comparison") {
                            $scope.showExtraComparisonFilter = !$scope.showExtraComparisonFilter;
                            $scope.showExtraDimensionValueFilter = false;
                            $scope.showExtraValueChangeFilter = false;
                        }

                        if (extraFilterName === "dimensionValue") {
                            $scope.showExtraComparisonFilter = false;
                            $scope.showExtraDimensionValueFilter = !$scope.showExtraDimensionValueFilter;
                            $scope.showExtraValueChangeFilter = false;
                        }

                        if (extraFilterName === "changeValue") {
                            $scope.showExtraComparisonFilter = false;
                            $scope.showExtraDimensionValueFilter = false;
                            $scope.showExtraValueChangeFilter = !$scope.showExtraValueChangeFilter;
                        }
                    };

                    $scope.changeMetric = function() {
                        var metricId = $scope.selectedMetric.getId();
                        $scope.editableDimension.getFilter().setMetric(metricId);
                        $scope.isEditableDimensionChanged = true;
                    };

                    $scope.changeRank = function() {
                        $scope.editableDimension.getFilter().setRank($scope.selectedRank);
                        $scope.isEditableDimensionChanged = true;
                    };

                    $scope.changeRankValue = function() {
                        $scope.editableDimension.getFilter().setRankValue($scope.selectedRankValue);
                        $scope.isEditableDimensionChanged = true;
                    };

                    $scope.changeComparison = function() {
                        $scope.editableDimension.getFilter().setComparison($scope.selectedComparison);
                        if ($scope.selectedComparison === "none") {
                            $scope.selectedCompareValue = "";
                            $scope.editableDimension.getFilter().setCompareValue($scope.selectedCompareValue);
                            $scope.isEditableDimensionChanged = true;
                        }
                    };

                    $scope.changeCompareValue = function() {
                        $scope.editableDimension.getFilter().setCompareValue($scope.selectedCompareValue);
                        $scope.isEditableDimensionChanged = true;
                    };

                    $scope.clearDimensions = function() {
                        $scope.selectedDimensionValueIds = [];
                        $scope.selectedDimensionValues = [];
                        $scope.editableDimension.getFilter().setDimensionValueFilters([]);
                        $scope.isEditableDimensionChanged = true;
                    };

                    $scope.changeDimensionValueFilters = function(dimensionValue) {
                        var index = $scope.selectedDimensionValueIds.indexOf(dimensionValue.id);

                        if (index !== -1) {
                            $scope.selectedDimensionValueIds.splice(index, 1);
                            $scope.selectedDimensionValues = $scope.selectedDimensionValues.filter(function (model) {
                                return model.id !== dimensionValue.id;
                            });
                            $scope.editableDimension.getFilter().setDimensionValueFilters($scope.selectedDimensionValueIds);
                        } else {
                            var obj = {};
                            obj[$scope.editableDimension.getId()] = {};
                            obj[$scope.editableDimension.getId()][dimensionValue.id] = dimensionValue.name;

                            dimensionValuesService.add(obj);

                            $scope.selectedDimensionValueIds.push(dimensionValue.id);
                            $scope.selectedDimensionValues.push(dimensionValue);

                            $scope.editableDimension.getFilter().setDimensionValueFilters($scope.selectedDimensionValueIds);
                        }
                        $scope.isEditableDimensionChanged = true;
                    };

                    $scope.dimensionValues = [];
                    $scope.dimensionValueIndex = 0;
                    $scope.shownDimensionValues = [];

                    // Watch the queryInput and debounce the filtering by 750 ms.
                    $scope.$watch("dimensionValueQuery", function(newValue, oldValue) {
                        if (newValue === oldValue) {
                            return;
                        }
                        $debounce(applyQuery.bind(this), 750);
                    });

                    /** Debounce callback */
                    function applyQuery() {
                        dimensionValuesService
                            .fetch({
                                dimensions: $scope.editableDimension.getId()
                            })
                            .then(function(response) {
                                if ($scope.dimensionValueQuery) {
                                    var data = $filter("filter")(response, {name: $scope.dimensionValueQuery});
                                    resetDimensionValues(data);
                                }

                                if ($scope.dimensionValueQuery === "") {
                                    resetDimensionValues(response);
                                }
                            });
                    }

                    function resetDimensionValues (data) {
                        $scope.dimensionValues = data;
                        $scope.dimensionValueIndex = 0;
                        $scope.shownDimensionValues = [];
                        $scope.loadMore();
                    }

                    $scope.loadMore = function(step) {
                        step = step || 100;
                        for (var i = 0; i < step; i++) {
                            if ($scope.dimensionValues[$scope.dimensionValueIndex]) {
                                $scope.shownDimensionValues.push($scope.dimensionValues[$scope.dimensionValueIndex]);
                                $scope.dimensionValueIndex += 1;
                            }
                        }
                    };


                    var prepareFilterData = function() {
                        if ($scope.editableDimension) {
                            var metricId = $scope.editableDimension.getFilter().getMetric();
                            $scope.selectedMetric = $scope.metricsCollection.findMetricById(metricId) || $scope.editableDimension;
                            $scope.selectedRank = $scope.editableDimension.getFilter().getRank();
                            $scope.selectedRankValue = $scope.editableDimension.getFilter().getRankValue();
                            $scope.selectedComparison = $scope.editableDimension.getFilter().getComparison();
                            $scope.selectedCompareValue = $scope.editableDimension.getFilter().getCompareValue();

                            $scope.dimensionValueQuery = "";
                            $scope.dimensionValues = [];
                            $scope.selectedDimensionValueIds = $scope.editableDimension.getFilter().getDimensionValueFilters();
                            $scope.selectedDimensionValues = $scope.dimensionValues.filter(function(el) {
                                return $scope.selectedDimensionValueIds.indexOf(el.id) !== -1;
                            });

                            $scope.selectedDimensionValuesIsEmpty = $scope.dimensionValues.length === 0;
                            $scope.selectedDimensionValuesLoading = true;
                            $scope.isEditableDimensionChanged = false;


                            dimensionValuesService
                                .fetch({
                                    dimensions: $scope.editableDimension.getId()
                                })
                                .then(function(response) {
                                    resetDimensionValues(response);
                                    $scope.selectedDimensionValues = $scope.dimensionValues.filter(function (el) {
                                        return $scope.selectedDimensionValueIds.indexOf(el.id) !== -1;
                                    });
                                    $scope.selectedDimensionValuesIsEmpty = $scope.dimensionValues.length === 0;
                                    $scope.selectedDimensionValuesLoading = false;
                                });
                        }
                    };

                    prepareFilterData();
                    $scope.$watch("editableDimension", prepareFilterData);
                }
            ]
        };

    });


}).call(this, angular);
