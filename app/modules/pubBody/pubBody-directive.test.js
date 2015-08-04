/*global describe, beforeEach, it, expect, inject */
/*jshint expr: true */
"use strict";

describe("Directive: pubBody", function () {

    beforeEach(module("pubSlicerApp"));

    beforeEach(module("modules/pubBody/pubBody.html"));

    beforeEach(inject(function ($compile, $rootScope) {
        this.$compile = $compile;
        this.$rootScope = $rootScope.$new();
        
        this.element = angular.element("<pub-body></pub-body>");
        $compile(this.element)(this.$rootScope);
        
        this.$rootScope.$digest();
       
    }));

    it("Should display pub-body directive", function () {
        expect(this.element).to.exist;
    });
});
