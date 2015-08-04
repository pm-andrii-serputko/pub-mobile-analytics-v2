"use strict";

angular.module("pubSlicerApp")
  .directive("pubBody", [function () {
    return {
        templateUrl: "modules/pubBody/pubBody.html",
        restrict: "E",
        transclude: true
    };
}]);
