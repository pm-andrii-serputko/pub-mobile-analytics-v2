/*global angular*/
(function (angular) {
    "use strict";

    var app = angular.module("pubSlicerApp"),
        COLUMN_NUMBERS = 3;

    app.controller("PubDimensionsCtrl", [
        "$scope",
        "pubAnalyticService",
        "pubURLService",
        "slicerURLParamsService",
        "googleAnalyticsService",
        "config",
        "historicMeasuresService",
        "$location",
        "pubUniversalAnalyticService",
        "pageModel",

        function ($scope, pubAnalyticService, pubURLService, slicerURLParamsService, googleAnalyticsService, config, historicMeasuresService, $location, pubUniversalAnalyticService, pageModel) {
            /**
             * Scope interface
             */
            $scope.dimensionsCollection = [];
            $scope.dimensionGroupList = [];
            $scope.dimensionGroupListSortedByColumns = [];
            $scope.showHourInfo = false;
            $scope.slicerURLParamsService = slicerURLParamsService;
            $scope.clear = clear;
            $scope.cancel = cancel;
            $scope.done = done;


            initialize();

            

            /** Private methods */
            function initialize() {
                if (pubUniversalAnalyticService.isAggregator()){
                    $location.url("/");
                }
                else {
                    slicerURLParamsService.fetch();

                    pageModel.updateIndicator();

                    $scope.dimensionsCollection = pubAnalyticService.getHistoricDimensions();
                    $scope.metricsCollection = pubAnalyticService.getHistoricMetrics();


                    if (($scope.dimensionsCollection.getSelectedDimensions().length !== 0) && ($scope.metricsCollection.getSelectedMetrics().length !== 0)  && pageModel.getIsModifyingExistingReport()  ) {
                        $scope.updateNlp(true);
                    }
                    else if (!$location.search().customReportId) {
                        slicerURLParamsService.reset();
                        $scope.navigateNLP("create report");
                    }


                    pageModel.updateReportBasicInfo();


                    $scope.dimensionGroupList = $scope.dimensionsCollection.getDimensionsWithGroups();
                    $scope.dimensionGroupListSortedByColumns = sliceOnColumns($scope.dimensionGroupList, COLUMN_NUMBERS);


                    // TODO: - Code style - improve the logic below.
                    // - Get model by id.
                    // - Check this event on selectDimension/unselectDimension 
                    angular.forEach($scope.dimensionsCollection.getSelectedDimensions(),function(dimension){
                        if(dimension.attributes.id==="hour"){
                            $scope.showHourInfo = true;
                        }
                    });
                }

                googleAnalyticsService.gTrackPageUsage(config.gaDimensionPage);
                
            }

            function clear() {
                historicMeasuresService.unselectAllDimensions();
                slicerURLParamsService.save();
            }

            function cancel() {
                historicMeasuresService.unselectAllDimensions();
                pubURLService.back();
            }

            function done() {
                googleAnalyticsService.gTrackEventUsage("button", "click", config.gaCreateReport);
                var hash = slicerURLParamsService.getUrl("filter", {f: slicerURLParamsService.getEncodedData()});
                pubURLService.navigate(hash, true);
            }

            function sliceOnColumns(list, columnCount) {
                var result = [];
                var columnsSchema = [];
                var remainder = list.length % columnCount;
                var quotient = list.length / columnCount;

                if (remainder === 0) {
                    columnsSchema.push(Math.ceil(quotient));
                    columnsSchema.push(Math.ceil(quotient));
                    columnsSchema.push(Math.ceil(quotient));
                }

                if (remainder === 1) {
                    columnsSchema.push(Math.ceil(quotient));
                    columnsSchema.push(Math.round(quotient));
                    columnsSchema.push(Math.round(quotient));
                }

                if (remainder === 2) {
                    columnsSchema.push(Math.ceil(quotient));
                    columnsSchema.push(Math.ceil(quotient));
                    columnsSchema.push(Math.round(quotient));
                }

                eachSlice(list, columnsSchema, function (slice) {
                    result.push(slice);
                });

                return result;
            }

            function eachSlice(obj, columnsSchema, iterator, context) {
                for (var i = 0, j = 0; j < 3; i += columnsSchema[j], j++) {
                    iterator.call(context, obj.slice(i, i + columnsSchema[j]), i, obj);
                }
            }

            $scope.getDimensionTooltip = function( key ){
                return $scope.dimensionsCollection.findDimensionById(key).getDimensionDescription();
            };

        }
    ]);
}).call(this, angular);
