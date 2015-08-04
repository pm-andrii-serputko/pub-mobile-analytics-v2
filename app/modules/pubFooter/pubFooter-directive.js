/**
 * Created by lingan.nguyen on 9/2/14.
 */
/*jshint unused:false*/
"use strict";

var app =  angular.module("pubSlicerApp");
app.directive("pubFooter", [function () {
    return {
        templateUrl: "modules/pubFooter/pubFooter-directive.html",
        restrict: "EA",
        controller: "pubFooterCtrl"
    };
}]);
