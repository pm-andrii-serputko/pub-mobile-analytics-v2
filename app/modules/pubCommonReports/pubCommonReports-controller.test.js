/*global describe, it, beforeEach, afterEach, expect, inject, sinon*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("modules.pubCommonReportsCtrl", function () {

        beforeEach(function () {
            module("pubSlicerApp");
        });

        beforeEach(inject(function ($injector) {
            this.$scope = $injector.get("$rootScope").$new();
            this.googleAnalyticsService = $injector.get("googleAnalyticsService");
            this.commonReportsService = $injector.get("commonReportsService");
            this.ngDialog = $injector.get("ngDialog");
            this.ReportModel = $injector.get("ReportModel");
            // Sinon overrides
            this.$scope.currentPageIndicator = sinon.spy();
            this.$scope.navigateNLP = sinon.spy();
            sinon.spy(this.googleAnalyticsService, "gTrackPageUsage");
            sinon.spy(this.commonReportsService, "groupBy");
            sinon.spy(this.ngDialog, "openConfirm");


            $injector.get("$controller")("pubCommonReportsCtrl", {
                $scope: this.$scope
            });
            this.$scope.$digest();
        }));

        afterEach(function() {
            // Sinon restores
            this.googleAnalyticsService.gTrackPageUsage.restore();
            this.commonReportsService.groupBy.restore();
            this.ngDialog.openConfirm.restore();
        });

        it("should be tracked in GA tool", function() {
            expect(this.googleAnalyticsService.gTrackPageUsage).to.have.been.calledWith("standard reports list");
        });

        it("should update NLP", function() {
            expect(this.$scope.navigateNLP).to.have.been.calledWith("standard reports");
        });

        it("should update page indicator", function() {
            expect(this.$scope.currentPageIndicator).to.have.been.calledWith("standard");
        });

        it("should have list of reportGroups", function() {
            expect(this.commonReportsService.groupBy).to.have.been.calledWith("groupId");
        });

        describe("showReport", function() {
            it("should navigate to report page", function() {
                var report = getReport(this.ReportModel);
                this.$scope.showReport(report);
                expect(window.location.hash).to.equal(getExpectedUrl());

                // Go back to Kurma runner page
                window.history.back();
            });
        });

        describe("createScheduleReport", function() {
            it("should open ngDialog to create schedule report", function() {
                this.$scope.createScheduleReport(777);

                expect(this.$scope.scheduleReportId).to.equal(null);
                expect(this.$scope.reportId).to.equal(777);
                expect(this.$scope.reportType).to.equal("STANDARD");
                expect(this.ngDialog.openConfirm).to.have.been.called;
            });

            it("should track page in GA tool", function() {
                this.$scope.createScheduleReport(777);
                expect(this.googleAnalyticsService.gTrackPageUsage).to.have.been.calledWith("Schedule a report window");
            });
        });

        function getReport(Model) {
            return new Model({
                "id": 261,
                "name": "Ad Size Performance",
                "url": "#/slice?f=eyJkIjpbImFkU2l6ZUlkIiwiZGF0ZSJdLCJtIjpbInJldmVudWUiLCJwYWlkSW1wcmVzc2lvbnMiLCJlY3BtIl0sImYiOltbInQiLCJyZXZlbnVlIiwidCIsMTAsIiIsIiIsW11dLFsidCIsImRhdGUiLCJ0IiwiMTAiLCIiLCIiLFtdXV0sInQiOlsyXSwiYyI6eyJ0IjoiYmFyY2hhcnQiLCJkIjoiIiwiYSI6ImRhdGUiLCJtIjoicmV2ZW51ZSJ9LCJhIjoiZGF0ZSJ9",
                "description": "Analyze ad size performance by date",
                "sharedByUserId": null,
                "sharedByUser": null,
                "groupId": 1,
                "groupName": "Basic",
                "shared": null,
                "creationDate": "2014-10-21T23:39:40+0000",
                "modificationDate": "2014-10-21T23:39:40+0000"
            });
        }

        function getExpectedUrl() {
            return "#/slice?f=eyJkIjpbImFkU2l6ZUlkIiwiZGF0ZSJdLCJtIjpbInJldmVudWUiLCJwYWlkSW1wcmVzc2lvbnMiLCJlY3BtIl0sImYiOltbInQiLCJyZXZlbnVlIiwidCIsMTAsIiIsIiIsW11dLFsidCIsImRhdGUiLCJ0IiwiMTAiLCIiLCIiLFtdXV0sInQiOlsyXSwiYyI6eyJ0IjoiYmFyY2hhcnQiLCJkIjoiIiwiYSI6ImRhdGUiLCJtIjoicmV2ZW51ZSJ9LCJhIjoiZGF0ZSJ9&standardReportId=261";
        }

    });
}).call(this);
