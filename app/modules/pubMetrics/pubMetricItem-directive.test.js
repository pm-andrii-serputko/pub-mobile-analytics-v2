/*global describe, it, beforeEach, afterEach, expect, inject, sinon*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("modules.pubMetricItem", function () {

        /** Load module */
        beforeEach(function () {
            module("pubSlicerApp");
        });
        beforeEach(module("modules/pubNotifications/toast.html"));

        /** Initialize scope, spy, DOM, fetch data to services */
        beforeEach(function () {
            inject(function($compile, $rootScope, $httpBackend, pubAnalyticService, historicMeasuresService, slicerURLParamsService, MetricModel, chartModel) {
                this.$scope = $rootScope.$new();
                this.$scope.metricModel = MetricModel.newInstance({apiName: "ecpm", displayValue: "eCPM"});
                this.$scope.slicerURLParamsService = slicerURLParamsService;
                this.MetricModel = MetricModel;
                this.historicMeasuresService = historicMeasuresService;
                this.chartModel = chartModel;

                sinon.spy(this.$scope.slicerURLParamsService, "save");
                sinon.spy(this.historicMeasuresService, "selectMetric");
                sinon.spy(this.historicMeasuresService, "unselectMetric");
                sinon.spy(this.chartModel, "setMetric");

                this.element = angular.element("<div pub-metric-item></div>");
                $compile(this.element)(this.$scope);

                pubAnalyticService.fetch();
                $httpBackend.flush();
                this.$scope.metricsCollection = historicMeasuresService.getMetrics();
            });
        });

        /** Remove all spies, stubes, mockes*/
        afterEach(function() {
            this.$scope.slicerURLParamsService.save.restore();
            this.historicMeasuresService.selectMetric.restore();
            this.historicMeasuresService.unselectMetric.restore();
            this.chartModel.setMetric.restore();
        });

        describe("$scope", function() {
            it("should have metricModel", function() {
                expect(this.$scope.metricModel).to.be.an("object");
                expect(this.$scope.metricModel.getId()).to.equal("ecpm");
                expect(this.$scope.metricModel.getName()).to.equal("eCPM");
                expect(this.$scope.metricModel.getSelected()).to.equal(false);
            });
        });

        describe("toggle", function() {
            it("should save changes to slicerURLParamsService", function() {
                this.$scope.toggle();
                expect(this.$scope.slicerURLParamsService.save).to.have.been.called;
                expect(this.historicMeasuresService.selectMetric).to.have.been.called;
                expect(this.historicMeasuresService.unselectMetric).to.have.not.been.called;
            });

            describe("when metric is disabled", function() {
                beforeEach(function () {
                    this.$scope.metricModel = this.MetricModel.newInstance({
                        apiName: "ecpm",
                        displayValue: "eCPM",
                        disabled: true
                    });
                });

                it("should do nothing", function() {
                    this.$scope.toggle();
                    expect(this.$scope.slicerURLParamsService.save).to.have.not.been.called;
                    expect(this.historicMeasuresService.selectMetric).to.have.not.been.called;
                    expect(this.historicMeasuresService.unselectMetric).to.have.not.been.called;
                });
            });

            describe("when metric is selected", function() {
                beforeEach(function () {
                    this.$scope.metricModel = this.MetricModel.newInstance({
                        apiName: "ecpm",
                        selected: true
                    });
                });

                it("should be unselected", function() {
                    this.$scope.toggle();
                    expect(this.$scope.slicerURLParamsService.save).to.have.been.called;
                    expect(this.historicMeasuresService.selectMetric).to.have.not.been.called;
                    expect(this.historicMeasuresService.unselectMetric).to.have.been.called;
                });

                it("should set metric to chartModel", function() {
                    this.$scope.toggle();
                    
                    expect(this.chartModel.setMetric).to.have.been.calledTwice;
                    expect(this.chartModel.setMetric.getCall(0).args[0]).to.equal(null);
                    expect(this.chartModel.setMetric.getCall(1).args[0]).to.equal("revenue");
                });
            });

        });

    });
}).call(this);