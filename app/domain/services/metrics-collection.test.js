/*global describe, beforeEach, afterEach, it, expect, inject*/
/*jshint expr: true */
(function() {
    "use strict";

    describe("domain.MetricsCollection", function() {

        beforeEach(function() {
            module("pub-ui-analytics.domain");
        });

        beforeEach(function() {
            inject(function($httpBackend, pubAnalyticService) {
                pubAnalyticService.fetch();
                $httpBackend.flush();

                this.metrics = pubAnalyticService.getHistoricMetrics();
            });
        });

        it("should be registered in the 'domain' module", function() {
            expect(this.metrics).to.be.an("object");
        });

        it("should not be empty after fetching", function() {
            // See mock data - pubAnalytic-service-mock.js
            expect(this.metrics.models).have.length(43);
        });

        describe("reset", function() {
            it("should clear collection", function() {
                expect(this.metrics.models).have.length(43);
                this.metrics.reset();
                expect(this.metrics.models).have.length(0);
            });

            it("should add new items to collection", function() {
                this.metrics.reset([
                    {apiName: "m1", order: 0},
                    {apiName: "m2"},
                    {apiName: "m3"}
                ]);
                expect(this.metrics.models).have.length(3);
            });

            it("should override existion models", function() {
                var model;
                expect(this.metrics.models).have.length(43);
                model = this.metrics.models[0];
                expect(model.getId()).to.equal("paidImpressions");

                this.metrics.reset([{apiName: "m1"}]);
                expect(this.metrics.models).have.length(1);
                model = this.metrics.models[0];
                expect(model.getId()).to.equal("m1");
            });
        });

        describe("getSelectedMetrics", function() {
            it("should be no selected metrics by Default", function() {
                var models = this.metrics.getSelectedMetrics();
                expect(models).have.length(0);
            });

            it("should return selected metrics", function() {
                var model, models;
                model = this.metrics.models[0];
                model.setSelected(true);

                models = this.metrics.getSelectedMetrics();
                expect(models).have.length(1);
            });
        });

        describe("findMetricByName", function() {
            it("should return model if metric exists", function() {
                var model;
                model = this.metrics.findMetricByName("Paid Impressions");
                expect(model.getId()).to.equal("paidImpressions");

                model = this.metrics.findMetricByName("eCPM");
                expect(model.getId()).to.equal("ecpm");

                model = this.metrics.findMetricByName("AAAAAAAAAAAAA");
                expect(model).to.equal(undefined);
            });
        });

        describe("findMetricById", function() {
            it("should return model if metric exists", function() {
                var model;
                model = this.metrics.findMetricById("paidImpressions");
                expect(model.getName()).to.equal("Paid Impressions");

                model = this.metrics.findMetricById("ecpm");
                expect(model.getName()).to.equal("eCPM");

                model = this.metrics.findMetricById("AAAAAAAAAAAAA");
                expect(model).to.equal(undefined);
            });
        });

        describe("getDefaultMetricList", function() {
            afterEach(function() {
                this.metrics.userType = "publisher";
                this.metrics.isAG = false;
            });

            it("should return `revenue`, `paidImpressions`, `ecpm` if user type is `publisher`", function() {
                this.metrics.userType = "publisher";

                var metrics = this.metrics.getDefaultMetricList();
                expect(metrics[0].getId()).to.equal("revenue");
                expect(metrics[1].getId()).to.equal("paidImpressions");
                expect(metrics[2].getId()).to.equal("ecpm");

            });

            it("should return `bookedImpressions`, `sales` if user type is `publisher`", function() {
                this.metrics.isAG = true;

                var metrics = this.metrics.getDefaultMetricList();
                expect(metrics[0].getId()).to.equal("bookedImpressions");
                expect(metrics[1].getId()).to.equal("sales");

            });
        });

        describe("getDefaultIdList", function() {
            afterEach(function() {
                this.metrics.userType = "publisher";
                this.metrics.isAG = false;
            });

            it("should return `revenue`, `paidImpressions`, `ecpm` if user type is `publisher`", function() {
                this.metrics.userType = "publisher";

                var metrics = this.metrics.getDefaultIdList();
                expect(metrics[0]).to.equal("revenue");
                expect(metrics[1]).to.equal("paidImpressions");
                expect(metrics[2]).to.equal("ecpm");

            });
            
            it("should return `bookedImpressions`, `sales` if user type is `publisher`", function() {
                this.metrics.isAG = true;

                var metrics = this.metrics.getDefaultIdList();
                expect(metrics[0]).to.equal("bookedImpressions");
                expect(metrics[1]).to.equal("sales");

            });
        });

        describe("getMetricsWithGroups", function() {
            afterEach(function() {
                this.metrics.isAG = false;
            });

            it("should be 3 groups if no AG metrics", function() {
                var groups = this.metrics.getMetricsWithGroups();
                expect(groups).have.length(3);

                expect(groups[0].groupModel.getName()).to.equal("Standard Metrics");
                expect(groups[1].groupModel.getName()).to.equal("Bid Metrics");
                expect(groups[2].groupModel.getName()).to.equal("Bid Metrics");
            });

            it("should be 1 groups if AG metrics exist", function() {
                this.metrics.isAG = true;
                var groups = this.metrics.getMetricsWithGroups();
                expect(groups).have.length(1);

                expect(groups[0].groupModel.getName()).to.equal("Automated Guaranteed Metrics");
            });
        });

    });

}).call(this);
