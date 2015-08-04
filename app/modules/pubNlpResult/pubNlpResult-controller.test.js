/*global describe, it, beforeEach, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Controller: pubNlpResultCtrl", function () {
        var service;
        beforeEach(module("pubSlicerApp"));
        beforeEach(module("modules/pubNotifications/toast.html"));
        beforeEach(inject(function ($rootScope, $controller) {
            this.$scope = $rootScope.$new();
            this.controller = $controller("pubNlpResultCtrl", {
                $scope: this.$scope
            });
        }));

	    beforeEach(inject(function ($compile, $rootScope, $httpBackend, pubAnalyticService, bTextProcessingService) {
	        pubAnalyticService.fetch();
            service = bTextProcessingService;
	        $httpBackend.whenPOST("api/v1/analytics/displayvalue").respond([]);
            this.$httpBackend = $httpBackend;
	        $httpBackend.flush();
	    }));

        describe("scope", function () {
            it("should exist", function () {
                expect(this.$scope).to.exist;
                expect(this.$scope).to.be.an("object");
            });
        });

        it("should exist", function () {
            expect(this.controller).to.exist;
            expect(this.controller).to.be.an("object");
        });

        it("isNonCommand should return true if is not command", function () {
            expect(this.$scope.commandList).to.be.an("array");
            expect(this.$scope.commandList.length).to.equal(11);
        });

        it("updateReportList should return reports", function () {
            this.$scope.updateReportList();
            expect(this.$scope.commonReport.length).to.equal(14);
            expect(this.$scope.savedReport.length).to.equal(116);
            expect(this.$scope.displayReportList.length).to.equal(130);
        });

        it("resultReportClicked should set textProcessed to false", function () {
            this.$scope.resultReportClicked();
            expect(this.$scope.textProcessed).to.equal(false);
        });

        it("callTextProcessing should just return if nlp is command", function () {
            this.$scope.textProcessed = false;
            this.$scope.nlpDisplay = "dashboard";
            this.$scope.callTextProcessing();
            expect(this.$scope.textProcessed).to.equal(false);
        });


        it("callTextProcessing should works", function () {
            this.$scope.textProcessed = false;
            this.$scope.nlpDisplay = "site";
            this.$scope.callTextProcessing();

            this.$httpBackend.flush();

            expect(this.$scope.textProcessed).to.equal(true);
        });
    });
}).call(this);
