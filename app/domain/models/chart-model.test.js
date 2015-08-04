/*global describe, beforeEach, afterEach, it, expect, inject*/
(function () {
    "use strict";

    describe("domain.chartModel", function () {

        beforeEach(function () {
            module("pub-ui-analytics.domain");
        });

        beforeEach(function () {
            inject(function(chartModel) {
                this.chartModel = chartModel;
            });
        });

        afterEach(function() {
            this.chartModel.attributes = {
                type: "linechart",
                dimension: "",
                aggregation: "date",
                metric: "",
                changeChart: false,
                isDefaultChart: true,
                timeList: [],
                isDualScale: false,
                dualScaleMetric: ""
            };
        });

        it("should have setters and getters", function () {
            this.chartModel.setType("barchart");
            this.chartModel.setDimension("advertiserId");
            this.chartModel.setAggregation("hour");
            this.chartModel.setMetric("ecpm");
            this.chartModel.setIsDualScale(true);
            this.chartModel.setDualScaleMetric("revenue");
            this.chartModel.setChangeChart(true);
            this.chartModel.setIsDefaultChart(false);
            this.chartModel.setTimeList("[1,2,3,4,5]");

            expect(this.chartModel.getType()).to.equal("barchart");
            expect(this.chartModel.getDimension()).to.equal("advertiserId");
            expect(this.chartModel.getAggregation()).to.equal("hour");
            expect(this.chartModel.getMetric()).to.equal("ecpm");
            expect(this.chartModel.getIsDualScale()).to.equal(true);
            expect(this.chartModel.getDualScaleMetric()).to.equal("revenue");
            expect(this.chartModel.getChangeChart()).to.equal(true);
            expect(this.chartModel.getIsDefaultChart()).to.equal(false);
            expect(this.chartModel.getTimeList()).to.equal("[1,2,3,4,5]");
        });
    });

}).call(this);