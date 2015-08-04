/*global describe, it, beforeEach, afterEach, expect, inject, sinon*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("modules.PubDimensionsCtrl", function () {

        beforeEach(function () {
            module("pubSlicerApp");
        });
        beforeEach(module("modules/pubNotifications/toast.html"));

        beforeEach(function () {
            inject(function($rootScope, $controller, $httpBackend, pubAnalyticService, dimensionValuesService, slicerURLParamsService, googleAnalyticsService, historicMeasuresService, pubURLService) {
                this.$scope = $rootScope.$new();
                this.$scope.navigateNLP = sinon.spy();
                this.$scope.updateNlp = sinon.spy();
                this.$scope.currentPageIndicator = sinon.spy();
                this.dimensionValuesService = dimensionValuesService;
                this.slicerURLParamsService = slicerURLParamsService;
                this.googleAnalyticsService = googleAnalyticsService;
                this.historicMeasuresService = historicMeasuresService;
                this.pubURLService = pubURLService;

                sinon.spy(this.slicerURLParamsService, "fetch");
                sinon.spy(this.slicerURLParamsService, "reset");
                sinon.spy(this.googleAnalyticsService, "gTrackPageUsage");
                sinon.spy(this.googleAnalyticsService, "gTrackEventUsage");

                
                sinon.stub(this.dimensionValuesService, "getAllDimensionValues", getAllDimensionValues);
                sinon.stub(this.historicMeasuresService, "unselectAllDimensions");
                sinon.stub(this.slicerURLParamsService, "save");
                sinon.stub(this.pubURLService, "back");
                sinon.stub(this.pubURLService, "navigate");
                

                pubAnalyticService.fetch();
                $httpBackend.flush();
                $controller("PubDimensionsCtrl", {
                    $scope: this.$scope
                });
                this.$scope.$digest();
            });
        });

        afterEach(function() {
            this.dimensionValuesService.getAllDimensionValues.restore();
            this.slicerURLParamsService.fetch.restore();
            this.slicerURLParamsService.reset.restore();
            this.slicerURLParamsService.save.restore();
            this.googleAnalyticsService.gTrackPageUsage.restore();
            this.googleAnalyticsService.gTrackEventUsage.restore();
            this.historicMeasuresService.unselectAllDimensions.restore();
            this.pubURLService.back.restore();
            this.pubURLService.navigate.restore();
        });

        describe("initialize", function() {
            it("should update NLP", function() {
                expect(this.$scope.navigateNLP).to.have.been.called;
                expect(this.$scope.navigateNLP).to.have.been.calledWith("create report");
            });

            it("should fetch data from URL", function() {
                expect(this.slicerURLParamsService.fetch).to.have.been.called;
            });

            it("should reset all services if no selected dimensions", function() {
                expect(this.$scope.dimensionsCollection.getSelectedDimensions()).to.have.length(0);
                expect(this.slicerURLParamsService.reset).to.have.been.called;
            });

            it("should have dimensions collection", function() {
                expect(this.$scope.dimensionsCollection.models).to.have.length(29);
            });
            it("should have metrics collection", function() {
                expect(this.$scope.metricsCollection.models).to.have.length(43);
            });
            it("should have dimension group list and should have 8 groups", function() {
                expect(this.$scope.dimensionGroupList).to.have.length(8);

                var groups = ["Ad Attributes", "Buyer", "General", "Geography", "Inventory", "Mobile", "Time Units", "Automated Guaranteed"];
                this.$scope.dimensionGroupList.map(function(group, index) {
                    expect(group.groupModel.getName()).to.equal(groups[index]);
                });
            });
            it("should have dimension group list sorted by columns and should have 3 columns", function() {
                expect(this.$scope.dimensionGroupListSortedByColumns).to.have.length(3);

                expect(this.$scope.dimensionGroupListSortedByColumns[0]).to.have.length(3);
                expect(this.$scope.dimensionGroupListSortedByColumns[1]).to.have.length(3);
                expect(this.$scope.dimensionGroupListSortedByColumns[2]).to.have.length(2);
            });

            it("should be tracked in GA tool", function() {
                expect(this.googleAnalyticsService.gTrackPageUsage).to.have.been.called;
                expect(this.googleAnalyticsService.gTrackPageUsage).to.have.been.calledWith("select dimensions");
            });

            describe("if Aggregator exists", function() {
                beforeEach(function() {
                    inject(function(pubUniversalAnalyticService, $location, $controller) {
                        this.pubUniversalAnalyticService = pubUniversalAnalyticService;
                        this.$location = $location;

                        sinon.stub(this.$location, "url");
                        sinon.stub(this.pubUniversalAnalyticService, "isAggregator").onFirstCall().returns(true);
                        $controller("PubDimensionsCtrl", {
                            $scope: this.$scope
                        });
                        this.$scope.$digest();
                    });
                });

                afterEach(function() {
                    this.$location.url.restore();
                    this.pubUniversalAnalyticService.isAggregator.restore();
                });

                it("should navigate to '/'", function() {
                    expect(this.$location.url).to.have.been.calledWith("/");
                });
            });
        });

        describe("clear", function() {
            it("should unselect all dimensions", function() {
                this.$scope.clear();
                expect(this.historicMeasuresService.unselectAllDimensions).to.have.been.called;
            });

            it("should update URL with current state", function() {
                this.$scope.clear();
                expect(this.slicerURLParamsService.save).to.have.been.called;
            });
        });

        describe("cancel", function() {
            it("should unselect all dimensions", function() {
                this.$scope.cancel();
                expect(this.historicMeasuresService.unselectAllDimensions).to.have.been.called;
            });

            it("should navigate to previous screen", function() {
                this.$scope.cancel();
                expect(this.pubURLService.back).to.have.been.called;
            });
        });

        describe("done", function() {
            it("should be tracked in GA tool", function() {
                this.$scope.done();
                expect(this.googleAnalyticsService.gTrackEventUsage).to.have.been.calledWith("button", "click", "create report");
            });

            it("should navigate to previous screen", function() {
                this.$scope.done();
                var hash = "/filter?f=eyJkIjpbXSwibSI6WyJwYWlkSW1wcmVzc2lvbnMiLCJlY3BtIiwicmV2ZW51ZSJdLCJmIjpbXSwidCI6WzJdLCJjdCI6W10sImMiOnsidCI6ImxpbmVjaGFydCIsImQiOiIiLCJhIjoiZGF0ZSIsIm0iOiIifSwiYSI6ImRhdGUifQ%3D%3D";
                expect(this.pubURLService.navigate).to.have.been.calledWith(hash, true);
            });
        });

        function getAllDimensionValues() {
            return {
                success: function(cb) { cb({}); }
            };
        }
    });
}).call(this);
