/*global describe, it, beforeEach, afterEach, expect, inject, sinon*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("modules.PubFilterCtrl", function () {

        beforeEach(module("pubSlicerApp"));
        beforeEach(module("modules/pubNotifications/toast.html"));

        beforeEach(inject(function ($injector) {
            $injector.get("pubAnalyticService").fetch();
            $injector.get("$httpBackend").flush();

            this.$scope = $injector.get("$rootScope").$new();
            this.googleAnalyticsService = $injector.get("googleAnalyticsService");
            this.slicerURLParamsService = $injector.get("slicerURLParamsService");
            this.historicMeasuresService = $injector.get("historicMeasuresService");
            this.dimensionsCollection = this.historicMeasuresService.getDimensions();
            this.pageModel = $injector.get("pageModel");
            this.DimensionModel = $injector.get("DimensionModel");
            this.pubURLService = $injector.get("pubURLService");
            
            sinon.spy(this.googleAnalyticsService, "gTrackPageUsage");
            sinon.spy(this.slicerURLParamsService, "fetch");
            sinon.spy(this.slicerURLParamsService, "save");
            sinon.spy(this.pageModel, "updateIndicator");
            sinon.spy(this.pageModel, "updateReportBasicInfo");
            sinon.spy(this.dimensionsCollection, "getSelectedDimensions");
            sinon.spy(this.dimensionsCollection, "getVisibleDimensions");
            sinon.spy(this.dimensionsCollection, "getInvisibleDimensions");
            sinon.stub(this.historicMeasuresService, "unselectDimension");
            sinon.stub(this.historicMeasuresService, "orderMeasure");
            sinon.stub(this.pubURLService, "back");
            sinon.stub(this.pubURLService, "navigate");

            $injector.get("$controller")("PubFilterCtrl", {
                $scope: this.$scope
            });
            this.$scope.$digest();
        }));

        afterEach(function() {
            this.googleAnalyticsService.gTrackPageUsage.restore();
            this.slicerURLParamsService.fetch.restore();
            this.slicerURLParamsService.save.restore();
            this.pageModel.updateIndicator.restore();
            this.pageModel.updateReportBasicInfo.restore();
            this.historicMeasuresService.unselectDimension.restore();
            this.historicMeasuresService.orderMeasure.restore();
            this.dimensionsCollection.getSelectedDimensions.restore();
            this.dimensionsCollection.getVisibleDimensions.restore();
            this.dimensionsCollection.getInvisibleDimensions.restore();
            this.pubURLService.back.restore();
            this.pubURLService.navigate.restore();
        });

        describe("initialize", function() {
            it("should track page in GA", function() {
                expect(this.slicerURLParamsService.fetch).to.have.been.calledOnce;
                expect(this.googleAnalyticsService.gTrackPageUsage).to.have.been.calledWith("filter report");
            });

            it("should fetch data from URL", function() {
                expect(this.slicerURLParamsService.fetch).to.have.been.calledOnce;
            });

            it("should update indicator", function() {
                expect(this.pageModel.updateIndicator).to.have.been.calledOnce;
                expect(this.pageModel.updateReportBasicInfo).to.have.been.calledOnce;
            });
            it("should create VM diemsions", function() {
                expect(this.dimensionsCollection.getSelectedDimensions).to.have.been.called;
                expect(this.dimensionsCollection.getVisibleDimensions).to.have.been.called;
                expect(this.dimensionsCollection.getInvisibleDimensions).to.have.been.called;
            });
        });

        describe("edit", function() {
            it("should turn on edit mode", function() {
                var dimension = this.DimensionModel.newInstance({
                    apiName: "dspId",
                    displayValue: "DSP"
                });
                
                expect(this.$scope.editableDimension).to.equal(null);
                this.$scope.edit(dimension);
                expect(this.$scope.editableDimension).to.equal(dimension);
            });

            it("should turn off edit mode if editableDimension exists", function() {
                var dimension = this.DimensionModel.newInstance({
                    apiName: "dspId",
                    displayValue: "DSP"
                });
                
                expect(this.$scope.editableDimension).to.equal(null);
                this.$scope.edit(dimension);
                expect(this.$scope.editableDimension).to.equal(dimension);
                this.$scope.edit(dimension);
                expect(this.$scope.editableDimension).to.equal(null);
            });

            it("should change editableDimension", function() {
                var dimension1 = this.DimensionModel.newInstance({
                    apiName: "dspId",
                    displayValue: "DSP"
                });
                var dimension2 = this.DimensionModel.newInstance({
                    apiName: "siteId",
                    displayValue: "Site"
                });

                expect(this.$scope.editableDimension).to.equal(null);
                this.$scope.edit(dimension1);
                expect(this.$scope.editableDimension).to.equal(dimension1);
                this.$scope.edit(dimension2);
                expect(this.$scope.editableDimension).to.equal(dimension2);
            });
        });

        describe("destroy", function() {
            it("should unselect dimension", function() {
                var dimension = this.DimensionModel.newInstance({
                    apiName: "dspId",
                    displayValue: "DSP"
                });

                this.$scope.destroy(dimension);
                expect(this.historicMeasuresService.unselectDimension).to.have.been.calledOnce;
                expect(this.historicMeasuresService.unselectDimension).to.have.been.calledWith(dimension);
            });
            it("should update URL", function() {
                var dimension = this.DimensionModel.newInstance({
                    apiName: "dspId",
                    displayValue: "DSP"
                });

                this.$scope.destroy(dimension);
                expect(this.slicerURLParamsService.save).to.have.been.calledOnce;
            });
            it("should update VM dimensions", function() {
                var dimension = this.DimensionModel.newInstance({
                    apiName: "dspId",
                    displayValue: "DSP"
                });

                this.$scope.destroy(dimension);
                expect(this.$scope.editableDimension).to.equal(null);
                expect(this.dimensionsCollection.getVisibleDimensions).to.have.been.called;
                expect(this.dimensionsCollection.getInvisibleDimensions).to.have.been.called;
            });
        });

        describe("cancelEditing", function() {
            it("should cancel all changes", function() {
                this.$scope.cancelEditing();
                expect(this.$scope.editableDimension).to.equal(null);
                expect(this.slicerURLParamsService.fetch).to.have.been.called;
                expect(this.dimensionsCollection.getSelectedDimensions).to.have.been.called;
                expect(this.dimensionsCollection.getVisibleDimensions).to.have.been.called;
                expect(this.dimensionsCollection.getInvisibleDimensions).to.have.been.called;
            });
        });

        describe("save", function() {
            it("should save changes", function() {
                this.$scope.save();
                expect(this.slicerURLParamsService.save).to.have.been.called;
            });
        });

        describe("cancel", function() {
            it("should navigate User on previos page", function() {
                this.$scope.cancel();
                expect(this.pubURLService.back).to.have.been.called;
            });

            it("should be dissabled in edit mode", function() {
                var dimension = this.DimensionModel.newInstance({
                    apiName: "dspId",
                    displayValue: "DSP"
                });
                this.$scope.edit(dimension);
                this.$scope.cancel();
                expect(this.pubURLService.back).to.have.not.been.called;
                this.$scope.edit(dimension);
            });
        });

        describe("generate", function() {
            it("should navigate User to Slice page if data is valid", function() {
                sinon.stub(this.dimensionsCollection, "isValid").returns(true);
                this.$scope.cancelEditing();
                this.$scope.generate();
                expect(this.pubURLService.navigate).to.have.been.called;
                this.dimensionsCollection.isValid.restore();
            });

            it("should not navigate User to Slice page if data is invalid", function() {
                sinon.stub(this.dimensionsCollection, "isValid").returns(false);
                this.$scope.cancelEditing();
                this.$scope.generate();
                expect(this.pubURLService.navigate).to.have.not.been.called;
                expect(this.$scope.errorMessage).to.equal("FILTER.ERROR_REMAINING_DIMENSIONS");
                this.dimensionsCollection.isValid.restore();
            });
            it("should be dissabled in edit mode", function() {
                sinon.stub(this.dimensionsCollection, "isValid").returns(true);
                var dimension = this.DimensionModel.newInstance({
                    apiName: "dspId",
                    displayValue: "DSP"
                });
                this.$scope.edit(dimension);
                this.$scope.generate();
                expect(this.pubURLService.navigate).to.have.not.been.called;
                this.dimensionsCollection.isValid.restore();
                this.$scope.cancelEditing();
            });
        });

        describe("goToDimensionsScreen", function() {
            it("should navigate User to Metrics", function() {
                this.$scope.goToDimensionsScreen();
                expect(this.pubURLService.navigate).to.have.been.called;
            });

            it("should be dissabled in edit mode", function() {
                var dimension = this.DimensionModel.newInstance({
                    apiName: "dspId",
                    displayValue: "DSP"
                });
                this.$scope.edit(dimension);
                this.$scope.goToDimensionsScreen();
                expect(this.pubURLService.navigate).to.have.not.been.called;
                this.$scope.cancelEditing();
            });
        });

        describe("goToMetricsScreen", function() {
            it("should navigate User to Slice page if data is valid", function() {
                sinon.stub(this.dimensionsCollection, "isValid").returns(true);
                this.$scope.cancelEditing();
                this.$scope.goToMetricsScreen();
                expect(this.pubURLService.navigate).to.have.been.called;
                this.dimensionsCollection.isValid.restore();
            });

            it("should not navigate User to Slice page if data is invalid", function() {
                sinon.stub(this.dimensionsCollection, "isValid").returns(false);
                this.$scope.cancelEditing();
                this.$scope.goToMetricsScreen();
                expect(this.pubURLService.navigate).to.have.not.been.called;
                expect(this.$scope.errorMessage).to.equal("FILTER.ERROR_REMAINING_DIMENSIONS");
                this.dimensionsCollection.isValid.restore();
            });
            it("should be dissabled in edit mode", function() {
                sinon.stub(this.dimensionsCollection, "isValid").returns(true);
                var dimension = this.DimensionModel.newInstance({
                    apiName: "dspId",
                    displayValue: "DSP"
                });
                this.$scope.edit(dimension);
                this.$scope.goToMetricsScreen();
                expect(this.pubURLService.navigate).to.have.not.been.called;
                this.dimensionsCollection.isValid.restore();
                this.$scope.cancelEditing();
            });
        });

        describe("tips and errors", function() {
            it("should hide tips", function() {
                expect(this.$scope.showProTip).to.equal(true);
                this.$scope.hideProTip();
                expect(this.$scope.showProTip).to.equal(false);
            });

            it("should show error message", function() {
                this.$scope.showErrorTip("ERROR");
                expect(this.$scope.errorMessage).to.equal("ERROR");
            });

            it("should hide error message", function() {
                this.$scope.hideErrorTip();
                expect(this.$scope.errorMessage).to.equal("");
            });
        });

        describe("drop", function() {
            it("should update dimensions order", function() {
                var dimension = this.DimensionModel.newInstance({
                    apiName: "dspId",
                    displayValue: "DSP"
                });
                sinon.spy(dimension, "setVisible");

                this.$scope.drop(dimension, "true");

                expect(dimension.setVisible).to.have.been.calledWith(true);
                expect(this.historicMeasuresService.orderMeasure).to.have.been.called;
                expect(this.historicMeasuresService.orderMeasure).to.have.been.calledOn(this.dimensionsCollection);
            });
        });

    });
}).call(this);
