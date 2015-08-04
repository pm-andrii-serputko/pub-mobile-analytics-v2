/*global describe, beforeEach, it, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Service: pubAnalyticService", function () {
        var service, $httpBackend;

        beforeEach(function () {
            module("pubSlicerApp");
        });

        beforeEach(function () {
            inject(function(pubAnalyticService) {
                service = pubAnalyticService;
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

            it("Response should contain 'publisherList', 'dspList', 'timezone', 'currency', 'realtimeConfiguration' and 'historicConfiguration' keys", function (done) {
                service.fetch().then(function (response) {
                    expect(response.data).to.include.keys("publisherList", "dspList", "timezone", "currency", "realtimeConfiguration", "historicConfiguration");
                    done();
                });
                $httpBackend.flush();
            });

        });

        describe("getPublisherList", function () {

            it("should exist", function () {
                expect(service.getPublisherList).to.exist;
                expect(service.getPublisherList).to.be.a("function");
            });

            it("should return an array", function () {
                expect(service.getPublisherList()).to.be.an("array");
            });

        });

        describe("getDspList", function () {

            it("should exist", function () {
                expect(service.getDspList).to.exist;
                expect(service.getDspList).to.be.a("function");
            });

            it("should return an array", function () {
                expect(service.getDspList()).to.be.an("array");
            });

        });

        describe("getRealtimeDimensions", function () {

            it("should exist", function () {
                expect(service.getRealtimeDimensions).to.exist;
                expect(service.getRealtimeDimensions).to.be.a("function");
            });

            it("should return an object", function () {
                expect(service.getRealtimeDimensions()).to.be.an("object");
            });

        });

        describe("getRealtimeMetrics", function () {

            it("should exist", function () {
                expect(service.getRealtimeMetrics).to.exist;
                expect(service.getRealtimeMetrics).to.be.a("function");
            });

            it("should return an object", function () {
                expect(service.getRealtimeMetrics()).to.be.an("object");
            });

        });

        describe("getHistoricDimensions", function () {

            it("should exist", function () {
                expect(service.getHistoricDimensions).to.exist;
                expect(service.getHistoricDimensions).to.be.a("function");
            });

            it("should return an object", function () {
                expect(service.getHistoricDimensions()).to.be.an("object");
            });

        });

        describe("getHistoricMetrics", function () {

            it("should exist", function () {
                expect(service.getHistoricMetrics).to.exist;
                expect(service.getHistoricMetrics).to.be.a("function");
            });

            it("should return an object", function () {
                expect(service.getHistoricMetrics()).to.be.an("object");
            });

        });

        describe("getLocale", function () {

            it("should exist", function () {
                expect(service.getLocale).to.exist;
                expect(service.getLocale).to.be.a("function");
            });

            it("should return en-us by default", function () {
                expect(service.getLocale()).to.equal("en-us");
            });

        });

    });

}).call(this);