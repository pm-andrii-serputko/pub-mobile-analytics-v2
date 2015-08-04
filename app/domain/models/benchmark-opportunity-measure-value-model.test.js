/*global describe, beforeEach, it, expect, inject*/
(function () {
    "use strict";

    describe("domain.BenchmarkOpportunityMeasureValueModel", function () {

        beforeEach(function () {
            module("pub-ui-analytics.domain");
        });

        beforeEach(function () {
            inject(function(BenchmarkOpportunityMeasureValueModel) {

                this.BenchmarkOpportunityMeasureValueModel = BenchmarkOpportunityMeasureValueModel;
                this.mock = {
                    id: 1111,
                    value: 2.70,
                    measureId: "ecpm",
                    type: "metric",
                    measureValue: "ECPM",
                    potential: 3.54,
                    opportunity: 0.84
                };
            });
        });

        it("should have default values", function () {
            var model = new this.BenchmarkOpportunityMeasureValueModel();

            expect(model).to.be.an("object");
            expect(model.id).to.equal(null);
            expect(model.value).to.equal("");
            expect(model.type).to.equal("");
            expect(model.measureId).to.equal(null);
            expect(model.isMetric).to.equal(false);
            expect(model.isDimension).to.equal(false);
            expect(model.measureValue).to.equal("");
            expect(model.potential).to.equal(0);
            expect(model.opportunity).to.equal(0);
        });

        it("should set passed attributes", function () {
            var model = new this.BenchmarkOpportunityMeasureValueModel();
            model.set(this.mock);

            expect(model).to.be.an("object");
            expect(model.id).to.equal(1111);
            expect(model.value).to.equal(2.70);
            expect(model.type).to.equal("metric");
            expect(model.measureId).to.equal("ecpm");
            expect(model.isMetric).to.equal(true);
            expect(model.isDimension).to.equal(false);
            expect(model.measureValue).to.equal("ECPM");
            expect(model.potential).to.equal(3.54);
            expect(model.opportunity).to.equal(0.84);
        });

        describe("valuePercentage, potentialPercentage, opportunityPercentage", function() {
            it("should have formatted values", function() {
                var model = new this.BenchmarkOpportunityMeasureValueModel();
                model.set(this.mock);

                expect(model.valuePercentage).to.equal("76.3%");
                expect(model.potentialPercentage).to.equal("100.0%");
                expect(model.opportunityPercentage).to.equal("23.7%");
            });

            it("should return N/A if values are incorrect", function() {
                this.mock.value = null;
                this.mock.potential = undefined;
                this.mock.opportunity = null;

                var model = new this.BenchmarkOpportunityMeasureValueModel();
                model.set(this.mock);

                expect(model.valuePercentage).to.equal("N/A");
                expect(model.potentialPercentage).to.equal("N/A");
                expect(model.opportunityPercentage).to.equal("N/A");
            });
        });

        describe("decorates", function () {

            it("should have decorators", function () {
                expect(this.BenchmarkOpportunityMeasureValueModel.decorators).to.be.an("object");
                expect(this.BenchmarkOpportunityMeasureValueModel.decorators).to.include.keys(["formatedValue"]);
            });

            it("should have 'formatedValue' decorator", function () {
                var model = new this.BenchmarkOpportunityMeasureValueModel();
                model.set(this.mock);
                model = model.decorate("formatedValue");
                
                expect(model.value).to.equal("R2.70"); // where `R` is currency
                expect(model.potential).to.equal("R3.54");
                expect(model.opportunity).to.equal("R0.84");
            });

            it("should return N/A if values are incorrect", function() {
                this.mock.value = null;
                this.mock.potential = undefined;
                this.mock.opportunity = null;

                var model = new this.BenchmarkOpportunityMeasureValueModel();
                model.set(this.mock);
                model = model.decorate("formatedValue");

                expect(model.value).to.equal("N/A");
                expect(model.potential).to.equal("N/A");
                expect(model.opportunity).to.equal("N/A");
            });
        });

    });

}).call(this);