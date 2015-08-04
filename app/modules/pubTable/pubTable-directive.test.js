/*global describe, beforeEach, it, expect, inject */
/*jshint expr: true */
"use strict";

describe("Directive: pubTableDirective", function () {

    beforeEach(module("pubSlicerApp"));
    beforeEach(module("modules/pubTable/pubTable-directive.html"));
    beforeEach(module("modules/pubNotifications/toast.html"));
    beforeEach(inject(function ($compile, $rootScope, $httpBackend, pubAnalyticService) {
        pubAnalyticService.fetch();
        $httpBackend.whenPOST("api/v1/analytics/displayvalue").respond([]);
        $httpBackend.flush();

        this.$compile = $compile;
        this.$scope = $rootScope.$new();
        this.$scope.slicerData = {columns: [], rows: []};

        this.element = angular.element("<pub-table></pub-table>");
        $compile(this.element)(this.$scope);
    }));

    it("Should display pub-body directive", function () {
        expect(this.element).to.exist;
    });

    describe("scope", function () {

        it("should exist", function () {
            expect(this.$scope).to.exist;
            expect(this.$scope).to.be.an("object");
        });

    });
});
