"use strict";
angular.module("pubSlicerApp")
    .directive("slidingDrawer", ["pubURLService", "$rootScope",
        function(pubURLService, $rootScope) {
            return {
                templateUrl: "modules/slidingDrawer/slidingDrawer-directive.html",
                restrict: "E",
                transclude: true,
                controller: function($scope) {
                    /**
                     * Scope interface
                     */
                    //                    $scope.$on("update:slidingDrawerLinks", updateLinks);
                    $scope.links = getLinks();

                    $scope.redirectURL = function(path) {

                        $rootScope.snapper.close();
                        pubURLService.navigate(path);
                    };


                    /**
                     * Collection of links
                     * @returns {array}
                     */
                    function getLinks() {
                        var regularList = [{
                            display: "Real Time",
                            nlp: "dashboard",
                            icon: "th-pulse",
                            href: "dashboard"
                        }, {
                            display: "Standard Reports",
                            nlp: "standard",
                            icon: "th-copy",
                            href: "standard"
                        }, {
                            display: "Custom Reports",
                            nlp: "custom reports",
                            icon: "th-disk",
                            href: "custom"
                        }, {
                            display: "Alerts",
                            nlp: "alerts",
                            icon: "th-info",
                            href: "alerts"
                        }, {
                            display: "Log Out",
                            icon: "th-logout",
                            href: "loginlinks"
                        }];

                        return regularList;
                    }

                }
            };
        }
    ]);
