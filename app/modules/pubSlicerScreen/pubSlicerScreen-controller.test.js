/*global describe, it, beforeEach, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Controller: PubSlicerScreenCtrl", function () {

        beforeEach(module("pubSlicerApp"));
        beforeEach(module("modules/pubNotifications/toast.html"));
        beforeEach(inject(function ($rootScope, $controller, $timeout, pubAnalyticService, $httpBackend, chartModel) {

            pubAnalyticService.fetch();
            $httpBackend.whenPOST("api/v1/analytics/displayvalue").respond([]);
            this.$httpBackend = $httpBackend;
            $httpBackend.flush();


            this.$scope = $rootScope.$new();
            this.$scope.navigateNLP = function(){};
            this.$scope.currentPageIndicator = function(){};
            this.$scope.updateNlp = function(){};
            this.$scope.updateDefaultChart = function(){};


            this.$scope.nlpDisplay = "show me site";
            this.chartModel = chartModel;
            this.chartModel.setMetric("revenue");
            this.controller = $controller("PubSlicerScreenCtrl", {
                $scope: this.$scope,
                $timeout: $timeout,
                pubAnalyticService: pubAnalyticService
            });
        }));

        it("should exist", function () {
            expect(this.controller).to.exist;
            expect(this.controller).to.be.an("object");
        });

        describe("scope", function () {

            it("should exist", function () {
                expect(this.$scope).to.exist;
                expect(this.$scope).to.be.an("object");
            });
        });



        describe("tryAgain", function () {
            it("Shoud set tabularSpinner to true", function () {
                this.$scope.tryAgain();
                expect(this.$scope.tabularSpinner).to.equal(true);
            });
        });

        describe("buttonRedirect", function () {
            it("Testing button redirect function", function () {
                this.$scope.buttonRedirect();
            });
        });

        describe("changeChartType", function () {
            it("Shoud set display chart to true", function () {
                this.$scope.changeChartType("barchart");
                expect(this.$scope.selectedChart).to.equal("barchart");
            });
        });


        describe("createIframe", function () {
            it("Testing createIframe function", function () {
                this.$scope.createIframe();
            });
        });

        describe("exportCSV", function () {
            it("Shoud set display chart to true", function () {
                this.$scope.exportCSV();
                expect(this.$scope.showExportDropDown).to.equal(false);
            });
        });

        describe("exportXlsx", function () {
            it("Shoud set display chart to true", function () {
                this.$scope.exportXlsx();
                expect(this.$scope.showExportDropDown).to.equal(false);
            });
        });

    });
}).call(this);






