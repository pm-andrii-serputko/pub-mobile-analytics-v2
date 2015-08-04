/*global angular*/
(function (angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");

    app.controller("pubFooterCtrl", [
        "$scope",
        "pmTokenStorageService",

        function ($scope,tokenStorageService) {
            $scope.openNewWindow = function(link){
                window.open(link, "Privacy", "height=700,width=862,resizable=yes,status=no,toolbar=no,menubar=no,location=no,scrollbars=yes,titlebar=no,directories=no");
            };

            $scope.init = function() {
                $scope.footerCopyrightYear = (new Date()).getFullYear();
                $scope.footerlinks = [];
                if (tokenStorageService.getRefLoginOriginApp() === "publisher") {
                    $scope.footerlinks.push({"label":"Master Service Agreement",
                                             "link": "https://apps.pubmatic.com/tos.jsp"});
                    $scope.footerlinks.push({"label":"Privacy Policy",
                                             "link": "https://apps.pubmatic.com/privacy.jsp"});
                } else if (tokenStorageService.getRefLoginOriginApp() === "demand") {
                    $scope.footerlinks.push({"label":"Feedback",
                                             "link": "http://apps.pubmatic.com/mediabuyer/feedback.html"});
                    $scope.footerlinks.push({"label":"Privacy Policy",
                                             "link": "https://apps.pubmatic.com/privacy.jsp"});
                    $scope.footerlinks.push({"label":"Terms and Conditions",
                                             "link": "http://apps.pubmatic.com/mediabuyer/privacy.html"});
                } else {
                    console.log("Invalid origin URL:", tokenStorageService.getRefLoginOriginUrl());
                }
            };
            $scope.init();
        }
    ]);
}).call(this, angular);
