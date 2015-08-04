/*global describe, it, beforeEach, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Controller: PubDashboardCtrl", function () {

        beforeEach(module("pubSlicerApp"));
        beforeEach(module("modules/pubNotifications/toast.html"));

        beforeEach(inject(function ($rootScope, $controller, $timeout, pubAnalyticService, $httpBackend) {

            pubAnalyticService.fetch();
            $httpBackend.whenPOST("api/v1/analytics/displayvalue").respond([]);
            this.$httpBackend = $httpBackend;
            $httpBackend.flush();


            this.$scope = $rootScope.$new();
            this.$scope.navigateNLP = function(){};
            this.$scope.currentPageIndicator = function(){};

            this.controller = $controller("PubDashboardCtrl", {
                $scope: this.$scope,
                $timeout: $timeout,
                pubAnalyticService: pubAnalyticService
            });
        }));

        it("should exist", function () {
            expect(this.controller).to.exist;
            expect(this.controller).to.be.an("object");
        });

        describe("scope", function () {

            it("should exist", function () {
                expect(this.$scope).to.exist;
                expect(this.$scope).to.be.an("object");
            });

            describe("dashboardData", function () {

                it("should be 'undefined' by default", function () {
                    expect(this.$scope.dashboardData).to.be.undefined;
                });

            });

        });

    });
}).call(this);
