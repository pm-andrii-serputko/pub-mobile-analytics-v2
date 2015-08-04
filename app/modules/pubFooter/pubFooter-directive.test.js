/*global describe, it, beforeEach, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Directive: pubFooter", function () {


        beforeEach(module("pubSlicerApp"));

        beforeEach(module("modules/pubFooter/pubFooter-directive.html"));
        beforeEach(module("modules/pubNotifications/toast.html"));

        beforeEach(inject(function ($rootScope, $controller) {
            this.$scope = $rootScope.$new();
            this.controller = $controller("pubFooterCtrl", {
                $scope: this.$scope
            });
        }));

        beforeEach(inject(function ($compile, $httpBackend, pubAnalyticService, $location) {
            pubAnalyticService.fetch();
            this.$location = $location;
            $httpBackend.whenPOST("api/v1/analytics/displayvalue").respond([]);
            $httpBackend.flush();
            this.element = angular.element("<pub-footer></pub-footer>");
            $compile(this.element)(this.$scope);
        }));

        it("Should display pub-footer directive", function () {
            expect(this.element).to.exist;
        });

        describe("scope", function () {
            it("should exist", function () {
                expect(this.$scope).to.exist;
                expect(this.$scope).to.be.an("object");
            });
        });
    });
}).call(this);
