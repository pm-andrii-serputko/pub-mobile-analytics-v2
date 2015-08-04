/*global describe, beforeEach, it, expect, inject*/
(function () {
    "use strict";

    describe("domain.BenchmarkMeasureValueModel", function () {

        beforeEach(function () {
            module("pub-ui-analytics.domain");
        });

        beforeEach(function () {
            inject(function(BenchmarkMeasureValueModel) {

                this.BenchmarkMeasureValueModel = BenchmarkMeasureValueModel;
                this.mock = {
                    id: 1111,
                    value: 1.2,
                    avgCompValue: 1.5,
                    minCompValue: 1.1,
                    maxCompValue: 1.7,
                    absolutMinValue: 0,
                    absolutMaxValue: 2,
                    type: "metric",
                    measureId: "ecpm"
                };
            });
        });

        it("should be registered in the 'domain' module", function () {
            expect(this.BenchmarkMeasureValueModel).to.be.a("function");
        });

        it("should have default values", function () {
            var model = new this.BenchmarkMeasureValueModel();

            expect(model).to.be.an("object");
            expect(model.id).to.equal(null);
            expect(model.value).to.equal("");
            expect(model.avgCompValue).to.equal(0);
            expect(model.minCompValue).to.equal(0);
            expect(model.maxCompValue).to.equal(0);
            expect(model.absolutMinValue).to.equal(0);
            expect(model.absolutMaxValue).to.equal(0);
            expect(model.type).to.equal("");
            expect(model.measureId).to.equal(null);
            expect(model.isMetric).to.equal(false);
            expect(model.isDimension).to.equal(false);
        });

        it("should set passed attributes", function () {
            var model = new this.BenchmarkMeasureValueModel();
            model.set(this.mock);

            expect(model.id).to.equal(1111);
            expect(model.value).to.equal(1.2);
            expect(model.avgCompValue).to.equal(1.5);
            expect(model.minCompValue).to.equal(1.1);
            expect(model.maxCompValue).to.equal(1.7);
            expect(model.absolutMinValue).to.equal(0);
            expect(model.absolutMaxValue).to.equal(2);
            expect(model.type).to.equal("metric");
            expect(model.measureId).to.equal("ecpm");
            expect(model.isMetric).to.equal(true);
            expect(model.isDimension).to.equal(false);
        });

        describe("decorate", function () {
            it("should be defined", function () {
                var model = new this.BenchmarkMeasureValueModel();
                expect(model.decorate).to.be.a("function");
            });

            it("should have decorators", function () {
                expect(this.BenchmarkMeasureValueModel.decorators).to.be.an("object");
                expect(this.BenchmarkMeasureValueModel.decorators).to.include.keys(["formatedValue"]);
            });

            it("should have 'formatedValue' decorator", function () {
                var model = new this.BenchmarkMeasureValueModel();
                model.set(this.mock);
                model = model.decorate("formatedValue");
                expect(model.value).to.equal("R1.20"); // where `R` is currency
            });
        });

    });

}).call(this);