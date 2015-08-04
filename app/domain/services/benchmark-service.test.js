/*global describe, beforeEach, afterEach, it, expect, inject, sinon*/
(function () {
    "use strict";

    describe("domain.benchmarkService", function () {

        beforeEach(function () {
            module("pub-ui-analytics.domain");
        });

        beforeEach(function () {
            inject(function($q, $httpBackend, $rootScope, pubAnalyticService, benchmarkService, benchmarkParsers, dao, slicerURLParamsService) {
                this.benchmarkService = benchmarkService;
                this.benchmarkParsers = benchmarkParsers;
                this.slicerURLParamsService = slicerURLParamsService;
                this.dao = dao;
                this.$httpBackend = $httpBackend;
                this.$q = $q;
                this.$rootScope = $rootScope;

                sinon.stub(this.dao.measureValues, "fetch", function(options) {
                    var data = [];
                    if (options.params.dimensions === "channelId") {
                        data = channelValuesMock();
                    }
                    if (options.params.dimensions === "platformId") {
                        data = platformValuesMock();
                    }
                    if (options.params.dimensions === "adFormatId") {
                        data = adFormatValuesMock();
                    }
                    if (options.params.dimensions === "adSizeId") {
                        data = adSizeValuesMock();
                    }
                    if (options.params.dimensions === "advertiserCategoryId") {
                        data = categoryValuesMock();
                    }
                    if (options.params.dimensions === "advertiserId") {
                        if (options.params.filters === "") {
                            data = advertiserValuesMock();
                        } else {
                            data = advertiserValuesMock().slice(0, 2);
                        }
                    }
                    return $q.when(data);
                });

                sinon.stub(this.slicerURLParamsService, "save", function() {
                    return slicerURLParamsService.getEncodedData();
                });

                pubAnalyticService.fetch();
                this.$httpBackend.flush();
            });
        });

        afterEach(function() {
            this.dao.measureValues.fetch.restore();
            this.slicerURLParamsService.save.restore();
        });

        it("should be registered in the 'domain' module", function () {
            expect(this.benchmarkService).to.be.an("object");
        });


        describe("dimension", function () {
            it("should have default value equal to 'advertiserId'", function () {
                expect(this.benchmarkService.dimension).to.equal("advertiserId");
            });
            it("should be a string", function () {
                expect(this.benchmarkService.dimension).to.be.a("string");
            });
        });

        describe("pageSize", function () {
            it("should have default value equal to '10'", function () {
                expect(this.benchmarkService.pageSize).to.equal(10);
            });
            it("should be a number", function () {
                expect(this.benchmarkService.pageSize).to.be.a("number");
            });
        });

        describe("selectedAdvertisers", function () {
            it("should be empty by default", function () {
                expect(this.benchmarkService.selectedAdvertisers).have.length(0);
            });
            it("should be an array", function () {
                expect(this.benchmarkService.selectedAdvertisers).to.be.an("array");
            });
        });

        describe("getQuartile", function () {
            it("should be a function", function () {
                expect(this.benchmarkService.getQuartile).to.be.a("function");
            });
            it("should return lower and upper quartile", function () {
                var minValue = 20;
                var maxValue = 30;
                var median = 25;
                var interquartileRange = 60; // 60%
                var lowerQuartile = this.benchmarkService.getQuartile(minValue, median, interquartileRange);
                var upperQuartile = this.benchmarkService.getQuartile(maxValue, median, interquartileRange);

                expect(lowerQuartile).to.equal(22);
                expect(upperQuartile).to.equal(28);
            });
            it("should return value equal to 'median' if interquartileRange equal to 0", function () {
                var minValue = 20;
                var median = 25;
                var interquartileRange = 0; // 0%
                var quartile = this.benchmarkService.getQuartile(minValue, median, interquartileRange);

                expect(quartile).to.equal(median);
            });
            it("should return value equal to 'value' if interquartileRange equal to 100", function () {
                var minValue = 20;
                var median = 25;
                var interquartileRange = 100; // 100%
                var quartile = this.benchmarkService.getQuartile(minValue, median, interquartileRange);

                expect(quartile).to.equal(minValue);
            });
        });

        describe("getBenchmarkData", function () {
            it("should exist", function () {
                expect(this.benchmarkService.getBenchmarkData).to.be.a("function");
            });

            it("should return data for Advertiser Benchmarking", function (done) {
                this.benchmarkService.dimension = "advertiserId";
                this.benchmarkService.selectedAdvertisers = [];
                this.benchmarkService.getBenchmarkData({}, "number", [{id: "ecpm", name: "eCPM"}, {id: "sow", name: "Share of Wallet (SOW)"}, {id: "sov", name: "Share of Voice (SOV)"}]).then(function (response) {
                    expect(response).to.include.keys(["columns", "secondaryColumns", "rows"]);
                    // check columns
                    expect(response.columns).have.length(4);
                    expect(response.columns[0].id).to.equal("advertiserId");
                    expect(response.columns[0].name).to.equal("Advertiser");
                    expect(response.columns[3].id).to.equal("sov");
                    expect(response.columns[3].name).to.equal("Share of Voice (SOV)");
                    // check columns
                    expect(response.secondaryColumns).have.length(6);
                    expect(response.secondaryColumns[0].id).to.equal("ecpm");
                    expect(response.secondaryColumns[0].name).to.equal("eCPM");
                    expect(response.secondaryColumns[5].id).to.equal("avgCompSov");
                    expect(response.secondaryColumns[5].name).to.equal("Avg. Comp. SOV");
                    // check rows
                    expect(response.rows).have.length(10);

                    done();
                });

                this.$httpBackend.flush();
            });

            it("should return data for Advertiser Benchmarking filtered by dimension values", function(done) {
                this.benchmarkService.dimension = "advertiserId";
                this.benchmarkService.selectedAdvertisers = [];
                var filters = {
                    channelId: [
                        {
                            "id": "1",
                            "value": "PMP",
                            "isSelected": true
                        }, {
                            "id": "2",
                            "value": "Spot Buys",
                            "isSelected": true
                        }, {
                            "id": "3",
                            "value": "Open Exchange",
                            "isSelected": false
                        }, {
                            "id": "4",
                            "value": "Ad Network",
                            "isSelected": false
                        }
                    ]
                };
                this.benchmarkService.getBenchmarkData(filters, "number", [{id: "ecpm", name: "eCPM"}, {id: "sow", name: "Share of Wallet (SOW)"}, {id: "sov", name: "Share of Voice (SOV)"}]).then(function (response) {
                    expect(response).to.include.keys(["columns", "secondaryColumns", "rows"]);
                    expect(response.columns).have.length(4);
                    expect(response.secondaryColumns).have.length(6);
                    done();
                });

                this.$httpBackend.flush();
            });

            it("should return data for Advertiser by Publisher Benchmarking", function (done) {
                this.benchmarkService.dimension = "advertiserId,pubId";
                this.benchmarkService.selectedAdvertisers = [{id: "1170", name: "AAAA"}, {id: "36167", name: "BBBB"}];

                this.benchmarkService.getBenchmarkData({}, "number", [{id: "ecpm", name: "eCPM"}, {id: "sow", name: "Share of Wallet (SOW)"}, {id: "sov", name: "Share of Voice (SOV)"}]).then(function (response) {
                    expect(response).to.include.keys(["columns", "secondaryColumns", "rows"]);
                    // check columns
                    expect(response.columns).have.length(3);
                    expect(response.columns[1].id).to.equal("1170");
                    expect(response.columns[1].name).to.equal("AAAA");
                    expect(response.columns[2].id).to.equal("36167");
                    expect(response.columns[2].name).to.equal("BBBB");
                    // check columns
                    expect(response.secondaryColumns).have.length(6);
                    expect(response.secondaryColumns[0].id).to.equal("ecpm");
                    expect(response.secondaryColumns[0].name).to.equal("eCPM");
                    expect(response.secondaryColumns[1].id).to.equal("sow");
                    expect(response.secondaryColumns[1].name).to.equal("Share of Wallet (SOW)");
                    expect(response.secondaryColumns[2].id).to.equal("sov");
                    expect(response.secondaryColumns[2].name).to.equal("Share of Voice (SOV)");
                    expect(response.secondaryColumns[3].id).to.equal("ecpm");
                    expect(response.secondaryColumns[3].name).to.equal("eCPM");
                    expect(response.secondaryColumns[4].id).to.equal("sow");
                    expect(response.secondaryColumns[4].name).to.equal("Share of Wallet (SOW)");
                    expect(response.secondaryColumns[5].id).to.equal("sov");
                    expect(response.secondaryColumns[5].name).to.equal("Share of Voice (SOV)");
                    // check rows
                    expect(response.rows).have.length(9);

                    done();
                });
                this.$httpBackend.flush();
            });
            it("should return data for Category Benchmarking", function (done) {
                this.benchmarkService.dimension = "advertiserCategoryId";
                this.benchmarkService.selectedAdvertisers = [];
                this.benchmarkService.getBenchmarkData({}, "number", [{id: "ecpm", name: "eCPM"}, {id: "sow", name: "Share of Wallet (SOW)"}, {id: "sov", name: "Share of Voice (SOV)"}]).then(function (response) {
                    expect(response).to.include.keys(["columns", "secondaryColumns", "rows"]);
                    // check columns
                    expect(response.columns).have.length(4);
                    expect(response.columns[0].id).to.equal("advertiserCategoryId");
                    expect(response.columns[0].name).to.equal("Category");
                    expect(response.columns[3].id).to.equal("sov");
                    expect(response.columns[3].name).to.equal("Share of Voice (SOV)");
                    // check columns
                    expect(response.secondaryColumns).have.length(6);
                    expect(response.secondaryColumns[0].id).to.equal("ecpm");
                    expect(response.secondaryColumns[0].name).to.equal("eCPM");
                    expect(response.secondaryColumns[5].id).to.equal("avgCompSov");
                    expect(response.secondaryColumns[5].name).to.equal("Avg. Comp. SOV");
                    // check rows
                    expect(response.rows).have.length(10);

                    done();
                });
                this.$httpBackend.flush();
            });

        });

        describe("selectFilter", function() {
            /** Fill chennel collection */
            beforeEach(function () {
                this.channelCollection = this.benchmarkParsers.measureValues(channelValuesMock());
            });

            it("should select items", function() {
                var selectedItems = [{id: "1"}, {id: "2"}];
                this.benchmarkService.selectFilter(selectedItems, this.channelCollection);

                var selectedChannels = this.channelCollection.filter(isSelected);
                expect(selectedChannels).to.have.length(2);
            });
            it("should unselect all items if all items are selected", function() {
                var selectedItems = [{id: "1"}, {id: "2"}, {id: "3"}, {id: "4"}]; // All items are selected
                this.benchmarkService.selectFilter(selectedItems, this.channelCollection);

                var selectedChannels = this.channelCollection.filter(isSelected);
                expect(selectedChannels).to.have.length(0);
            });
            it("should unselect all items if no selected items are provided", function() {
                var selectedItems = []; // No selected items
                this.benchmarkService.selectFilter(selectedItems, this.channelCollection);

                var selectedChannels = this.channelCollection.filter(isSelected);
                expect(selectedChannels).to.have.length(0);
            });
        });

        describe("selectCategory", function() {
            /** Fill chennel collection */
            beforeEach(function () {
                this.categoryCollection = this.benchmarkParsers.measureValues(categoryValuesMock());
            });

            it("should select categories", function() {
                var selectedItems = [{id: "1"}, {id: "2"}, {id: "36"}];
                this.benchmarkService.selectCategory(selectedItems, this.categoryCollection);

                var selectedCategories = this.categoryCollection.filter(isSelected);
                expect(selectedCategories).to.have.length(3);
            });
            it("should unselect all items if all items are selected", function() {
                var selectedItems = [{id: "1"}, {id: "2"}, {id: "3"}, {id: "4"}, {id: "36"}]; // All items are selected
                this.benchmarkService.selectCategory(selectedItems, this.categoryCollection);

                var selectedCategories = this.categoryCollection.filter(isSelected);
                expect(selectedCategories).to.have.length(0);
            });
            it("should unselect all items if no selected items are provided", function() {
                var selectedItems = []; // No selected items
                this.benchmarkService.selectCategory(selectedItems, this.categoryCollection);

                var selectedCategories = this.categoryCollection.filter(isSelected);
                expect(selectedCategories).to.have.length(0);
            });
        });

        describe("unselectAllDimensionValues", function() {
            /** Fill chennel collection */
            beforeEach(function () {
                this.categoryCollection = this.benchmarkParsers.measureValues(categoryValuesMock());
            });

            it("should unselect all items", function() {
                var selectedItems = [{id: "1"}, {id: "2"}, {id: "36"}];
                this.benchmarkService.selectCategory(selectedItems, this.categoryCollection);

                var selectedCategories = this.categoryCollection.filter(isSelected);
                expect(selectedCategories).to.have.length(3);

                this.benchmarkService.unselectAllDimensionValues(this.categoryCollection);
                selectedCategories = this.categoryCollection.filter(isSelected);
                expect(selectedCategories).to.have.length(0);
            });
        });

        describe("selectAdvertiser", function() {
            /** Fill chennel collection */
            beforeEach(function () {
                this.advertiserCollection = this.benchmarkParsers.measureValues(advertiserValuesMock());
            });

            it("should select advertisers", function() {
                var selectedItems = [{id: "1"}, {id: "2"}];
                this.benchmarkService.selectAdvertiser(selectedItems, this.advertiserCollection);
                expect(this.benchmarkService.selectedAdvertisers).to.have.length(2);
            });

            it("should not select advertiser if no selected items are provided", function() {
                var selectedItems = [];
                this.benchmarkService.selectAdvertiser(selectedItems, this.advertiserCollection);
                expect(this.benchmarkService.selectedAdvertisers).to.have.length(0);
            });

            it("should select advertisers if some of items in collection are not selected", function() {
                var selectedItems = [undefined, {id: "2"}];
                this.benchmarkService.selectAdvertiser(selectedItems, this.advertiserCollection);
                expect(this.benchmarkService.selectedAdvertisers).to.have.length(1);

                selectedItems = [{id: "1"}, undefined];
                this.benchmarkService.selectAdvertiser(selectedItems, this.advertiserCollection);
                expect(this.benchmarkService.selectedAdvertisers).to.have.length(1);
            });

        });

        describe("unselectAllAdvertisers", function() {
            /** Fill chennel collection */
            beforeEach(function () {
                this.advertiserCollection = this.benchmarkParsers.measureValues(advertiserValuesMock());
            });

            it("should unselect all advertisers", function() {
                var selectedItems = [{id: "1"}, {id: "2"}];

                this.benchmarkService.selectAdvertiser(selectedItems, this.advertiserCollection);
                expect(this.benchmarkService.selectedAdvertisers).to.have.length(2);

                this.benchmarkService.unselectAllAdvertisers(this.advertiserCollection);
                expect(this.benchmarkService.selectedAdvertisers).to.have.length(0);
            });
        });

        describe("getFiltersCollections", function() {
            it("should fetch all needed dimension values", function(done) {
                this.benchmarkService.getFiltersCollections().then(function(res) {
                    expect(res).to.have.all.keys("salesChannels", "platforms", "adFormats", "adSizes", "categories", "advertisers");
                    done();
                });
                this.$rootScope.$apply();
            });
        });

        describe("getAdvertisersByCategory", function() {
            it("should return all advertisers if categoryId = '0'", function(done) {
                this.benchmarkService.getAdvertisersByCategory("0").then(function(advertisers) {
                    expect(advertisers).to.have.length(4);
                    done();
                });
                this.$rootScope.$apply();
            });

            it("should return advertisers filtered by category", function(done) {
                this.benchmarkService.getAdvertisersByCategory("1,2,3").then(function(advertisers) {
                    expect(advertisers).to.have.length(2);
                    done();
                });
                this.$rootScope.$apply();
            });
        });

        describe("createSliceReport", function() {
            it("should update all services and change url", function(done) {
                var options = {
                    advertiser: {id: "advertiserId", filters: []},
                    channel: {id: "channelId", filters: []},
                    platform: {id: "platformId", filters: []},
                    adFormat: {id: "adFormatId", filters: []},
                    adSize: {id: "adSizeId", filters: []},
                    datepicker: {
                        startDate: new Date(2015, 5, 1, 0, 0, 0),
                        endDate: new Date(2015, 5, 30, 0, 0, 0),
                        optionIndex: 7
                    }
                };

                this.benchmarkService.createSliceReport(options).then(function(encodedData) {
                    expect(encodedData).to.equal("eyJkIjpbImFkdmVydGlzZXJJZCIsImRzcElkIiwiYXRkSWQiLCJjaGFubmVsSWQiLCJwbGF0Zm9ybUlkIiwiYWRGb3JtYXRJZCIsImFkU2l6ZUlkIl0sIm0iOlsicGFpZEltcHJlc3Npb25zIiwiZWNwbSIsInJldmVudWUiLCJhdmVyYWdlQmlkRWNwbUFkdiJdLCJmIjpbWyJmIiwiIiwidCIsMTAsIiIsIiIsW11dLFsidCIsIiIsInQiLDEwLCIiLCIiLFtdXSxbInQiLCIiLCJ0IiwxMCwiIiwiIixbXV0sWyJmIiwiIiwidCIsMTAsIiIsIiIsW11dLFsiZiIsIiIsInQiLDEwLCIiLCIiLFtdXSxbImYiLCIiLCJ0IiwxMCwiIiwiIixbXV0sWyJmIiwiIiwidCIsMTAsIiIsIiIsW11dXSwidCI6WzddLCJjdCI6W10sImMiOnsidCI6ImxpbmVjaGFydCIsImQiOiIiLCJhIjoiZGF0ZSIsIm0iOiIifSwiYSI6ImRhdGUifQ%3D%3D");
                    done();
                });
                this.$rootScope.$apply();
            });

            it("should update all services and change url if filters are not empty", function(done) {
                var options = {
                    advertiser: {id: "advertiserId", filters: []},
                    channel: {id: "channelId", filters: []},
                    platform: {id: "platformId", filters: []},
                    adFormat: {id: "adFormatId", filters: [{"id": "3", "value": "AdFormat-3"}]},
                    adSize: {id: "adSizeId", filters: [{"id": "1", "value": "AdSize-1"}]},
                    datepicker: {
                        startDate: new Date(2015, 5, 1, 0, 0, 0),
                        endDate: new Date(2015, 5, 30, 0, 0, 0),
                        optionIndex: 7
                    }
                };

                this.benchmarkService.createSliceReport(options).then(function(encodedData) {
                    expect(encodedData).to.equal("eyJkIjpbImFkdmVydGlzZXJJZCIsImRzcElkIiwiYXRkSWQiLCJjaGFubmVsSWQiLCJwbGF0Zm9ybUlkIiwiYWRGb3JtYXRJZCIsImFkU2l6ZUlkIl0sIm0iOlsicGFpZEltcHJlc3Npb25zIiwiZWNwbSIsInJldmVudWUiLCJhdmVyYWdlQmlkRWNwbUFkdiJdLCJmIjpbWyJmIiwiIiwidCIsMTAsIiIsIiIsW11dLFsidCIsIiIsInQiLDEwLCIiLCIiLFtdXSxbInQiLCIiLCJ0IiwxMCwiIiwiIixbXV0sWyJmIiwiIiwidCIsMTAsIiIsIiIsW11dLFsiZiIsIiIsInQiLDEwLCIiLCIiLFtdXSxbImYiLCIiLCJ0IiwxMCwiIiwiIixbIjMiXV0sWyJmIiwiIiwidCIsMTAsIiIsIiIsWyIxIl1dXSwidCI6WzddLCJjdCI6W10sImMiOnsidCI6ImxpbmVjaGFydCIsImQiOiIiLCJhIjoiZGF0ZSIsIm0iOiIifSwiYSI6ImRhdGUifQ%3D%3D");
                    done();
                });
                this.$rootScope.$apply();
            });

            it("should set advertisers to visible if advertiser > 1", function(done) {
                var options = {
                    advertiser: {id: "advertiserId", filters: [{"id": "3", "value": "Advertiser-3"}, {"id": "4", "value": "Advertiser-4"}]},
                    channel: {id: "channelId", filters: []},
                    platform: {id: "platformId", filters: []},
                    adFormat: {id: "adFormatId", filters: []},
                    adSize: {id: "adSizeId", filters: []},
                    datepicker: {
                        startDate: new Date(2015, 5, 1, 0, 0, 0),
                        endDate: new Date(2015, 5, 30, 0, 0, 0),
                        optionIndex: 7
                    }
                };

                this.benchmarkService.createSliceReport(options).then(function(encodedData) {
                    expect(encodedData).to.equal("eyJkIjpbImFkdmVydGlzZXJJZCIsImRzcElkIiwiYXRkSWQiLCJjaGFubmVsSWQiLCJwbGF0Zm9ybUlkIiwiYWRGb3JtYXRJZCIsImFkU2l6ZUlkIl0sIm0iOlsicGFpZEltcHJlc3Npb25zIiwiZWNwbSIsInJldmVudWUiLCJhdmVyYWdlQmlkRWNwbUFkdiJdLCJmIjpbWyJ0IiwiIiwidCIsMTAsIiIsIiIsWyIzIiwiNCJdXSxbInQiLCIiLCJ0IiwxMCwiIiwiIixbXV0sWyJ0IiwiIiwidCIsMTAsIiIsIiIsW11dLFsiZiIsIiIsInQiLDEwLCIiLCIiLFtdXSxbImYiLCIiLCJ0IiwxMCwiIiwiIixbXV0sWyJmIiwiIiwidCIsMTAsIiIsIiIsW11dLFsiZiIsIiIsInQiLDEwLCIiLCIiLFtdXV0sInQiOls3XSwiY3QiOltdLCJjIjp7InQiOiJsaW5lY2hhcnQiLCJkIjoiIiwiYSI6ImRhdGUiLCJtIjoiIn0sImEiOiJkYXRlIn0%3D");
                    done();
                });
                this.$rootScope.$apply();
            });
        });

        function isSelected (model) {
            return model.isSelected;
        }

        function channelValuesMock () {
            return [
                {
                    "id": "1",
                    "value": "PMP"
                }, {
                    "id": "2",
                    "value": "Spot Buys"
                }, {
                    "id": "3",
                    "value": "Open Exchange"
                }, {
                    "id": "4",
                    "value": "Ad Network"
                }
            ];
        }

        function categoryValuesMock() {
            return [
                {
                    "id": "1",
                    "value": "Alcohol"
                }, {
                    "id": "2",
                    "value": "Auto"
                }, {
                    "id": "3",
                    "value": "Consumer Products & Goods"
                }, {
                    "id": "4",
                    "value": "Cosmetic Procedures"
                }, {
                    "id": "36",
                    "value": "Coupons & Deals"
                }
            ];
        }

        function advertiserValuesMock() {
            return [
                {
                    "id": "1",
                    "value": "Advertiser-1"
                }, {
                    "id": "2",
                    "value": "Advertiser-2"
                }, {
                    "id": "3",
                    "value": "Advertiser-3"
                }, {
                    "id": "4",
                    "value": "Advertiser-4"
                }
            ];
        }

        function platformValuesMock() {
            return [
                {
                    "id": "1",
                    "value": "Platform-1"
                }, {
                    "id": "2",
                    "value": "Platform-2"
                }, {
                    "id": "3",
                    "value": "Platform-3"
                }, {
                    "id": "4",
                    "value": "Platform-4"
                }
            ];
        }

        function adFormatValuesMock() {
            return [
                {
                    "id": "1",
                    "value": "AdFormat-1"
                }, {
                    "id": "2",
                    "value": "AdFormat-2"
                }, {
                    "id": "3",
                    "value": "AdFormat-3"
                }, {
                    "id": "4",
                    "value": "AdFormat-4"
                }
            ];
        }

        function adSizeValuesMock() {
            return [
                {
                    "id": "1",
                    "value": "AdSize-1"
                }, {
                    "id": "2",
                    "value": "AdSize-2"
                }, {
                    "id": "3",
                    "value": "AdSize-3"
                }, {
                    "id": "4",
                    "value": "AdSize-4"
                }
            ];
        }

    });

}).call(this);
