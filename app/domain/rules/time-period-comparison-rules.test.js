/*global describe, beforeEach, it, expect, inject*/
(function () {
    "use strict";

    describe("domain.rules.timePeriodComparisonRules", function () {

        beforeEach(function () {
            module("pub-ui-analytics.domain");
        });

        beforeEach(function () {
            inject(function(timePeriodComparisonRules) {
                this.timePeriodComparisonRules = timePeriodComparisonRules;
            });
        });

        it("should have 'execute' method", function() {
            expect(this.timePeriodComparisonRules.execute).to.be.a("function");
        });

        it("should have opposite Sign", function() {
            expect(this.timePeriodComparisonRules.execute("lostBidsByFloor", 1)).to.equal(-1);
            expect(this.timePeriodComparisonRules.execute("lostBidsByAuction", 10)).to.equal(-10);
            expect(this.timePeriodComparisonRules.execute("lostBidsByBlockList", 100)).to.equal(-100);
            expect(this.timePeriodComparisonRules.execute("lostBidsByDWLF", 1000)).to.equal(-1000);
            expect(this.timePeriodComparisonRules.execute("totalLostBidsAtd", 10000)).to.equal(-10000);
            expect(this.timePeriodComparisonRules.execute("totalLostBidsAdv", 100000)).to.equal(-100000);
            expect(this.timePeriodComparisonRules.execute("totalLostBidsDsp", 10000)).to.equal(-10000);
            expect(this.timePeriodComparisonRules.execute("bidLossRateAtd", 1000)).to.equal(-1000);
            expect(this.timePeriodComparisonRules.execute("bidLossRateAdv", 100)).to.equal(-100);
            expect(this.timePeriodComparisonRules.execute("bidLossRateDsp", 10)).to.equal(-10);
        });

        it("should have the same Sign", function() {
            expect(this.timePeriodComparisonRules.execute("siteId", 20)).to.equal(20);
            expect(this.timePeriodComparisonRules.execute("dspId", 20)).to.equal(20);
            expect(this.timePeriodComparisonRules.execute("advertiserId", 20)).to.equal(20);
        });

    });

}).call(this);
