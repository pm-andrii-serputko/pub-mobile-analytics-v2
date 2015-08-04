/*jshint unused:false*/
"use strict";

var app =  angular.module("pubSlicerApp");
app.directive("pubReportFeedback", [function () {
    return {
        templateUrl: "modules/pubReportFeedback/pubReportFeedback-directive.html",
        restrict: "E",
        $scope:  {
        },
        controller: ["$scope","$filter","feedbackApiService","pubAnalyticService", "googleAnalyticsService", "config", function($scope,$filter,feedbackApiService,pubAnalyticService, googleAnalyticsService, config) {
            /**
             * Submit Feedback
             */
            $scope.submitFeedback = function submitFeedback(data) {
                if ($scope.feedbackYes  === true ){
                    googleAnalyticsService.gTrackEventUsage("button", "click", config.gaReportFeedbackGood);
                }
                else {
                    googleAnalyticsService.gTrackEventUsage("button", "click", config.gaReportFeedbackBad);
                }

                var dimensions = pubAnalyticService.getHistoricDimensions(),
                    metrics = pubAnalyticService.getHistoricMetrics(),
                    type = "",
                    req = "";

                if (!$scope.textProcessed) {
                    var slicerSelection = dimensions.getSelectedDimensions().concat(metrics.getSelectedMetrics());
                    req = slicerSelection.map(function callback(element){
                        return element.getId();
                    }).join(",");
                    type = 1;
                } else {
                    req = $scope.nlpDisplay;
                    type = 0;
                }

                var feedbackData = {
                    serviceType: type,
                    request: req,   //get NLP request bar
                    response: JSON.stringify(feedbackApiService.getResponse()),  //get response json (first request, no nesting)
                    usefulnessLevel: data.rank? 5 : 1,
                    feedback: data.comment || ""
                };

                feedbackApiService.postFeedback(feedbackData)
                    .success(function() {
                        $scope.finishedFeedback = true;
                        $scope.feedbackMessage = $filter("translate")("FEEDBACK.SUCCESS");
                    })
                    .error(function() {
                        $scope.feedbackMessage = $filter("translate")("FEEDBACK.ERROR");
                    });
            };

            $scope.resetFeedback = function() {
                $scope.feedbackYes = "";
                $scope.feedbackMessage= "";
            };
        }]
    };
}]);
