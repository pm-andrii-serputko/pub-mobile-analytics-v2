/*global angular*/
(function (angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");

    var showProTip = true;

    app.controller("PubFilterCtrl", [
        "$scope",
        "$timeout",
        "pubURLService",
        "slicerURLParamsService",
        "historicMeasuresService",
        "pubUniversalAnalyticService",
        "googleAnalyticsService",
        "config",
        "$location",
        "pageModel",

        function ($scope,$timeout, pubURLService, slicerURLParamsService, historicMeasuresService, pubUniversalAnalyticService, googleAnalyticsService, config, $location, pageModel) {
            googleAnalyticsService.gTrackPageUsage(config.gaFilterPage);
            slicerURLParamsService.fetch();

            pageModel.updateIndicator();
            pageModel.updateReportBasicInfo();


            var dimensionsCollection = historicMeasuresService.getDimensions();

            $scope.editableDimension = null;
            $scope.selectedDimensions = dimensionsCollection.getSelectedDimensions();
            $scope.visibleDimensions = dimensionsCollection.getVisibleDimensions();
            $scope.invisibleDimensions = dimensionsCollection.getInvisibleDimensions();

            $scope.showProTip = showProTip;
            $scope.errorMessage = "";
            $scope.isAggregator = pubUniversalAnalyticService.isAggregator();

            $scope.edit = function (dimension) {
                if ($scope.editableDimension && $scope.editableDimension.getId() === dimension.getId()) {
                    $scope.editableDimension = null;
                } else {
                    $scope.editableDimension = dimension;
                }
            };

            $scope.destroy = function (dimension) {
                $scope.editableDimension = null;
                historicMeasuresService.unselectDimension(dimension);
                $scope.visibleDimensions = dimensionsCollection.getVisibleDimensions();
                $scope.invisibleDimensions = dimensionsCollection.getInvisibleDimensions();

                slicerURLParamsService.save();
            };


            $scope.cancelEditing = function () {
                slicerURLParamsService.fetch();
                $scope.editableDimension = null;
                $scope.selectedDimensions = dimensionsCollection.getSelectedDimensions();
                $scope.visibleDimensions = dimensionsCollection.getVisibleDimensions();
                $scope.invisibleDimensions = dimensionsCollection.getInvisibleDimensions();
            };

            $scope.save = function () {
                slicerURLParamsService.save();
            };


            $scope.cancel = function () {
                if (!$scope.editableDimension) {
                    pubURLService.back();
                }
            };

            $scope.generate = function () {
                if (!$scope.editableDimension && dimensionsCollection.isValid()) {
                    var hash = slicerURLParamsService.getUrl("slice", {f: slicerURLParamsService.getEncodedData()});
                    pubURLService.navigate(hash);
                }
                if (!dimensionsCollection.isValid()) {
                    $scope.showErrorTip("FILTER.ERROR_REMAINING_DIMENSIONS");
                }
            };

            $scope.hideProTip = function () {
                $scope.showProTip = false;
                showProTip = false;
            };

            $scope.showErrorTip = function (message) {
                $scope.errorMessage = message;
            };

            $scope.hideErrorTip = function () {
                $scope.errorMessage = "";
            };

            $scope.goToDimensionsScreen = function () {
                if (!$scope.editableDimension) {
                    pageModel.setIsModifyingExistingReport(true);
                    var hash = slicerURLParamsService.getUrl("dimensions", {f: slicerURLParamsService.getEncodedData()});
                    pubURLService.navigate(hash, true);
                }
            };

            $scope.goToMetricsScreen = function () {
                if (!$scope.editableDimension && dimensionsCollection.isValid()) {
                    var hash = slicerURLParamsService.getUrl("metrics", {f: slicerURLParamsService.getEncodedData()});
                    pubURLService.navigate(hash, true);
                }
                if (!dimensionsCollection.isValid()) {
                    $scope.showErrorTip("FILTER.ERROR_REMAINING_DIMENSIONS");
                }
            };

            $scope.drop = function (dimension, isVisibleBuckets) {
                dimension.setVisible(isVisibleBuckets === "true");

                var visibleDimension = document.querySelectorAll("#visible-dimensions tbody tr[draggable]");
                var invisibleDimension = document.querySelectorAll("#invisible-dimensions tbody tr[draggable]");
                var order = [];

                [].forEach.call(visibleDimension, function (dimensionDOM) {
                    order.push(dimensionDOM.attributes["data-id"].value);
                });

                [].forEach.call(invisibleDimension, function (dimensionDOM) {
                    order.push(dimensionDOM.attributes["data-id"].value);
                });


                dimensionsCollection.order = order;
                historicMeasuresService.orderMeasure.call(dimensionsCollection);
                slicerURLParamsService.save();
            };

        }
    ]);



}).call(this, angular);
