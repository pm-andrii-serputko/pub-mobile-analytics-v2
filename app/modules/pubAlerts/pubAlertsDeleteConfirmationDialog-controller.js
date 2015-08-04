/*global angular*/
(function (angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");

    app.controller("DeleteCtrl", [
        "$scope",
        "$timeout",
        function ($scope, $timeout) {
            $scope.callDeleteConfirm = function(value){
                $scope.confirm(value ? true : false);
            };

            //Setting focus on ngDialog in order to prevent multiple clicks-multiple dialog opens
            $scope.$watch("$viewContentLoaded", function(){
                $timeout(function(){
                    document.getElementById("deleteItem").focus();
                }, 0);
            });
        }
    ]);
}).call(this, angular);