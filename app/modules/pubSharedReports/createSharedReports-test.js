/*global describe, beforeEach, afterEach, it, expect, inject, sinon*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("modules.sharedReportCtrl", function () {
        beforeEach(function () {
            module("pubSlicerApp");
        });
        beforeEach(module("modules/pubNotifications/toast.html"));
        beforeEach(function () {
            inject(function($injector) {
                this.$scope = $injector.get("$rootScope").$new();
                this.$timeout = $injector.get("$timeout");
                this.slicerURLParamsService = $injector.get("slicerURLParamsService");
                sinon.spy(this.slicerURLParamsService, "getEncodedData");
                sinon.stub(document, "getElementById", function() {
                        var defer = {
                            focus: function() {
                                return;
                            }
                        };
                        return defer;
                    });
                this.userSharedReportsService = $injector.get("userSharedReportsService");
                sinon.stub(this.userSharedReportsService, "fetch", function() {
                        var defer = {
                            then: function(cb) {
                                cb({data: getUserList()});
                            }
                        };
                        return defer;
                    });

                this.$scope.saveObject = {
                    reportName:"",
                    selectedUsersValueIds : [],
                    message:""
                };
                $injector.get("pubAnalyticService").fetch();
                $injector.get("$httpBackend").flush();
                $injector.get("$controller")("sharedReportCtrl", {
                    $scope: this.$scope
                });
                this.$scope.$digest();
            });
        });

        afterEach(function() {
            document.getElementById.restore();
            this.slicerURLParamsService.getEncodedData.restore();
            this.userSharedReportsService.fetch.restore();
        });

        describe("initialize", function() {
            it("should have initialized variables", function() {
                expect(this.$scope.showCheckbox).to.equal(true);
                expect(this.$scope.okDisabled).to.equal(false);
                expect(this.$scope.savecopy).to.equal(false);
                expect(this.$scope.reportFound).to.equal(false);
                expect(this.$scope.shareOrSaveSuccess).to.equal(false);
                expect(this.userSharedReportsService.fetch).to.have.been.calledOnce;
                this.$timeout.flush();
            });
        });

        describe("get url", function() {
            it("should return url if called", function() {
                expect(this.slicerURLParamsService.getEncodedData).to.have.been.calledOnce;
                this.$scope.getUrl();
            });
        });

        describe("change user selection", function() {
            it("should set userid when email selected into save object", function() {
                this.$scope.changeUserSelection({userId:1});
                expect(this.$scope.saveObject.selectedUsersValueIds).to.have.length(1);
            });

            it("should unset userid when email unselected into save object", function() {
                this.$scope.changeUserSelection({userId:""});
                expect(this.$scope.saveObject.selectedUsersValueIds).to.have.length(1);
            });
        });

        describe("save", function() {
            it("should initialize all basic values and validate if any values are in the form are not populated", function() {
                this.$scope.save();
                expect(this.$scope.okDisabled).to.equal(false);
                expect(this.$scope.cancelDisabled).to.equal(true);
                expect(this.$scope.shareOrSaveSuccess).to.equal(true);
                expect(this.$scope.sharedReportValidationMessage).to.equal("REPORTS.COMPLETE_ALL_FIELDS");
            });

            it("should call save and share service for a unsaved report", function() {
                this.$scope.saveObject.selectedUsersValueIds = [1,2,3];
                this.$scope.saveObject.reportName = "test1Report";
                this.$scope.save();
                expect(this.$scope.okDisabled).to.equal(false);
                expect(this.$scope.cancelDisabled).to.equal(true);
                expect(this.$scope.shareOrSaveSuccess).to.equal(true);
                expect(this.$scope.sharedReportValidationMessage).to.equal("REPORTS.IS_PROCESSING");
            });
            it("should call save and share service for a saved report", function() {
                this.$scope.saveObject.selectedUsersValueIds = [1,2,3];
                this.$scope.saveObject.reportName = "test2Report";
                this.$scope.showCheckbox = true;
                this.$scope.savecopy = true;
                this.$scope.save();
                expect(this.$scope.okDisabled).to.equal(false);
                expect(this.$scope.cancelDisabled).to.equal(true);
                expect(this.$scope.shareOrSaveSuccess).to.equal(true);
                expect(this.$scope.sharedReportValidationMessage).to.equal("REPORTS.SAVING");
            });
            it("should call share service for a saved report", function() {
                this.$scope.saveObject.selectedUsersValueIds = [1,2,3];
                this.$scope.saveObject.reportName = "test3Report";
                this.$scope.showCheckbox = false;
                this.$scope.savedReportData = {id :1};
                this.$scope.save();
                expect(this.$scope.okDisabled).to.equal(false);
                expect(this.$scope.cancelDisabled).to.equal(true);
                expect(this.$scope.shareOrSaveSuccess).to.equal(true);
                expect(this.$scope.sharedReportValidationMessage).to.equal("REPORTS.IS_PROCESSING");
            });
        });

        describe("reportCheckMethod", function(){
            beforeEach(function () {
                    inject(function($injector) {
                        this.savedReportsService = $injector.get("savedReportsService");
                        sinon.stub(this.savedReportsService, "all", function() {
                            return getSavedList();
                        });
                        $injector.get("$controller")("sharedReportCtrl", {
                            $scope: this.$scope
                        });
                        this.$scope.$digest();

                    });
                });
            afterEach(function() {
                this.savedReportsService.all.restore();
            });
            it("should check if report exists", function() {
                this.$scope.saveObject = {reportName:"111AA_1hg"};
                this.$scope.reportCheckMethod();
                expect(this.$scope.reportFound).to.equal(true);
                expect(this.$scope.reportId).to.equal(3025);
            });
        });

        function getSavedList(){
            return [
                {
                    attributes:  {
                        "id":3025,
                        "name":"111AA_1hg",
                        "url":"#/slice?f=eyJkIjpbImFkRm9ybWF0SWQiLCJzaXRlSWQiLCJjb3VudHJ5SWQiLCJhZFNpemVJZCJdLCJtIjpbInBhaWRJbXByZXNzaW9ucyIsImVjcG0iLCJyZXZlbnVlIiwiY2xpY2tzIiwiY3RyIl0sImYiOltbInQiLCJyZXZlbnVlIiwidCIsMTAsIiIsIiIsW11dLFsidCIsInJldmVudWUiLCJ0IiwxMCwiIiwiIixbXV0sWyJ0IiwicmV2ZW51ZSIsInQiLDEwLCIiLCIiLFtdXSxbInQiLCJyZXZlbnVlIiwidCIsMTAsIiIsIiIsW11dXSwidCI6WzJdLCJjdCI6W10sImMiOnsidCI6ImxpbmVjaGFydCIsImQiOiIiLCJhIjoiZGF0ZSIsIm0iOiJwYWlkSW1wcmVzc2lvbnMifSwiYSI6ImRhdGUifQ%3D%3D",
                        "description":"",
                        "sharedByUserId":null,
                        "sharedByUser":null,
                        "shared":false,
                        "creationDate":"2015-06-23T19:02:37+0000",
                        "modificationDate":"2015-06-23T19:02:37+0000",
                    },
                    getName: function(){
                        return "111AA_1hg";
                    },
                    getId: function(){
                        return 3025;
                    }
                }
            ];
        }

        function getUserList(){
            return [
                {
                    "userId":13628,
                    "firstName":"user",
                    "lastName":"13628",
                    "email":"13628_user@mailinator.com"
                },{
                    "userId":11726,
                    "firstName":"user",
                    "lastName":"11726",
                    "email":"11726_user@mailinator.com"
                },{
                    "userId":13015,
                    "firstName":"K",
                    "lastName":"D",
                    "email":"kuldeep.ghadge@pubmatic.com"
                },{
                    "userId":14501,
                    "firstName":"Bilal",
                    "lastName":"Peerzade",
                    "email":"bilal.peerzade@pubmatic.com"
                },{
                    "userId":11729,
                    "firstName":"Gajendra",
                    "lastName":"Chavan",
                    "email":"gajendra.chavan@pubmatic.com"
                },{
                    "userId":14062,
                    "firstName":"user",
                    "lastName":"14062",
                    "email":"14062_user@mailinator.com"
                },{
                    "userId":13016,
                    "firstName":"user",
                    "lastName":"13016",
                    "email":"13016_user@mailinator.com"
                }
            ];
        }

    });

}).call(this);