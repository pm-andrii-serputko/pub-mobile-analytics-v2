/*global describe, beforeEach, it, expect, inject */
/*jshint expr: true */
"use strict";

describe("Directive: pubRow", function () {

    beforeEach(module("pubSlicerApp"));
    beforeEach(module("modules/pubTable/pubRow-directive.html"));

    beforeEach(inject(function ($compile, $rootScope) {

        this.$compile = $compile;
        this.$scope = $rootScope.$new();

        this.element = angular.element("<pub-row></pub-row>");
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
