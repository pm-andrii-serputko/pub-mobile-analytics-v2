/*global describe, beforeEach, it, expect, inject */
/*jshint expr: true */
(function () {
    "use strict";

    describe("Router", function () {

        beforeEach(module("pubSlicerApp"));
        beforeEach(function () {
            module("modules/pubSlicerScreen/pubSlicerScreen.html");
            module("modules/pubDashboard/pubDashboard.html");
            module("modules/pubDimensions/pubDimensions.html");
            module("modules/pubMetrics/pubMetrics.html");
            module("modules/pubFilter/pubFilter.html");
            module("modules/pubHelp/pubHelpScreen.html");
            module("modules/pubNotifications/toast.html");
        });

        beforeEach(inject(function ($compile, $rootScope, $httpBackend, pubAnalyticService) {
            pubAnalyticService.fetch();
            $httpBackend.whenPOST("api/v1/analytics/displayvalue").respond([]);
            $httpBackend.flush();
        }));

        it("should have a working slice_path route", inject(function($route, $location, $rootScope) {
            expect($route.current).to.equal(undefined);
            $location.path("/slice");
            $rootScope.$digest();

            expect($route.current.templateUrl).to.equal("modules/pubSlicerScreen/pubSlicerScreen.html");
            expect($route.current.controller).to.be.equal("PubSlicerScreenCtrl");
        }));

        

        it("should have a working dashboard_path route", inject(function($route, $location, $rootScope) {
            expect($route.current).to.equal(undefined);
            $location.path("/dashboard");
            $rootScope.$digest();

            expect($route.current.templateUrl).to.equal("modules/pubDashboard/pubDashboard.html");
            expect($route.current.controller).to.be.equal("PubDashboardCtrl");
        }));

        it("should be redirected to dashboard page if route is not mathed", inject(function($route, $location, $rootScope) {
            expect($route.current).to.equal(undefined);
            $location.path("/wrongUrl");
            $rootScope.$digest();

            expect($route.current.templateUrl).to.equal("modules/pubDashboard/pubDashboard.html");
            expect($route.current.controller).to.be.equal("PubDashboardCtrl");
        }));

        it("should have a working dimensions_path route", inject(function($route, $location, $rootScope) {
            expect($route.current).to.equal(undefined);
            $location.path("/dimensions");
            $rootScope.$digest();

            expect($route.current.templateUrl).to.equal("modules/pubDimensions/pubDimensions.html");
            expect($route.current.controller).to.be.equal("PubDimensionsCtrl");
        }));

        it("should have a working metrics_path route", inject(function($route, $location, $rootScope) {
            expect($route.current).to.equal(undefined);
            $location.path("/metrics");
            $rootScope.$digest();

            expect($route.current.templateUrl).to.equal("modules/pubMetrics/pubMetrics.html");
            expect($route.current.controller).to.be.equal("PubMetricsCtrl");
        }));

        it("should have a working filter_path route", inject(function($route, $location, $rootScope) {
            expect($route.current).to.equal(undefined);
            $location.path("/filter");
            $rootScope.$digest();

            expect($route.current.templateUrl).to.equal("modules/pubFilter/pubFilter.html");
            expect($route.current.controller).to.be.equal("PubFilterCtrl");
        }));

        it("should have a working help_path route", inject(function($route, $location, $rootScope) {
            expect($route.current).to.equal(undefined);
            $location.path("/help");
            $rootScope.$digest();

            expect($route.current.templateUrl).to.equal("modules/pubHelp/pubHelpScreen.html");
            expect($route.current.controller).to.be.equal("pubHelpScreenCtrl");
        }));

    });

}).call(this);
