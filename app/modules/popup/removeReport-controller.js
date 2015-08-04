/*global angular*/
(function (angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");

    app.controller("removeCtrl", [
        "$scope",
        "$timeout",
        "$filter",

        function ($scope, $timeout, $filter) {
            $scope.displayRemoveMessage = "";
            $scope.removeItem = function(){
                $scope.confirm({"name":$scope.reportName,"description":$scope.reportDescription});
            };

            $scope.close = function(){
                $scope.closeThisDialog();
            };

            //Switch between remove reports and remove alerts message.
            if($scope.alertRemove){
                $scope.displayRemoveMessage = $filter("translate")("ALERTS.REMOVE_ALERTS");
            }else{
                $scope.displayRemoveMessage = $filter("translate")("REPORTS.REMOVE_CUSTOM");
            }

            //Fixing ADS-862 by setting focus on ngDialog in order to prevent multiple clicks-multiple dialog opens
            $scope.$watch("$viewContentLoaded", function(){
                $timeout(function(){
                    document.getElementById("removeItem").focus();
                }, 0);
            });
        }
    ]);
}).call(this, angular);