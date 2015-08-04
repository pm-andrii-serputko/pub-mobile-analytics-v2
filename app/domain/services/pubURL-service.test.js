/*global describe, beforeEach, it, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Service: pubURLService", function () {
        var service;

        beforeEach(function () {
            module("pub-ui-analytics");
        });

        beforeEach(function () {
            inject(function(pubURLService) {
                service = pubURLService;
            });
        });

        it("should be a function", function () {
            expect(service).to.be.a("object");
        });

        describe("urlToNlp", function () {

            it("should be implemented", function () {
                expect(service.urlToNlp).to.exist;
                expect(service.urlToNlp).to.be.a("function");
            });

            it("should return NLP query", function () {
                var url;
                
                url = "slice";
                expect(service.urlToNlp(url)).to.equal("slice");

                url = "slice/site";
                expect(service.urlToNlp(url)).to.equal("slice site");

                url = "slice/site,advertiser";
                expect(service.urlToNlp(url)).to.equal("slice site,advertiser");

                url = "slice/site,advertiser=Nike";
                expect(service.urlToNlp(url)).to.equal("slice site,advertiser=Nike");

                url = "slice/site,advertiser=Nike?filter=true";
                expect(service.urlToNlp(url)).to.equal("slice site,advertiser=Nike?filter=true");
            });

        });

        describe("navigate", function () {

            it("should be implemented", function () {
                expect(service.navigate).to.exist;
                expect(service.navigate).to.be.a("function");
            });
            
        });

    });
}).call(this);