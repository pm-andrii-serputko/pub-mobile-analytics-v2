/*global angular*/
(function (angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");

    app.controller("NoUsersSelectedCtrl", [
        "$scope",
        "$timeout",
        function ($scope, $timeout) {
            //Setting focus on ngDialog in order to prevent multiple clicks-multiple dialog opens
            $scope.$watch("$viewContentLoaded", function(){
                $timeout(function(){
                    document.getElementById("noUserSelected").focus();
                }, 0);
            });
        }
    ]);
}).call(this, angular);