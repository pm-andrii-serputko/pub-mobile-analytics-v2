/*global describe, beforeEach, afterEach, it, expect, inject, sinon*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("domain.historicApiService", function () {

        beforeEach(function () {
            module("pub-ui-analytics.domain");
        });

        beforeEach(function () {
            inject(function(historicApiService, $http, $httpBackend, pubAnalyticService, DateModel, historicDao) {
                this.historicApiService = historicApiService;
                this.dateService = DateModel;
                this.historicDao = historicDao;
                this.$http = $http;

                pubAnalyticService.fetch();
                $httpBackend.flush();
            });
        });

        beforeEach(function() {
            sinon.stub(this.dateService, "getStartDate", function() { return new Date(2015, 1, 1, 0, 0, 0); });
            sinon.stub(this.dateService, "getEndDate", function() { return new Date(2015, 1, 9, 0, 0, 0); });

            sinon.spy(this.historicDao, "decorate");
            sinon.spy(this.historicDao, "fetch");
        });

        afterEach(function() {
            // Unwraps the stub
            this.dateService.getStartDate.restore();
            this.dateService.getEndDate.restore();
            // Unwraps the spy
            this.historicDao.decorate.restore();
            this.historicDao.fetch.restore();
        });

        it("should be registered in the 'domain' module", function () {
            expect(this.historicApiService).to.be.an("object");
        });

        describe("exportData", function() {
            it("should generate download link", function() {
                var url = this.historicApiService.exportData();
                expect(url).to.equal("api/v1/analytics/export/publisher/31445?fromDate=2015-02-01T00%3A00&toDate=2015-02-09T00%3A00&metrics=revenue%2CpaidImpressions%2Cecpm&dimensions=&pageNumber=1&dateUnit=date&pageSize=10&sort=-revenue&filters=&type=xls&=undefined&");
            });

            it("should generate download link depends on type option", function() {
                var url = this.historicApiService.exportData({type: "csv"});
                expect(url).to.equal("api/v1/analytics/export/publisher/31445?fromDate=2015-02-01T00%3A00&toDate=2015-02-09T00%3A00&metrics=revenue%2CpaidImpressions%2Cecpm&dimensions=&pageNumber=1&dateUnit=date&pageSize=10&sort=-revenue&filters=&type=csv&=undefined&");
            });

            it("should generate download link depends on filter options", function() {
                var url = this.historicApiService.exportData({filters: ["siteId eq 11111"]});
                expect(url).to.equal("api/v1/analytics/export/publisher/31445?fromDate=2015-02-01T00%3A00&toDate=2015-02-09T00%3A00&metrics=revenue%2CpaidImpressions%2Cecpm&dimensions=&pageNumber=1&dateUnit=date&pageSize=10&sort=-revenue&filters=siteId%20eq%2011111&type=xls&=undefined&");
            });
        });

        describe("getTableData", function() {
            it("should get data for table section", function() {
                this.historicApiService.getTableData();

                expect(this.historicDao.decorate).to.have.been.calledWith("defaultValue");
                expect(this.historicDao.fetch).to.have.been.called;
            });
        });

        describe("getTotalData", function() {
            it("should get data for total section", function() {
                this.historicApiService.getTotalData();

                expect(this.historicDao.decorate).to.have.been.calledWith("defaultValue");
                expect(this.historicDao.fetch).to.have.been.called;
            });
        });

        describe("abort", function() {
            beforeEach(function() {
                sinon.spy(this.historicApiService, "abortTable");
                sinon.spy(this.historicApiService, "abortChart");
            });

            afterEach(function() {
                this.historicApiService.abortTable.restore();
                this.historicApiService.abortChart.restore();
            });
            it("should resolve all defers", function() {
                this.historicApiService.abort();

                expect(this.historicApiService.abortTable).to.have.been.called;
                expect(this.historicApiService.abortChart).to.have.been.called;
            });
        });

        describe("decorate", function() {
            it("should resolve all defers", function() {
                this.historicApiService.decorate("AAAAAAA").getTableData();
                expect(this.historicDao.decorate).to.have.been.calledWith("AAAAAAA");
                this.historicApiService.decorate("BBBBBBB").getTableData();
                expect(this.historicDao.decorate).to.have.been.calledWith("BBBBBBB");
                this.historicApiService.decorate("defaultValue").getTableData();
                expect(this.historicDao.decorate).to.have.been.calledWith("defaultValue");
            });
        });
    });

}).call(this);
