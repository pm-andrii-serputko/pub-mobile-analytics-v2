/*global describe, beforeEach, it, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Model: DimensionModel", function () {
        
        var Model, attr;

        attr = {
            apiName: "siteId",
            displayValue: "Site"
        };
        // load the module
        beforeEach(function () {
            module("pub-ui-analytics");
        });

        /** inject model*/
        beforeEach(function () {
            inject(function(DimensionModel) {
                Model = DimensionModel;
            });
        });

        
        it("should have method newInstance", function () {
            expect(Model.newInstance).to.be.a("function");
            expect(Model.newInstance()).to.be.an("object");
        });

        it("should have default attributes", function () {
            var model = Model.newInstance();

            expect(model.attributes.id).to.equal("");
            expect(model.attributes.name).to.equal("");
            expect(model.attributes.additionalMetric).to.equal("");
            expect(model.attributes.selected).to.equal(false);
            expect(model.attributes.visible).to.equal(false);
            expect(model.attributes.order).to.equal(-1);
            expect(model.attributes.filter).to.be.a("object");
        });

        describe("parse", function () {
            var model;
            beforeEach(function () {
                model = Model.newInstance(attr);
            });

            it("should return the attributes hash to be set on the model", function () {
                expect(model.attributes.id).to.equal("siteId");
                expect(model.attributes.name).to.equal("Site");
                expect(model.attributes.additionalMetric).to.equal("");
                expect(model.attributes.selected).to.equal(false);
                expect(model.attributes.visible).to.equal(false);
                expect(model.attributes.order).to.equal(-1);
                expect(model.attributes.filter).to.be.a("object");
            });
        });

        describe("getters", function () {
            var model;
            beforeEach(function () {
                model = Model.newInstance(attr);
            });

            it("should return the attributes hash to be set on the model", function () {
                expect(model.getId()).to.equal("siteId");
                expect(model.getName()).to.equal("Site");
                expect(model.getAdditionalMetric()).to.equal("");
                expect(model.getSelected()).to.equal(false);
                expect(model.getVisible()).to.equal(false);
                expect(model.getOrder()).to.equal(-1);
                expect(model.getFilter()).to.be.a("object");
            });
        });

        describe("setters", function () {
            var model;
            beforeEach(function () {
                model = Model.newInstance(attr);
            });

            it("should return the attributes hash to be set on the model", function () {
                expect(model.getId()).to.equal("siteId");
                model.setId("dspId");
                expect(model.getId()).to.equal("dspId");

                expect(model.getName()).to.equal("Site");
                model.setName("DSP");
                expect(model.getName()).to.equal("DSP");

                expect(model.getAdditionalMetric()).to.equal("");
                model.setAdditionalMetric("DOM");
                expect(model.getAdditionalMetric()).to.equal("DOM");

                expect(model.getSelected()).to.equal(false);
                model.setSelected(true);
                expect(model.getSelected()).to.equal(true);

                expect(model.getVisible()).to.equal(false);
                model.setVisible(true);
                expect(model.getVisible()).to.equal(true);

                expect(model.getOrder()).to.equal(-1);
                model.setOrder(10);
                expect(model.getOrder()).to.equal(10);

                expect(model.getFilter()).to.be.a("object");
                model.setFilter({});
                expect(model.getFilter()).to.be.a("object");
            });
        });

    });


}).call(this);