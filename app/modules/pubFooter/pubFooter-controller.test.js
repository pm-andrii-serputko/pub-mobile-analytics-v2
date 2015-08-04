/*global describe, it, beforeEach, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Controller: pubFooterCtrl", function () {
        var service;
        beforeEach(module("pubSlicerApp"));
        beforeEach(module("modules/pubNotifications/toast.html"));
        beforeEach(inject(function ($rootScope, $controller) {
            this.$scope = $rootScope.$new();
            this.controller = $controller("pubFooterCtrl", {
                $scope: this.$scope
            });
        }));

	    beforeEach(inject(function ($compile, $rootScope, $httpBackend, pubAnalyticService, pmTokenStorageService) {
	        pubAnalyticService.fetch();
            service = pmTokenStorageService;
	        $httpBackend.whenPOST("api/v1/analytics/displayvalue").respond([]);
            this.$httpBackend = $httpBackend;
	        $httpBackend.flush();
	    }));

        describe("scope", function () {
            it("should exist", function () {
                expect(this.$scope).to.exist;
                expect(this.$scope).to.be.an("object");
            });
        });

        it("should exist", function () {
            expect(this.controller).to.exist;
            expect(this.controller).to.be.an("object");
        });

        it("openNewWindow should exist", function () {
            this.$scope.openNewWindow("xxxx");
            expect(this.$scope.openNewWindow).to.be.an("function");
        });

        it("$scope.footerlinks should has 0 items", function () {
            expect(this.$scope.footerlinks.length).to.equal(0);
        });

        it("$scope.footerlinks should has 2 items", function () {
            service.setRefLoginOriginApp("publisher");
            this.$scope.init();

            expect(this.$scope.footerlinks.length).to.equal(2);
        });

        it("$scope.footerlinks should has 3 items", function () {
            service.setRefLoginOriginApp("demand");
            this.$scope.init();

            expect(this.$scope.footerlinks.length).to.equal(3);
        });
    });
}).call(this);
