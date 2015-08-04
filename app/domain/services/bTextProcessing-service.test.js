/*global describe, beforeEach, it, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Service: bTextProcessingService", function () {
        var service, $httpBackend, nlpText = "site";

        beforeEach(function () {
            module("pubSlicerApp");
        });

        beforeEach(function () {
            inject(function(bTextProcessingService) {
                service = bTextProcessingService;
            });
        });

        it("should be a function", function () {
            expect(service).to.be.an("object");
        });

        describe("fetch", function () {

            beforeEach(function () {
                inject(function($injector) {
                    $httpBackend = $injector.get("$httpBackend");
                });
            });

            it("should exist", function () {
                expect(service.fetch).to.exist;
                expect(service.fetch).to.be.a("function");
            });

            it("response should be an object", function (done) {
                service.fetch(nlpText).then(function (response) {
                    expect(response).to.be.an("object");
                    done();
                });
                $httpBackend.flush();
            });

            it("Response should contain 'd', 'm', 'f'", function (done) {
                service.fetch(nlpText).then(function (response) {
                    expect(response.data).to.include.keys("d", "m", "f");
                    done();
                });
                $httpBackend.flush();
            });

        });
    });

}).call(this);