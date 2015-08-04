/*global describe, beforeEach, it, expect, inject*/
/*jshint expr: true */
(function() {
    "use strict";

    describe("domain.DimensionsCollection", function() {

        beforeEach(function() {
            module("pub-ui-analytics.domain");
        });

        beforeEach(function() {
            inject(function($httpBackend, pubAnalyticService) {
                pubAnalyticService.fetch();
                $httpBackend.flush();

                this.dimensions = pubAnalyticService.getHistoricDimensions();
            });
        });

        it("should be registered in the 'domain' module", function() {
            expect(this.dimensions).to.be.an("object");
        });

        it("should not be empty after fetching", function() {
            // See mock data - pubAnalytic-service-mock.js
            expect(this.dimensions.models).have.length(29);
        });

        describe("reset", function() {
            it("should clear collection", function() {
                expect(this.dimensions.models).have.length(29);
                this.dimensions.reset();
                expect(this.dimensions.models).have.length(0);
            });

            it("should add new items to collection", function() {
                this.dimensions.reset([
                    {apiName: "d1", order: 0},
                    {apiName: "d2"},
                    {apiName: "d3"}
                ]);
                expect(this.dimensions.models).have.length(3);
            });

            it("should override existion models", function() {
                var model;
                expect(this.dimensions.models).have.length(29);
                model = this.dimensions.models[0];
                expect(model.getId()).to.equal("date");

                this.dimensions.reset([{apiName: "d1"}]);
                expect(this.dimensions.models).have.length(1);
                model = this.dimensions.models[0];
                expect(model.getId()).to.equal("d1");
            });
        });

        describe("getSelectedDimensions", function() {
            it("should be no selected dimensions by Default", function() {
                var models = this.dimensions.getSelectedDimensions();
                expect(models).have.length(0);
            });

            it("should return selected dimensions", function() {
                var model, models;
                model = this.dimensions.models[0];
                model.setSelected(true);

                models = this.dimensions.getSelectedDimensions();
                expect(models).have.length(1);
            });
        });

        describe("hasInvalidHeatmapDimensions", function() {
            it("should be invalid if there are less then 2 selected dimension", function() {
                // No selected dimensions
                expect(this.dimensions.hasInvalidHeatmapDimensions()).to.equal(true);
                this.dimensions.models[0].setSelected(true);
                // There is one selected dimensin in collection
                expect(this.dimensions.hasInvalidHeatmapDimensions()).to.equal(true);
                this.dimensions.models[1].setSelected(true);
                // There are two selected dimensins in collection
                expect(this.dimensions.hasInvalidHeatmapDimensions()).to.equal(false);
            });
        });

        describe("hasTimeunitHeatmapDimensions", function() {
            it("should find if time unit dimensions are selected", function() {
                var model;
                // Select dimension from `buyer` group
                model = this.dimensions.models.filter(function(m) { return m.getId() === "advertiserId"; })[0];
                model.setSelected(true);
                expect(this.dimensions.hasFirstTimeunitHeatmapDimensions()).to.equal(false);
                // Unselect dimension;
                model.setSelected(false);

                // Select dimension from `timeUnits` group
                model = this.dimensions.models.filter(function(m) { return m.getId() === "hour"; })[0];
                model.setSelected(true);
                expect(this.dimensions.hasFirstTimeunitHeatmapDimensions()).to.equal(true);
            });
        });

        describe("getVisibleDimensions", function() {
            it("should be no мisible dimensions by Default", function() {
                var models = this.dimensions.getVisibleDimensions();
                expect(models).have.length(0);
            });

            it("should return selected dimensions", function() {
                var model, models;
                model = this.dimensions.models[0];
                model.setSelected(true);
                model.setVisible(true);

                models = this.dimensions.getVisibleDimensions();
                expect(models).have.length(1);
            });
        });

        describe("getInvisibleDimensions", function() {
            it("should be no мisible dimensions by Default", function() {
                var models = this.dimensions.getInvisibleDimensions();
                expect(models).have.length(0);
            });

            it("should return selected dimensions", function() {
                var model, models;
                model = this.dimensions.models[0];
                model.setSelected(true);
                model.setVisible(false);

                models = this.dimensions.getInvisibleDimensions();
                expect(models).have.length(1);
            });
        });

        describe("findDimensionByName", function() {
            it("should return model if dimension exists", function() {
                var model;
                model = this.dimensions.findDimensionByName("Advertiser");
                expect(model.getId()).to.equal("advertiserId");

                model = this.dimensions.findDimensionByName("Date");
                expect(model.getId()).to.equal("date");

                model = this.dimensions.findDimensionByName("AAAAAAAAAAAAA");
                expect(model).to.equal(undefined);
            });
        });

        describe("getDimensionsWithGroups", function() {
            it("should be 8 groups", function() {
                var groups = this.dimensions.getDimensionsWithGroups();
                expect(groups).have.length(8);

                expect(groups[0].groupModel.getName()).to.equal("Ad Attributes");
                expect(groups[1].groupModel.getName()).to.equal("Buyer");
                expect(groups[2].groupModel.getName()).to.equal("General");
                expect(groups[3].groupModel.getName()).to.equal("Geography");
                expect(groups[4].groupModel.getName()).to.equal("Inventory");
                expect(groups[5].groupModel.getName()).to.equal("Mobile");
                expect(groups[6].groupModel.getName()).to.equal("Time Units");
                expect(groups[7].groupModel.getName()).to.equal("Automated Guaranteed");
            });
        });

        describe("getIdByUserType", function() {
            it("should return id of user type", function() {
                this.dimensions.userType = "buyer";
                expect(this.dimensions.getIdByUserType()).to.equal("atdId");

                this.dimensions.userType = "dsp";
                expect(this.dimensions.getIdByUserType()).to.equal("dspId");

                this.dimensions.userType = "publisher";
                expect(this.dimensions.getIdByUserType()).to.equal("pubId");
            });
        });

        describe("isValid", function() {
            it("should be valid if 5 (or less) visible dimensions and 5 (or less) invisible dimensions are selected", function() {
                // Set visible dimensions
                this.dimensions.models[0].setSelected(true);
                this.dimensions.models[0].setVisible(true);
                this.dimensions.models[1].setSelected(true);
                this.dimensions.models[1].setVisible(true);
                this.dimensions.models[2].setSelected(true);
                this.dimensions.models[2].setVisible(true);
                this.dimensions.models[3].setSelected(true);
                this.dimensions.models[3].setVisible(true);
                this.dimensions.models[4].setSelected(true);
                this.dimensions.models[4].setVisible(true);
                // Set invisible dimensions
                this.dimensions.models[5].setSelected(true);
                this.dimensions.models[5].setVisible(false);
                this.dimensions.models[6].setSelected(true);
                this.dimensions.models[6].setVisible(false);
                this.dimensions.models[7].setSelected(true);
                this.dimensions.models[7].setVisible(false);
                this.dimensions.models[8].setSelected(true);
                this.dimensions.models[8].setVisible(false);
                this.dimensions.models[9].setSelected(true);
                this.dimensions.models[9].setVisible(false);

                expect(this.dimensions.isValid()).to.equal(true);

                // Set one more
                this.dimensions.models[10].setSelected(true);
                this.dimensions.models[10].setVisible(false);

                expect(this.dimensions.isValid()).to.equal(false);
                
            });
        });

        
    });

}).call(this);
