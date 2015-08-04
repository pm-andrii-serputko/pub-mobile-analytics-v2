/*global angular*/
(function (angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");

    app.directive("pubDimensionItem", ["DateModel", "historicMeasuresService", "pageModel", function (DateModel, historicMeasuresService, pageModel) {
        return {
            restrict: "A",
            link: function ($scope) {

                $scope.toggle = function () {
                    if ($scope.dimensionModel.getDisabled() && !$scope.dimensionModel.getSelected()) {
                        return false;
                    }

                    if ($scope.dimensionModel.getSelected()) {
                        historicMeasuresService.unselectDimension($scope.dimensionModel);
                        // TODO: - Code style - move the logic below into unselectDimension method
                        if ($scope.dimensionModel.getGroupId() === "timeUnits") {
                            DateModel.setAggregation("date");
                            DateModel.setSelectedRangeId(2);
                            DateModel.setSelectedRangeName("Last 7 days");
                        }

                    } else {
                        historicMeasuresService.selectDimension($scope.dimensionModel);
                        // TODO: - Code style - move the logic below into selectDimension method
                        if ($scope.dimensionModel.getGroupId() === "timeUnits") {
                            DateModel.setAggregation($scope.dimensionModel.getId());

                            if ($scope.dimensionModel.getId() === "hour")  {
                                DateModel.setSelectedRangeId(0);
                                DateModel.setSelectedRangeName("Today");
                            }
                            else if  ($scope.dimensionModel.getId() === "date") {
                                DateModel.setAggregation("date");
                                DateModel.setSelectedRangeId(2);
                                DateModel.setSelectedRangeName("Last 7 days");
                            }

                            else if ($scope.dimensionModel.getId() === "week"){
                                DateModel.setSelectedRangeId(4);
                                DateModel.setSelectedRangeName("Last Week");
                            }
                            else if ($scope.dimensionModel.getId() === "month"){
                                DateModel.setSelectedRangeId(5);
                                DateModel.setSelectedRangeName("Last Month");
                            }
                            else if ($scope.dimensionModel.getId() === "quarter"){
                                DateModel.setSelectedRangeId(7);
                                DateModel.setSelectedRangeName("Last Quarter");
                            }
                        }

                    }

                    pageModel.setIsModifyingExistingReport(true);
                    $scope.slicerURLParamsService.save();
                };
            }
        };
    }]);

}).call(this, angular);
