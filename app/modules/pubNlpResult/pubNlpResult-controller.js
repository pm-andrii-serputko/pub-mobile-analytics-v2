/*global angular*/
(function (angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");

    app.controller("pubNlpResultCtrl", [
        "$scope",
        "savedReportsService",
        "pubNLPService",
        "slicerURLParamsService",
        "commonReportsService",
        "pubUniversalAnalyticService",
        "bTextProcessingService",
        "pubURLService",

        function ($scope, savedReportsService,pubNLPService,slicerURLParamsService,commonReportsService, pubUniversalAnalyticService, bTextProcessingService, pubURLService) {

            $scope.updateReportList = function(){
                $scope.commonReport = commonReportsService.all();
                $scope.commonReport = $scope.commonReport.map(function (report) {
                    return {"name":report.getName(),"description":report.getDescription(),
                            "url": report.getUrl()+"&standardReportId="+report.getId()
                            };
                });

                $scope.savedReport = [];
                if (pubUniversalAnalyticService.isAggregator() === false){
                    $scope.savedReport = savedReportsService.all();
                    $scope.savedReport = $scope.savedReport.map(function (report) {
                        return {"name":report.getName(),"description":report.getDescription(),
                                "url": report.getUrl()+"&customReportId="+report.getId()
                                };
                    });
                }

                $scope.displayReportList = $scope.commonReport.concat($scope.savedReport);
            };

            $scope.callTextProcessing =  function () {
                $scope.nlpLoading = true;
                $scope.typing = false;


                if ($scope.nlpStr === ""  || (pubNLPService.isCommand($scope.nlpDisplay)  &&  !pubNLPService.isSliceCommand($scope.nlpDisplay) )  || pubNLPService.isSlicePillCommand($scope.nlpDisplay) ){
                    $scope.nlpLoading = false;
                    return;
                }
                else {
                    bTextProcessingService.fetch($scope.nlpStr).success(function (data) {

                        //flag for make the slicerscreen know this is from text process, and won't convert nlp to piills
                        $scope.textProcessed = true;

                        data=slicerURLParamsService.parseTextProcessingData(data);
                        var hash = slicerURLParamsService.getUrl("slice", {f: slicerURLParamsService.getEncodedData()});
                        pubURLService.navigate(hash);
                    }).error(function (){
                        $scope.textProcessed = false;
                    }).finally(function (){
                        $scope.nlpLoading = false;
                    });
                }

            };
            $scope.resultReportClicked = function (url){
                slicerURLParamsService.setOnLoadReportUrlValue(true);
                $scope.textProcessed = false;
                window.location.hash = url;
            };

            $scope.commandList = pubNLPService.getCommandList();
        }
    ]);

}).call(this, angular);
