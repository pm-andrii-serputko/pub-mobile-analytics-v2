/*global describe, beforeEach, it, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("modules.saveReportCtrl", function () {

        beforeEach(function () {
            module("pubSlicerApp");
        });
        beforeEach(module("modules/pubNotifications/toast.html"));

        beforeEach(function () {
            inject(function($rootScope, $controller, $httpBackend, savedReportsService, pubAnalyticService) {
                pubAnalyticService.fetch();
                $httpBackend.whenPOST("api/v1/analytics/displayvalue").respond([]);
                $httpBackend.flush();

                savedReportsService.fetch();
                $httpBackend.whenPUT("api/v1/analytics/saved").respond([]);
                $httpBackend.flush();
                savedReportsService.fetch();
                $httpBackend.whenPOST("api/v1/analytics/saved").respond([]);
                $httpBackend.flush();

                this.$scope = $rootScope.$new();
                this.controller = $controller("saveReportCtrl", {
                    $scope: this.$scope
                });
                this.$httpBackend = $httpBackend;
                this.$scope.$digest();
            });
        });

        it("should exist", function () {
            expect(this.controller).to.exist;
            expect(this.controller).to.be.an("object");
            expect(this.$scope.reportName).to.be.defined;
            expect(this.$scope.reportId).to.be.defined;
            expect(this.$scope.descriptionNeeded).to.equal(false);
            expect(this.$scope.reportFound).to.equal(false);
            expect(this.$scope.saveSuccess).to.equal(false);
            expect(this.$scope.savedReportsArray).to.be.defined;
        });
        it("validate and check if multiple reports exist", function () {
            expect(this.$scope.checkReportExists).to.be.a("function");
            this.$scope.checkReportExists("111AA_ok2");
        });


        it("get Url", function () {
            expect(this.$scope.getUrl).to.be.a("function");
            this.$scope.getUrl();
        });

        it("save method to be called and callUpdateSaveService branch to be called", function () {
            expect(this.$scope.save).to.be.a("function");
            this.$scope.reportName = "111AA_ok2";
            this.$scope.reportFound = true;
            this.$scope.save();
            this.$scope.$apply();

        });
        it("save method to be called and callCreateReportSaveService branch to be called", function () {
            expect(this.$scope.save).to.be.a("function");
            this.$scope.reportName = "111AA_ok2";
            this.$scope.reportFound = false;
            this.$scope.save();
            this.$scope.$apply();

        });
        it("save method to be called and else branch should be called", function () {
            expect(this.$scope.save).to.be.a("function");
            this.$scope.reportName = undefined;
            this.$scope.reportFound = false;
            this.$scope.save();
            this.$scope.$apply();

        });

        it("Set report id and call close dialog", function(){
            var response = {
                "id":5991,
                "name":"abcde",
                "url":"#/slice?f=eyJkIjpbImNvdW50cnlJZCJdLCJtIjpbInJldmVudWUiLCJwYWlkSW1wcmVzc2lvbnMiLCJlY3BtIl0sImYiOltbInQiLCJyZXZlbnVlIiwidCIsMTAsIiIsIiIsW11dXSwidCI6WzJdLCJjdCI6W10sImMiOnsidCI6ImxpbmVjaGFydCIsImQiOiIiLCJhIjoiZGF0ZSIsIm0iOiJyZXZlbnVlIn0sImEiOiJkYXRlIn0%3D",
                "description":"",
                "sharedByUserId":null,
                "sharedByUser":null,
                "shared":false,
                "creationDate":"2015-02-02T21:05:35+0000",
                "modificationDate":"2015-02-02T21:05:35+0000"
            };
            this.$scope.setReportIdAndCloseDialog(response);
            expect(this.$scope.reportData).to.be.defined;
            expect(this.$scope.reportData).to.equal(response);
            expect(this.$scope.reportTitle).to.be.defined;
            expect(this.$scope.reportTitle).to.equal(response.name);
            expect(this.$scope.savedReportsMessage).to.be.defined;
            expect(this.$scope.savedReportsMessage).to.equal("REPORTS.SAVED_SUCCESS");
        });

        it("Set keyboard event", function(){
            expect(this.$scope.callSave).to.be.a("function");
            var oEvent = document.createEvent("KeyboardEvent");
            oEvent.initKeyboardEvent("keydown", true, true, document.defaultView, false, false, false, false, 13, 13);
            this.$scope.callSave(oEvent);
        });


    });

}).call(this);