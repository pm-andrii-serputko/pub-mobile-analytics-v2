/*global describe, it, beforeEach, afterEach, expect, inject, sinon*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("modules.pubDimensionItem", function () {

        /** Load module */
        beforeEach(function () {
            module("pubSlicerApp");
        });
        beforeEach(module("modules/pubNotifications/toast.html"));

        /** Initialize scope, spy, DOM, fetch data to services */
        beforeEach(function () {
            inject(function($compile, $rootScope, $httpBackend, pubAnalyticService, historicMeasuresService, slicerURLParamsService, DimensionModel, DateModel) {
                this.$scope = $rootScope.$new();
                this.$scope.dimensionModel = DimensionModel.newInstance({apiName: "siteId", displayValue: "Site"});
                this.$scope.slicerURLParamsService = slicerURLParamsService;
                this.dateService = DateModel;
                this.DimensionModel = DimensionModel;
                this.historicMeasuresService = historicMeasuresService;

                sinon.spy(this.$scope.slicerURLParamsService, "save");
                sinon.spy(this.historicMeasuresService, "selectDimension");
                sinon.spy(this.historicMeasuresService, "unselectDimension");
                sinon.spy(this.dateService, "setAggregation");
                sinon.spy(this.dateService, "setSelectedRangeId");
                sinon.spy(this.dateService, "setSelectedRangeName");

                this.element = angular.element("<div pub-dimension-item></div>");
                $compile(this.element)(this.$scope);

                pubAnalyticService.fetch();
                $httpBackend.flush();
            });
        });

        /** Remove all spies, stubes, mockes*/
        afterEach(function() {
            this.$scope.slicerURLParamsService.save.restore();
            this.historicMeasuresService.selectDimension.restore();
            this.historicMeasuresService.unselectDimension.restore();
            this.dateService.setAggregation.restore();
            this.dateService.setSelectedRangeId.restore();
            this.dateService.setSelectedRangeName.restore();
        });

        describe("$scope", function() {
            it("have dimensionModel", function() {
                expect(this.$scope.dimensionModel).to.be.an("object");
                expect(this.$scope.dimensionModel.getId()).to.equal("siteId");
                expect(this.$scope.dimensionModel.getName()).to.equal("Site");
                expect(this.$scope.dimensionModel.getSelected()).to.equal(false);
            });
        });

        describe("toggle", function() {
            it("should save changes to slicerURLParamsService", function() {
                this.$scope.toggle();
                expect(this.$scope.slicerURLParamsService.save).to.have.been.called;
                expect(this.historicMeasuresService.selectDimension).to.have.been.called;
                expect(this.historicMeasuresService.unselectDimension).to.have.not.been.called;
            });

            describe("when dimension is disabled", function() {
                beforeEach(function () {
                    this.$scope.dimensionModel = this.DimensionModel.newInstance({
                        apiName: "siteId",
                        displayValue: "Site",
                        disabled: true
                    });
                });

                it("should do nothing", function() {
                    this.$scope.toggle();
                    expect(this.$scope.slicerURLParamsService.save).to.have.not.been.called;
                    expect(this.historicMeasuresService.selectDimension).to.have.not.been.called;
                    expect(this.historicMeasuresService.unselectDimension).to.have.not.been.called;
                });
            });

            describe("when dimension is hour", function() {
                beforeEach(function () {
                    this.$scope.dimensionModel = this.DimensionModel.newInstance({
                        apiName: "hour",
                        apiGroupName: "timeUnits"
                    });
                });

                it("should update dateService", function() {
                    this.$scope.toggle();
                    expect(this.dateService.setSelectedRangeId).to.have.been.calledWith(0);
                    expect(this.dateService.setSelectedRangeName).to.have.been.calledWith("Today");
                });
            });

            describe("when dimension is date", function() {
                beforeEach(function () {
                    this.$scope.dimensionModel = this.DimensionModel.newInstance({
                        apiName: "date",
                        apiGroupName: "timeUnits"
                    });
                });

                it("should update dateService", function() {
                    this.$scope.toggle();
                    expect(this.dateService.setAggregation).to.have.been.calledWith("date");
                    expect(this.dateService.setSelectedRangeId).to.have.been.calledWith(2);
                    expect(this.dateService.setSelectedRangeName).to.have.been.calledWith("Last 7 days");
                });
            });

            describe("when dimension is week", function() {
                beforeEach(function () {
                    this.$scope.dimensionModel = this.DimensionModel.newInstance({
                        apiName: "week",
                        apiGroupName: "timeUnits"
                    });
                });

                it("should update dateService", function() {
                    this.$scope.toggle();
                    expect(this.dateService.setSelectedRangeId).to.have.been.calledWith(4);
                    expect(this.dateService.setSelectedRangeName).to.have.been.calledWith("Last Week");
                });
            });

            describe("when dimension is month", function() {
                beforeEach(function () {
                    this.$scope.dimensionModel = this.DimensionModel.newInstance({
                        apiName: "month",
                        apiGroupName: "timeUnits"
                    });
                });

                it("should update dateService", function() {
                    this.$scope.toggle();
                    expect(this.dateService.setSelectedRangeId).to.have.been.calledWith(5);
                    expect(this.dateService.setSelectedRangeName).to.have.been.calledWith("Last Month");
                });
            });

            describe("when dimension(timeUnits) is selected", function() {
                beforeEach(function () {
                    this.$scope.dimensionModel = this.DimensionModel.newInstance({
                        apiName: "month",
                        apiGroupName: "timeUnits",
                        selected: true
                    });
                });

                it("should update dateService", function() {
                    this.$scope.toggle();
                    expect(this.dateService.setAggregation).to.have.been.calledWith("date");
                    expect(this.dateService.setSelectedRangeId).to.have.been.calledWith(2);
                    expect(this.dateService.setSelectedRangeName).to.have.been.calledWith("Last 7 days");
                    expect(this.historicMeasuresService.selectDimension).to.have.not.been.called;
                    expect(this.historicMeasuresService.unselectDimension).to.have.been.called;
                    expect(this.$scope.slicerURLParamsService.save).to.have.been.called;
                });
            });

            describe("when dimension(non-timeUnits) is selected", function() {
                beforeEach(function () {
                    this.$scope.dimensionModel = this.DimensionModel.newInstance({
                        apiName: "siteId",
                        selected: true
                    });
                });

                it("should update dateService", function() {
                    this.$scope.toggle();
                    expect(this.dateService.setAggregation).to.have.not.been.called;
                    expect(this.dateService.setSelectedRangeId).to.have.not.been.called;
                    expect(this.dateService.setSelectedRangeName).to.have.not.been.called;
                    expect(this.historicMeasuresService.selectDimension).to.have.not.been.called;
                    expect(this.historicMeasuresService.unselectDimension).to.have.been.called;
                    expect(this.$scope.slicerURLParamsService.save).to.have.been.called;
                });
            });

        });

    });
}).call(this);
