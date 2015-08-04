/*global describe, beforeEach, it, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("modules.pubTableService", function () {

        beforeEach(function () {
            module("pubSlicerApp");
        });
        beforeEach(module("modules/pubNotifications/toast.html"));
        beforeEach(function () {
            inject(function(pubTableService, DimensionModel, historicTableParser, pubAnalyticService, $httpBackend) {
                pubAnalyticService.fetch();
                $httpBackend.flush();

                this.pubTableService = pubTableService;
                this.selectedDimensions = getSelectedDimensions(DimensionModel);
                this.responseGroupLevel1 = getResponseGroupLevel1(historicTableParser);
                this.responseGroupLevel2 = getResponseGroupLevel2(historicTableParser);
                this.responseGroupLevel3 = getResponseGroupLevel3(historicTableParser);
            });
        });

        describe("parseRows", function() {
            it("should inject dimensions into rows when group level = 1", function() {
                var rows;
                var options = {
                    dimensions: this.selectedDimensions,
                    groupingLevel: 1
                };
                // Check rows before parsing
                rows = this.responseGroupLevel1.rows;
                expect(rows[0]).to.have.length(4); // Advertiser, R, I, C
                expect(rows[1]).to.have.length(4); // Advertiser, R, I, C
                expect(rows[2]).to.have.length(4); // Advertiser, R, I, C
                // Parse rows
                rows = this.pubTableService.parseRows(rows, options);
                // Check rows after parsing
                expect(rows[0]).to.have.length(7); // Advertiser, Site, DSP, Ad Size, R, I, C
                expect(rows[1]).to.have.length(7); // Advertiser, Site, DSP, Ad Size, R, I, C
                expect(rows[2]).to.have.length(7); // Advertiser, Site, DSP, Ad Size, R, I, C
                // Check order of dimension in first row
                var row = rows[0];
                expect(row[0].measureId).to.equal("advertiserId");
                expect(row[1].measureId).to.equal("siteId");
                expect(row[2].measureId).to.equal("dspId");
                expect(row[3].measureId).to.equal("adSizeId");
                expect(row[4].measureId).to.equal("revenue");
                expect(row[5].measureId).to.equal("paidImpressions");
                expect(row[6].measureId).to.equal("ecpm");

                expect(row[0].value).to.equal("Advertiser-1111");
                expect(row[1].value).to.equal("");
                expect(row[2].value).to.equal("");
                expect(row[3].value).to.equal("");
                expect(row[4].value).to.equal("$34,477");
                expect(row[5].value).to.equal("28,214,534");
                expect(row[6].value).to.equal("$1.22");
            });

            it("should inject dimensions into rows when group level = 2", function() {
                var rows;
                var options = {
                    dimensions: this.selectedDimensions,
                    groupingLevel: 2
                };
                // Check rows before parsing
                rows = this.responseGroupLevel2.rows;
                expect(rows[0]).to.have.length(4); // Site, R, I, C
                expect(rows[1]).to.have.length(4); // Site, R, I, C
                expect(rows[2]).to.have.length(4); // Site, R, I, C
                // Parse rows
                rows = this.pubTableService.parseRows(rows, options);
                // Check rows after parsing
                expect(rows[0]).to.have.length(6); // Site, DSP, Ad Size, R, I, C
                expect(rows[1]).to.have.length(6); // Site, DSP, Ad Size, R, I, C
                expect(rows[2]).to.have.length(6); // Site, DSP, Ad Size, R, I, C
                // Check order of dimension in first row
                var row = rows[0];
                expect(row[0].measureId).to.equal("siteId");
                expect(row[1].measureId).to.equal("dspId");
                expect(row[2].measureId).to.equal("adSizeId");
                expect(row[3].measureId).to.equal("revenue");
                expect(row[4].measureId).to.equal("paidImpressions");
                expect(row[5].measureId).to.equal("ecpm");

                expect(row[0].value).to.equal("http://publisher-1111.com");
                expect(row[1].value).to.equal("");
                expect(row[2].value).to.equal("");
                expect(row[3].value).to.equal("$18,277");
                expect(row[4].value).to.equal("15,303,411");
                expect(row[5].value).to.equal("$1.19");
            });

            it("should inject dimensions into rows when group level = 3", function() {
                var rows;
                var options = {
                    dimensions: this.selectedDimensions,
                    groupingLevel: 3
                };
                // Check rows before parsing
                rows = this.responseGroupLevel3.rows;
                expect(rows[0]).to.have.length(4); // DSP, R, I, C
                expect(rows[1]).to.have.length(4); // DSP, R, I, C
                expect(rows[2]).to.have.length(4); // DSP, R, I, C
                // Parse rows
                rows = this.pubTableService.parseRows(rows, options);
                // Check rows after parsing
                expect(rows[0]).to.have.length(5); // DSP, Ad Size, R, I, C
                expect(rows[1]).to.have.length(5); // DSP, Ad Size, R, I, C
                expect(rows[2]).to.have.length(5); // DSP, Ad Size, R, I, C
                // Check order of dimension in first row
                var row = rows[0];
                expect(row[0].measureId).to.equal("dspId");
                expect(row[1].measureId).to.equal("adSizeId");
                expect(row[2].measureId).to.equal("revenue");
                expect(row[3].measureId).to.equal("paidImpressions");
                expect(row[4].measureId).to.equal("ecpm");

                expect(row[0].value).to.equal("DSP-1111");
                expect(row[1].value).to.equal("");
                expect(row[2].value).to.equal("$17,796");
                expect(row[3].value).to.equal("14,957,622");
                expect(row[4].value).to.equal("$1.19");
            });
        });

        describe("parseColumns", function() {
            it("should inject dimensions into columns", function() {
                var columns;
                var options = {
                    dimensions: this.selectedDimensions,
                    groupingLevel: 1
                };
                // Check columns before parsing
                columns = this.responseGroupLevel1.columns;
                expect(columns).to.have.length(4); // Advertiser, R, I, C
                // Parse columns
                columns = this.pubTableService.parseColumns(columns, options);
                // Check columns after parsing
                expect(columns).to.have.length(7); // Advertiser, Site, DSP, Ad Size, R, I, C
                // Check order of dimension in columns array
                expect(columns[0].id).to.equal("advertiserId");
                expect(columns[1].id).to.equal("siteId");
                expect(columns[2].id).to.equal("dspId");
                expect(columns[3].id).to.equal("adSizeId");
                expect(columns[4].id).to.equal("revenue");
                expect(columns[5].id).to.equal("paidImpressions");
                expect(columns[6].id).to.equal("ecpm");

                expect(columns[0].name).to.equal("Advertiser");
                expect(columns[1].name).to.equal("Site");
                expect(columns[2].name).to.equal("DSP");
                expect(columns[3].name).to.equal("Ad Size");
                expect(columns[4].name).to.equal("Revenue");
                expect(columns[5].name).to.equal("Paid Impressions");
                expect(columns[6].name).to.equal("eCPM");
            });
        });

        describe("parse", function() {
            it("should parse rows and columns", function() {
                var data;
                var options = {
                    dimensions: this.selectedDimensions,
                    groupingLevel: 1
                };

                // Check data before parsing
                data = this.responseGroupLevel1;
                expect(data.columns).to.have.length(4); // Advertiser, R, I, C
                expect(data.rows[0]).to.have.length(4); // Advertiser, R, I, C
                expect(data.rows[1]).to.have.length(4); // Advertiser, R, I, C
                expect(data.rows[2]).to.have.length(4); // Advertiser, R, I, C
                // Parse data
                data = this.pubTableService.parse(data, options);
                // Check data after parsing
                expect(data.columns).to.have.length(7); // Advertiser, Site, DSP, Ad Size, R, I, C
                expect(data.rows[0]).to.have.length(7); // Advertiser, Site, DSP, Ad Size, R, I, C
                expect(data.rows[1]).to.have.length(7); // Advertiser, Site, DSP, Ad Size, R, I, C
                expect(data.rows[2]).to.have.length(7); // Advertiser, Site, DSP, Ad Size, R, I, C
            });

            it("should parse rows and columns with default options", function() {
                var data = this.responseGroupLevel1;
                var options; // no options
                // Parse data
                data = this.pubTableService.parse(data, options);
                // Check data after parsing
                expect(data.columns).to.have.length(4); // Advertiser, R, I, C
                expect(data.rows[0]).to.have.length(4); // Advertiser, R, I, C
                expect(data.rows[1]).to.have.length(4); // Advertiser, R, I, C
                expect(data.rows[2]).to.have.length(4); // Advertiser, R, I, C
            });
        });

        function getSelectedDimensions(DimensionModel) {
            var dimensions = [
                {
                    apiName: "advertiserId",
                    displayValue: "Advertiser"
                },
                {
                    apiName: "siteId",
                    displayValue: "Site"
                },
                {
                    apiName: "dspId",
                    displayValue: "DSP"
                },
                {
                    apiName: "adSizeId",
                    displayValue: "Ad Size"
                }
            ];

            return dimensions.map(function(dimension) {
                return DimensionModel.newInstance(dimension);
            });
        }

        function getResponseGroupLevel1(historicTableParser) {
            return historicTableParser({
                "columns": ["advertiserId", "revenue", "paidImpressions", "ecpm"],
                "rows": [
                    ["1111", 34477.09811, 2.8214534E7, 1.221962],
                    ["2222", 25603.186608, 2.4549532E7, 1.04292],
                    ["3333", 22122.130999, 1.6510322E7, 1.339897]
                ],
                "displayValue": {
                    "advertiserId": {
                        "1111": "Advertiser-1111",
                        "2222": "Advertiser-2222",
                        "3333": "Advertiser-3333"
                    }
                },
                "currency": "USD",
                "alert": null,
                "dataFreshness": {
                    "dataFreshnessHour": "2015-06-01T22",
                    "timeZone": "PST"
                }
            });
        }

        function getResponseGroupLevel2(historicTableParser) {
            return historicTableParser({
                "columns": ["siteId", "revenue", "paidImpressions", "ecpm"],
                "rows": [
                    ["1111", 18277.257597, 1.5303411E7, 1.194326],
                    ["2222", 8978.2003, 7459371.0, 1.203614],
                    ["3333", 8692.402007, 4057295.0, 2.142413]
                ],
                "displayValue": {
                    "siteId": {
                        "1111": "http://publisher-1111.com",
                        "2222": "http://publisher-2222.com",
                        "3333": "http://publisher-3333.com"
                    }
                },
                "currency": "USD",
                "alert": null,
                "dataFreshness": {
                    "dataFreshnessHour": "2015-06-01T22",
                    "timeZone": "PST"
                }
            });
        }

        function getResponseGroupLevel3(historicTableParser) {
            return historicTableParser({
                "columns": ["dspId", "revenue", "paidImpressions", "ecpm"],
                "rows": [
                    ["1111", 17796.0242, 1.4957622E7, 1.189763],
                    ["2222", 186.101126, 202670.0, 0.918247],
                    ["3333", 136.100637, 47271.0, 2.879157]
                ],
                "displayValue": {
                    "dspId": {
                        "1111": "DSP-1111",
                        "2222": "DSP-2222",
                        "3333": "DSP-3333"
                    }
                },
                "currency": "USD",
                "alert": null,
                "dataFreshness": {
                    "dataFreshnessHour": "2015-06-01T22",
                    "timeZone": "PST"
                }
            });
        }
    });

}).call(this);