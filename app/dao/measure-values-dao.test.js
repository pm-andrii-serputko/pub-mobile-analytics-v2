/*global describe, beforeEach, it, expect, inject*/
(function () {
    "use strict";

    describe("dao.measureValuesDao", function () {

        beforeEach(function () {
            module("pub-ui-analytics.dao");
        });

        beforeEach(function () {
            inject(function(measureValuesDao, $httpBackend) {
                this.measureValuesDao = measureValuesDao;
                this.$httpBackend = $httpBackend;
            });
        });

        it("should be registered in the 'dao' module", function () {
            expect(this.measureValuesDao).to.be.an("object");
        });

        it("should have a defer object", function () {
            expect(this.measureValuesDao.defer).to.be.an("object");
            expect(this.measureValuesDao.defer.resolve).to.be.a("function");
            expect(this.measureValuesDao.defer.reject).to.be.a("function");
            expect(this.measureValuesDao.defer.notify).to.be.a("function");
            expect(this.measureValuesDao.defer.promise).to.be.an("object");
        });

        it("'open' method should exist", function () {
            expect(this.measureValuesDao.open).to.be.a("function");
        });

        it("'open' method should return defer object", function () {
            expect(this.measureValuesDao.open()).to.equal(this.measureValuesDao.defer);
        });

        it("'close' method should exist", function () {
            expect(this.measureValuesDao.close).to.be.a("function");
        });

        it("'getResource' method should exist", function () {
            expect(this.measureValuesDao.getResource).to.be.a("function");
        });

        it("'fetch' method should exist", function () {
            expect(this.measureValuesDao.fetch).to.be.a("function");
        });

        describe("fetching", function () {
            it("should GET data", function (done) {
                var channelOptions = {params: {dimensions: "channelId"}};
                this.measureValuesDao.fetch(channelOptions).then(function (response) {
                    expect(response).to.have.length(5);
                    expect(response[0]).to.have.property(0, "ALL");
                    expect(response[4]).to.have.property(4, "Ad Network");
                    done();
                });

                this.$httpBackend.flush();
            });
        });

        describe("batch", function () {
            it("should have 'batch' method", function () {
                expect(this.measureValuesDao.batch).to.be.a("function");
            });

            it("should fetch several request and synchronize them", function (done) {
                var channelOptions = {params: {dimensions: "channelId"}};
                var platformOptions = {params: {dimensions: "platformId"}};
                var adFormatOptions = {params: {dimensions: "adFormatId"}};
                var adSizeOptions = {params: {dimensions: "adSizeId"}};
                
                this.measureValuesDao.batch([
                    this.measureValuesDao.fetch(channelOptions),
                    this.measureValuesDao.fetch(platformOptions),
                    this.measureValuesDao.fetch(adFormatOptions),
                    this.measureValuesDao.fetch(adSizeOptions)
                ]).then(function (response) {

                    expect(response).to.have.length(4);
                    expect(response[0]).to.have.length(5);   // channelId
                    expect(response[1]).to.have.length(5);   // platformId
                    expect(response[2]).to.have.length(2);   // adFormatId
                    expect(response[3]).to.have.length(127); // adSizeId
                    done();
                });

                this.$httpBackend.flush();
            });
        });

    });

}).call(this);