/*global describe, beforeEach, it, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Service: SlicerURLParamsModel", function () {

        var service;

        beforeEach(function () {
            module("pubSlicerApp");
        });

        beforeEach(function () {
            inject(function(slicerURLParamsService) {
                service = slicerURLParamsService;
            });
        });

        it("should exist and be a object", function () {
            expect(service).to.exist;
            expect(service).to.be.an("object");
        });

        describe("fetch", function () {

            it("should exist", function () {
                expect(service.fetch).to.exist;
                expect(service.fetch).to.be.a("function");
            });

        });

        describe("save", function () {

            it("should exist", function () {
                expect(service.save).to.exist;
                expect(service.save).to.be.a("function");
            });

        });

    });
}).call(this);