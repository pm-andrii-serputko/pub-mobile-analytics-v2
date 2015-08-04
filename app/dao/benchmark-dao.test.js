/*global describe, beforeEach, it, expect, inject*/
(function () {
    "use strict";

    describe("dao.benchmarkDao", function () {

        beforeEach(function () {
            module("pub-ui-analytics.dao");
        });

        beforeEach(function () {
            inject(function(benchmarkDao, $httpBackend) {
                this.benchmarkDao = benchmarkDao;
                this.$httpBackend = $httpBackend;
            });
        });

        it("should be registered in the 'dao' module", function () {
            expect(this.benchmarkDao).to.be.an("object");
        });

        it("should have a defer object", function () {
            expect(this.benchmarkDao.defer).to.be.an("object");
            expect(this.benchmarkDao.defer.resolve).to.be.a("function");
            expect(this.benchmarkDao.defer.reject).to.be.a("function");
            expect(this.benchmarkDao.defer.notify).to.be.a("function");
            expect(this.benchmarkDao.defer.promise).to.be.an("object");
        });

        it("'open' method should exist", function () {
            expect(this.benchmarkDao.open).to.be.a("function");
        });

        it("'open' method should return defer object", function () {
            expect(this.benchmarkDao.open()).to.equal(this.benchmarkDao.defer);
        });

        it("'close' method should exist", function () {
            expect(this.benchmarkDao.close).to.be.a("function");
        });

        it("'fetch' method should exist", function () {
            expect(this.benchmarkDao.fetch).to.be.a("function");
        });

        it("'getResource' method should exist", function () {
            expect(this.benchmarkDao.getResource).to.be.a("function");
        });

    });

}).call(this);