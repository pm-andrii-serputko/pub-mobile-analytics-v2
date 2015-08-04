/*jshint unused:false*/
"use strict";

var app =  angular.module("pubSlicerApp");


app.directive("pubNlpResult", [
    "historicMeasuresService",
    "pubUniversalAnalyticService",
    "$debounce",
    "$location",
    "pubNLPService",

    function (historicMeasuresService, pubUniversalAnalyticService, $debounce, $location, pubNLPService) {
        return {
            templateUrl: "modules/pubNlpResult/pubNlpResult-directive.html",
            restrict: "EA",
            controller: "pubNlpResultCtrl",

            link: function($scope, iElement, $Attrs) {

                function escapeSpecialCharacters(str) {
                    return str
                        .replace(/&amp;/g, "and")
                        .replace(/&lt;/g, "less than")
                        .replace(/&gt;/g, "greater than")
                        .replace(/'/g, "")
                        .replace(/"/g, "")
                        .replace(/%/g, " percents")
                        .replace(/&nbsp;/g," ");
                }


                var NLP_KEYPRESS_TIMEOUT = 2000;
                $scope.showResult = false;

                $scope.$watch("nlpDisplay", function(newValue, oldValue) {
                    $scope.typing = true;
                    $scope.nlpLoading = false;
                    $scope.updateReportList();
                    $scope.textProcessed = false;
                    if (newValue && newValue !== ""){
                        $scope.nlpStr = escapeSpecialCharacters(newValue);
                        if ( newValue !== "slice"  && ((pubNLPService.isCommand(newValue)  &&  !pubNLPService.isSliceCommand(newValue) )  || pubNLPService.isSlicePillCommand(newValue) )) {
                            $scope.typing = false;
                            $scope.showResult = false;
                        }
                        else {
                            $scope.showResult = true;

                            historicMeasuresService.unselectAllDimensions();
                            historicMeasuresService.unselectAllMetrics();

                            if (pubUniversalAnalyticService.isAggregator() === false){
                                $debounce($scope.callTextProcessing, NLP_KEYPRESS_TIMEOUT);
                            }
                        }
                    }
                    else {
                        if (pubUniversalAnalyticService.isAggregator()){
                            $location.url("/");
                        }

                        $scope.showResult = false;
                    }
                });
            }
        };
    }
]);