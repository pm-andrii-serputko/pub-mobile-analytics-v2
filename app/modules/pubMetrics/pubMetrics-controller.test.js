/*global describe, it, beforeEach, afterEach, expect, inject, sinon*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("modules.PubMetricsCtrl", function () {

        beforeEach(module("pubSlicerApp"));
        beforeEach(module("modules/pubNotifications/toast.html"));
        beforeEach(inject(function ($injector) {
            this.$scope = $injector.get("$rootScope").$new();
            this.$scope.currentPageIndicator = sinon.spy();
            this.googleAnalyticsService = $injector.get("googleAnalyticsService");
            this.slicerURLParamsService = $injector.get("slicerURLParamsService");
            this.historicMeasuresService = $injector.get("historicMeasuresService");
            this.chartModel = $injector.get("chartModel");
            this.pubURLService = $injector.get("pubURLService");

            sinon.spy(this.googleAnalyticsService, "gTrackPageUsage");
            sinon.spy(this.googleAnalyticsService, "gTrackEventUsage");
            sinon.spy(this.slicerURLParamsService, "fetch");
            sinon.spy(this.slicerURLParamsService, "save");
            sinon.spy(this.slicerURLParamsService, "getUrl");
            sinon.spy(this.historicMeasuresService, "unselectAllMetrics");
            sinon.spy(this.chartModel, "setMetric");
            sinon.stub(this.pubURLService, "back");
            sinon.stub(this.pubURLService, "navigate");

            $injector.get("pubAnalyticService").fetch();
            $injector.get("$httpBackend").flush();
            $injector.get("$controller")("PubMetricsCtrl", {
                $scope: this.$scope
            });
            this.$scope.$digest();
        }));

        afterEach(function() {
            this.googleAnalyticsService.gTrackPageUsage.restore();
            this.googleAnalyticsService.gTrackEventUsage.restore();
            this.slicerURLParamsService.fetch.restore();
            this.slicerURLParamsService.save.restore();
            this.slicerURLParamsService.getUrl.restore();
            this.historicMeasuresService.unselectAllMetrics.restore();
            this.chartModel.setMetric.restore();
            this.pubURLService.back.restore();
            this.pubURLService.navigate.restore();
        });

        describe("initialize", function() {
            it("should be tracked in GA tool", function() {
                expect(this.googleAnalyticsService.gTrackPageUsage).to.have.been.called;
                expect(this.googleAnalyticsService.gTrackPageUsage).to.have.been.calledWith("select metrics");
            });

            it("should fetch data from URL", function() {
                expect(this.slicerURLParamsService.fetch).to.have.been.called;
            });

            it("should have metrics collection", function() {
                expect(this.$scope.metricsCollection.models).to.have.length(43);
            });

            it("should have metric group list and should have 3 groups", function() {
                expect(this.$scope.metricGroupList).to.have.length(3);

                var groups = ["Standard Metrics", "Bid Metrics", "Bid Metrics"];
                this.$scope.metricGroupList.map(function(group, index) {
                    expect(group.groupModel.getName()).to.equal(groups[index]);
                });
            });
        });

        describe("clear", function() {
            it("should unselect all metrics", function() {
                this.$scope.clear();
                expect(this.historicMeasuresService.unselectAllMetrics).to.have.been.called;
                expect(this.historicMeasuresService.unselectAllMetrics.getCall(0).args[0]).to.eql({unselectAll: true});
            });
            it("should set metric to chartModel", function() {
                this.$scope.clear();
                expect(this.chartModel.setMetric).to.have.been.calledWith("revenue");
            });
            it("should save changes and update URL", function() {
                this.$scope.clear();
                expect(this.slicerURLParamsService.save).to.have.been.called;
            });
        });

        describe("cancel", function() {
            it("should navigate user to page before creating report", function() {
                this.$scope.cancel();
                expect(this.pubURLService.back).to.have.been.called;
            });
        });

        describe("back", function() {
            it("should navigate user to previous page", function() {
                this.$scope.back();
                var hash = "/filter?f=eyJkIjpbXSwibSI6WyJwYWlkSW1wcmVzc2lvbnMiLCJlY3BtIiwicmV2ZW51ZSJdLCJmIjpbXSwidCI6WzJdLCJjdCI6W10sImMiOnsidCI6ImxpbmVjaGFydCIsImQiOiIiLCJhIjoiZGF0ZSIsIm0iOiJyZXZlbnVlIn0sImEiOiJkYXRlIn0%3D";
                expect(this.slicerURLParamsService.getUrl).to.have.been.called;
                expect(this.pubURLService.navigate).to.have.been.called;
                expect(this.pubURLService.navigate).to.have.been.calledWith(hash);
            });
        });

        describe("done", function() {
            it("should track event in GA", function() {
                this.$scope.done();
                expect(this.googleAnalyticsService.gTrackEventUsage).to.have.been.called
                    .and.to.have.been.calledWith("button", "click", "create report");
            });

            it("should navigate user to report page", function() {
                this.$scope.done();
                var hash = "/slice?f=eyJkIjpbXSwibSI6WyJwYWlkSW1wcmVzc2lvbnMiLCJlY3BtIiwicmV2ZW51ZSJdLCJmIjpbXSwidCI6WzJdLCJjdCI6W10sImMiOnsidCI6ImxpbmVjaGFydCIsImQiOiIiLCJhIjoiZGF0ZSIsIm0iOiJyZXZlbnVlIn0sImEiOiJkYXRlIn0%3D";
                expect(this.slicerURLParamsService.getUrl).to.have.been.called;
                expect(this.pubURLService.navigate).to.have.been.called;
                expect(this.pubURLService.navigate).to.have.been.calledWith(hash);
            });
        });

    });
}).call(this);
