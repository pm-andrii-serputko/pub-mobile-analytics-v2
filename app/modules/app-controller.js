/*global angular*/
(function(angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");

    app.controller("pubSlicerCtrl", [
        "$scope",
        "$idle",
        "$filter",
        "pmTokenStorageService",
        "toastr",
        "googleAnalyticsService",
        "mediator",

        function($scope, $idle, $filter, tokenStorageService, toastr, googleAnalyticsService, mediator) {


            $scope.sidebarwidth = 0;
            $scope.leftmargin = $scope.sidebarwidth;

            $scope.bodywidth = window.innerWidth - $scope.sidebarwidth;

            $scope.slidesidebar = function() {
                //$scope.paneClosed = $scope.sidebarwidth === 300;
                $scope.sidebarwidth = $scope.sidebarwidth === 300 ? 0 : 300;
                //$scope.bodywidth = window.innerWidth - $scope.sidebarwidth;

                $scope.leftmargin = $scope.sidebarwidth === 300 ? 300 : 40;

            };


            $scope.xAxisTickFormat = function() {
                return function(d) {
                    return window.d3.time.format("%x")(new Date(d));
                };
            };

            $scope.toolTipContentFunction = function() {
                return function(key, x, y) {
                    console.log("tooltip content");
                    return "Super New Tooltip" +
                        "<h1>" + key + "</h1>" +
                        "<p>" + y + " at " + x + "</p>";
                };
            };



            var updateTopHeaderUserLinks = function(userType) {
                $scope.userInfoLinkList = [];
                switch (userType) {
                    case "buyer":
                        $scope.settingsUrl = "http://apps.pubmatic.com/mediabuyer/?viewName=accountSettings";
                        $scope.helpUrl = "bower_components/pubSlicerHelp/buyer/index.htm";
                        break;
                    case "dsp":
                        $scope.settingsUrl = "http://apps.pubmatic.com/mediabuyer/?viewName=accountSettings";
                        $scope.helpUrl = "bower_components/pubSlicerHelp/dsp/index.htm";
                        break;
                    case "publisher":
                        $scope.settingsUrl = "https://apps.pubmatic.com/08_account_edit.jsp";
                        $scope.helpUrl = "bower_components/pubSlicerHelp/normal_publisher/index.htm";
                        break;
                }
            };


            // see documentation for ng-idle for the following
            $scope.events = [];

            // timeout session and clear all session storage
            $scope.$on("$idleTimeout", function() {
                // the user has timed out (meaning idleDuration + warningDuration has passed without any activity)
                console.log("User has been timed out due to inactivity");
                var signoutUrl = tokenStorageService.getRefSignoutUrl();
                tokenStorageService.clearAllSessionStorage();
                $scope.navigate(signoutUrl);
            });

            $scope.navigate = function(url) {
                window.location.href = url;
            };

            $scope.$on("$idleWarn", function(e, countdown) {
                // follows after the $idleStart event, but includes a countdown until the user is considered timed out
                // the countdown arg is the number of seconds remaining until then.
                // you can change the title or display a warning dialog from here.
                // you can let them resume their session by calling $idle.watch()
                var translate = $filter("translate");

                toastr.warning(translate("NOTIFICATION.TIMEOUT_WARNING_1") + countdown + translate("NOTIFICATION.TIMEOUT_WARNING_2"), "", {
                    timeOut: 1000
                });
            });

            googleAnalyticsService.gTrackTraffic();

            mediator.subscribe("update:topHeaderUserLinks", function(userType) {
                updateTopHeaderUserLinks(userType);
            });

        }
    ]);

}).call(this, angular);
