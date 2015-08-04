/*global describe, it, beforeEach, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Directive: pubChart", function () {

        beforeEach(module("pubSlicerApp"));
        beforeEach(module("modules/pubCharts/pubChart-directive.html"));
        beforeEach(module("modules/pubNotifications/toast.html"));

        beforeEach(inject(function ($httpBackend, pubAnalyticService) {
            pubAnalyticService.fetch();
            $httpBackend.whenPOST("api/v1/analytics/displayvalue").respond([]);
            $httpBackend.flush();
        }));


        beforeEach(inject(function ($compile, $rootScope, $location) {

            this.$compile = $compile;
            this.$scope = $rootScope.$new();
            this.$location = $location;
            this.element = angular.element("<pub-chart></pub-chart>");

            $compile(this.element)(this.$scope);
        }));

        it("Should display pub-chart directive", function () {
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
