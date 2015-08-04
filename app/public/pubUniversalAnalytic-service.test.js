/*global describe, beforeEach, it, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Service: pubUniversalAnalyticService", function () {
        var service, $httpBackend;

        beforeEach(function () {
            module("pubSlicerApp");
        });

        beforeEach(function () {
            inject(function(pubUniversalAnalyticService) {
                service = pubUniversalAnalyticService;
                service.fetch();
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
                service.fetch().then(function (response) {
                    expect(response).to.be.an("object");
                    done();
                });
                $httpBackend.flush();
            });

            it("response should has isBenchmarkAvailable", function (done) {
                service.fetch().then(function () {
                    expect(service.isBenchmarkAvailable()).to.equal(true);
                    done();
                });
                $httpBackend.flush();
            });

            it("response should has account subtype", function (done) {
                service.fetch().then(function () {
                    expect(service.getAccountSubtype()).to.equal("default");
                    done();
                });
                $httpBackend.flush();
            });

            it("response should not be aggregator", function (done) {
                service.fetch().then(function () {
                    expect(service.isAggregator()).to.equal(false);
                    done();
                });
                $httpBackend.flush();
            });
        });
    });

}).call(this);