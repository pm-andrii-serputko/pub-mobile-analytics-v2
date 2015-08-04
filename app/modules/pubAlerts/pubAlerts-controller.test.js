/*global describe, beforeEach, afterEach, it, expect, inject, sinon*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("modules.pubAlertsCtrl", function () {

        beforeEach(function () {
            module("pubSlicerApp");
        });
        beforeEach(module("modules/pubNotifications/toast.html"));

        beforeEach(function () {
            inject(function($rootScope, $controller) {
                this.$scope = $rootScope.$new();
                this.$scope.navigateNLP = sinon.spy();
                this.$scope.currentPageIndicator = sinon.spy();
                this.$scope.initViewAlertsTable = sinon.spy();
                this.event = {stopPropagation: sinon.spy()};
                $controller("pubAlertsCtrl", {
                    $scope: this.$scope
                });
                this.$scope.$digest();
            });
        });

        it("should update NLP", function() {
            expect(this.$scope.navigateNLP).to.have.been.called;
            expect(this.$scope.navigateNLP).to.have.been.calledWith("alerts");
        });

        it("should have initialized variables", function() {
            expect(this.$scope.alertsMainUserSetting).to.be.an("object");
            expect(this.$scope.isQuerying).to.equal(true);
            expect(this.$scope.inputSelectedEmailData).to.be.an("array").and.to.have.length(0);
            expect(this.$scope.buttonLabel).to.be.an("string").and.to.equal("");
            expect(this.$scope.myresponse).to.be.an("array").and.to.have.length(0);
            expect(this.$scope.filteredresponse).to.be.an("array").and.to.have.length(0);
            expect(this.$scope.index).to.be.an("number").and.to.equal(0);
            expect(this.$scope.alertPurgeArray).to.be.an("array")
                .and.to.eql([{
                    name: "90 Days",
                    days : 90
                }, {
                    name: "60 Days",
                    days : 60
                },{
                    name: "30 Days",
                    days : 30
                }]);
            expect(this.$scope.alertsMainUserSetting.deleteInDays).to.be.an("number").and.to.equal(30);
            expect(this.$scope.alertFreqArray).to.be.an("array")
                .and.to.eql([{
                    name: "Daily",
                    triggerFrequency : "DAILY",
                    emailContentType : "INDIVIDUAL"
                }, {
                    name: "Weekly",
                    triggerFrequency : "WEEKLY",
                    emailContentType : "INDIVIDUAL"
                }, {
                    name: "Monthly",
                    triggerFrequency : "MONTHLY",
                    emailContentType : "INDIVIDUAL"
                }]);

            expect(this.$scope.tabs).to.be.an("array")
                .and.to.eql([{
                    title: "View Alerts",
                    url: "alertsList"
                }, {
                    title: "Manage Alerts",
                    url: "manageAlerts"
                }]);

            expect(this.$scope.currentTab).to.be.an("string").and.to.equal("alertsList");
            expect(this.$scope.alertTypeArray).to.be.an("array")
                .and.to.eql([
                    {  name: "Show All" },
                    {  name: "Issues" },
                    {  name: "Opportunities" }
                ]);
            expect(this.$scope.issuesOpportunitiesFilter).to.equal("Show All");

            expect(this.$scope.systemAlertsActive).to.equal(true);
            expect(this.$scope.userAlertsActive).to.equal(false);
            expect(this.$scope.currentTabManage).to.equal("systemAlertsList");
        });

        describe("initViewAlertsTable", function() {
            beforeEach(function() {
                inject(function($controller, $q, alertsService, $timeout, $httpBackend, pubAnalyticService) {
                    pubAnalyticService.fetch();
                    $httpBackend.whenPOST("api/v1/analytics/displayvalue").respond([]);
                    alertsService.fetch();
                    $httpBackend.whenPUT("api/v1/analytics/alert/msgs/read?pageSize=").respond([]);
                    this.event = {stopPropagation: sinon.spy()};
                    this.alertsService = alertsService;
                    this.$timeout = $timeout;

                    $controller("pubAlertsCtrl", {
                        $scope: this.$scope
                    });

                    this.$scope.$digest();
                    $httpBackend.flush();
                });
            });

            it("should change isQuerying to true", function() {
                expect(this.$scope.isQuerying).to.equal(true);
            });

            it("should get response of alerts", function() {
                expect(this.$scope.myresponse).to.be.an("array").and.to.have.length(51);
            });

            it("should order response by `createdAt`", function() {
                expect(this.$scope.myresponse[0].createdAt).to.equal("Mso, Feb 2 11:00 Ntambama");
                expect(this.$scope.myresponse[1].createdAt).to.equal("Mso, Feb 2 10:00 Ntambama");
                expect(this.$scope.myresponse[2].createdAt).to.equal("Mso, Feb 2 9:00 Ntambama");
            });

            it("should format createdAt property", function() {
                inject(function($filter) {
                    var date = $filter("date")("2015-02-02T23:00:27", "EEE, MMM d h:mm a");
                    expect(this.$scope.myresponse[0].createdAt).to.equal(date);
                });
            });


        });

        describe("filterViewAlertsSearch", function() {
            beforeEach(function() {
                inject(function($controller, $timeout) {
                    this.$timeout = $timeout;
                    $controller("pubAlertsCtrl", {
                        $scope: this.$scope
                    });

                    this.$scope.$digest();
                });
            });
            it("should filter alerts list based on search text", function() {
                this.$scope.searchText = "Advertiser";
                this.$scope.filterViewAlertsSearch();
                this.$timeout.flush();
                angular.forEach(this.$scope.shownresponse, function(alertItem){
                    expect(alertItem.message.indexOf("Advertiser")).to.not.equal(-1);
                });

            });
        });

        describe("changeFilter", function() {
            beforeEach(function() {
                inject(function($controller, $q, alertsService, $timeout, $httpBackend, pubAnalyticService) {
                    pubAnalyticService.fetch();
                    $httpBackend.whenPOST("api/v1/analytics/displayvalue").respond([]);
                    alertsService.fetch();
                    $httpBackend.whenPUT("api/v1/analytics/alert/msgs/read?pageSize=").respond([]);
                    this.event = {stopPropagation: sinon.spy()};
                    this.alertsService = alertsService;
                    this.$timeout = $timeout;
                    $controller("pubAlertsCtrl", {
                        $scope: this.$scope
                    });
                    this.$scope.$digest();
                    $httpBackend.flush();
                });
            });

            it("should filter response and show all", function() {
                this.$scope.changeFilter();
                this.$timeout.flush();
                expect(this.$scope.issuesOpportunitiesFilter).to.equal("Show All");
                expect(this.$scope.filteredresponse).to.be.an("array")
                .and.to.have.length(51);
                expect(this.$scope.isQuerying).to.equal(false);
                angular.forEach(this.$scope.shownresponse, function(alertItem){
                    if(alertItem.rank===1){
                        expect(alertItem.rank).to.equal(1);
                    }else{
                        expect(alertItem.rank).to.equal(5);
                    }
                });

            });

            it("should filter response and show only opportunities", function() {
                this.$scope.issuesOpportunitiesFilter = "Opportunities";
                this.$scope.changeFilter();
                this.$timeout.flush();
                expect(this.$scope.issuesOpportunitiesFilter).to.equal("Opportunities");
                expect(this.$scope.filteredresponse).to.be.an("array")
                .and.to.have.length(7);
                expect(this.$scope.isQuerying).to.equal(false);
                angular.forEach(this.$scope.shownresponse, function(alertItem){
                    expect(alertItem.rank).to.equal(1);
                });
            });

            it("should filter response and show only issues", function() {
                this.$scope.issuesOpportunitiesFilter = "Issues";
                this.$scope.changeFilter();
                this.$timeout.flush();
                expect(this.$scope.issuesOpportunitiesFilter).to.equal("Issues");
                expect(this.$scope.filteredresponse).to.be.an("array")
                .and.to.have.length(44);
                expect(this.$scope.isQuerying).to.equal(false);
                angular.forEach(this.$scope.shownresponse, function(alertItem){
                    expect(alertItem.rank).to.equal(5);
                });
            });

        });

        describe("openManageAlertsScreen", function() {
            beforeEach(function() {

                inject(function($location) {
                    this.$location = $location;
                    sinon.spy(this.$location, "url");
                });
            });

            afterEach(function() {
                this.$location.url.restore();
            });
            it("should route to manage alerts", function(){
                this.$scope.openManageAlertsScreen();
                expect(this.$location.url).to.have.been.calledWith("/managealerts");
            });
        });

        describe("callStopPropagation", function () {
            it("should stop propagation", function() {
                this.$scope.callStopPropagation(this.event);
                expect(this.event.stopPropagation).to.have.been.calledOnce;
            });
        });

        describe("isActiveTab", function () {
            it("should be alertsList by default", function() {
                expect(this.$scope.isActiveTab("alertsList")).to.equal(true);
                expect(this.$scope.isActiveTab("manageAlerts")).to.equal(false);
            });
        });

        describe("onClickTab", function() {
            beforeEach(function() {

                inject(function(googleAnalyticsService, $location, $route) {
                    this.googleAnalyticsService = googleAnalyticsService;
                    this.$location = $location;
                    this.$route = $route;

                    sinon.spy(this.googleAnalyticsService, "gTrackPageUsage");
                    sinon.spy(this.$route, "reload");
                    sinon.spy(this.$location, "url");
                });
            });

            afterEach(function() {
                this.googleAnalyticsService.gTrackPageUsage.restore();
                this.$route.reload.restore();
                this.$location.url.restore();
            });

            it("should open `manageAlerts` tab", function() {
                this.$scope.onClickTab({url: "manageAlerts"});
                expect(this.googleAnalyticsService.gTrackPageUsage).to.have.been.calledWith("manage alerts");
            });

            it("should open `viewAlerts` tab on Alerts screen", function() {
                this.$location.path("/alerts");

                this.$scope.onClickTab({url: "alertsList"});
                expect(this.googleAnalyticsService.gTrackPageUsage).to.have.been.calledWith("view alerts");
                expect(this.$route.reload).to.have.been.called;
            });

            it("should open `viewAlerts` tab on Dashboard screen", function() {
                this.$location.path("/dashboard");
                this.$scope.onClickTab({url: "alertsList"});
                expect(this.googleAnalyticsService.gTrackPageUsage).to.have.been.calledWith("view alerts");
                expect(this.$location.url).to.have.been.calledWith("/alerts");
            });
        });


        describe("initManageAlertsMasterConfig", function() {
            beforeEach(function() {
                inject(function($controller, $q, alertsUserSettingService) {
                    this.event = {stopPropagation: sinon.spy()};
                    this.alertsUserSettingService = alertsUserSettingService;

                    sinon.stub(this.alertsUserSettingService, "fetch", function() {
                        var defer = {
                            then: function(cb) {
                                cb({data: getUserSettingsMock()});
                            }
                        };
                        return defer;
                    });

                    $controller("pubAlertsCtrl", {
                        $scope: this.$scope
                    });
                    this.$scope.$digest();
                });
            });

            afterEach(function() {
                this.alertsUserSettingService.fetch.restore();
            });

            it("should change isQuerying to true", function() {
                this.$scope.isQuerying = false;
                this.$scope.onClickTab({url: "manageAlerts"});
                expect(this.$scope.isQuerying).to.equal(true);
            });

            it("should get response of user settings", function() {
                this.$scope.onClickTab({url: "manageAlerts"});
                expect(this.$scope.alertsMainUserSetting).to.be.an("object")
                    .and.to.have.keys(["id", "userId", "featureSwitch", "emailSwitch", "deleteInDays", "isNew"]);
            });
        });

        describe("initManageAlertsTable", function() {
            beforeEach(function() {
                inject(function($controller, alertsConfigService, userSharedReportsService) {
                    this.event = {stopPropagation: sinon.spy()};
                    this.alertsConfigService = alertsConfigService;
                    this.userSharedReportsService = userSharedReportsService;
                    sinon.stub(this.alertsConfigService, "fetch", function() {
                        var defer = {
                            then: function(cb) {
                                cb({data: getStandardAlertsMock()});
                            }
                        };
                        return defer;
                    });


                    sinon.stub(this.userSharedReportsService, "fetch", function() {
                        var defer = {
                            then: function(cb) {
                                cb({data: getSharedReportMock()});
                            }
                        };
                        return defer;
                    });

                    $controller("pubAlertsCtrl", {
                        $scope: this.$scope,
                        alertsConfigService: this.alertsConfigService,
                        userSharedReportsService: this.userSharedReportsService
                    });
                    this.$scope.$digest();
                });
            });

            afterEach(function() {
                this.alertsConfigService.fetch.restore();
                this.userSharedReportsService.fetch.restore();
            });

            it("should get alert rules", function() {
                this.$scope.onClickTab({url: "manageAlerts"});
                expect(this.$scope.alertRulesData).to.be.an("array")
                    .and.to.have.length(1);
                expect(this.$scope.alertRulesData[0]).to.be.an("object")
                    .and.to.have.keys(["id", "userId", "type", "query", "title", "description", "rank",
                            "resourceType", "resourceId", "timeZone", "featureSwitch", "triggerFrequency",
                            "emailSwitch", "emailContentType", "emailIds", "createdAt", "updatedAt"]);

            });


            it("should get emailIdListInfo", function() {
                this.$scope.onClickTab({url: "manageAlerts"});
                expect(this.$scope.emailIdListInfo).to.be.an("array")
                    .and.to.have.length(3);

            });
        });

        describe("removeAlertRow", function() {
            beforeEach(function() {
                inject(function($controller, ngDialog, alertsService) {
                    this.ngDialog = ngDialog;
                    this.alertsService = alertsService;
                    sinon.stub(this.ngDialog, "openConfirm", function() {
                        var defer = {
                            then: function(cb) {
                                cb();
                            }
                        };
                        return defer;
                    });

                    sinon.stub(this.alertsService, "destroy", function(id) {
                        var defer = {
                            success: function(cb) {
                                cb(id);
                            }
                        };
                        return defer;
                    });

                    $controller("pubAlertsCtrl", {
                        $scope: this.$scope
                    });
                    this.$scope.$digest();
                });
            });
            afterEach(function() {
                this.ngDialog.openConfirm.restore();
                this.alertsService.destroy.restore();
            });
            it("should remove alert", function() {
                this.$scope.removeAlertRow({
                    "id": 96091,
                    "ruleId": 19,
                    "title": "New Entrants in Top 10 DSPs revenue",
                    "description": "New Entrants in Top 10 DSPs revenue (last day over weekly moving average)",
                    "message": "You have recieved this alert as there is New Entrants in Top 10 DSPs revenue. Please get in touch with support@pubmatic.com for further details.",
                    "rank": 1,
                    "readFlag": false,
                    "createdAt": "2015-02-02T21:00:27",
                    "updatedAt": "2015-02-04T08:01:01"
                });
                expect(this.ngDialog.openConfirm).to.have.been.called;
                expect(this.alertsService.destroy).to.have.been.calledWith(96091);
            });
        });

        describe("saveAlerts", function() {
            beforeEach(function() {
                inject(function($controller, ngDialog) {
                    this.$scope.alertRulesData = getStandardAlertsMock();
                    this.ngDialog = ngDialog;

                    sinon.stub(this.ngDialog, "openConfirm", function() {
                        var defer = {
                            then: function(cb) {
                                cb({});
                            }
                        };
                        return defer;
                    });

                    $controller("pubAlertsCtrl", {
                        $scope: this.$scope
                    });
                    this.$scope.$digest();
                });
            });
            afterEach(function() {
                this.ngDialog.openConfirm.restore();
            });

            it("should disallow saving and open dialog if alert/email master/slave configuration is on and no users selected under delivery", function() {
                this.$scope.alertsMainUserSetting.emailSwitch = true;
                this.$scope.alertsMainUserSetting.featureSwitch = true;
                this.$scope.alertsSelectedEmailModel = {
                    1: []
                };
                this.$scope.alertsSelectedEmailModel[1].length =0;
                this.$scope.saveAlerts();
                expect(this.$scope.alertsMainUserSetting.emailSwitch).to.equal(true);
                expect(this.$scope.alertsMainUserSetting.featureSwitch).to.equal(true);
                expect(this.$scope.alertRulesData[0].emailSwitch).to.equal(true);
                expect(this.$scope.alertRulesData[0].featureSwitch).to.equal(true);
                expect(this.$scope.alertRulesData[0]).to.be.an("object")
                   .and.to.have.keys(["id","userId","type","query","title","description","rank","resourceType","resourceId","timeZone","featureSwitch","triggerFrequency","emailSwitch","emailContentType","emailIds","createdAt","updatedAt"]);
                expect(this.ngDialog.openConfirm).to.have.been.calledOnce;
            });

            it("expect dialog to be opened when selected purge days is less than currently selected days", function() {
                this.$scope.newDeleteValue = 60;
                this.$scope.baseValue = 90;
                this.$scope.alertsSelectedEmailModel[1] = [];
                this.$scope.alertsMainUserSetting.emailSwitch = true;
                this.$scope.alertsMainUserSetting.featureSwitch = false;
                this.$scope.inputSelectedEmailData[1] = {};
                this.$scope.saveAlerts();
                expect(this.$scope.alertsMainUserSetting.emailSwitch).to.equal(true);
                expect(this.$scope.alertsMainUserSetting.featureSwitch).to.equal(false);
                expect(this.$scope.alertsSelectedEmailModel[1].length).to.equal(0);
                expect(this.$scope.alertRulesData[0].emailSwitch).to.equal(true);
                expect(this.$scope.alertRulesData[0].featureSwitch).to.equal(true);
                expect(this.$scope.alertRulesData[0]).to.be.an("object")
                   .and.to.have.keys(["id","userId","type","query","title","description","rank","resourceType","resourceId","timeZone","featureSwitch","triggerFrequency","emailSwitch","emailContentType","emailIds","createdAt","updatedAt"]);
                expect(this.$scope.newDeleteValue).to.equal(60);
                expect(this.$scope.baseValue).to.equal(90);
                expect(this.ngDialog.openConfirm).to.have.been.called;
            });
        });


        function getUserSettingsMock() {
            return {
                "id": 12,
                "userId": 11528,
                "featureSwitch": false,
                "emailSwitch": false,
                "deleteInDays": 90,
                "isNew": false
            };
        }

        function getStandardAlertsMock() {
            return [{
                "id": 1,
                "userId": 13044,
                "type": "STANDARD",
                "query": "#/slice?f=eyJkIjpbXSwibSI6WyJyZXZlbnVlIl0sImYiOltdLCJ0IjpbOV0sImEiOiJkYXRlIiwiYWYiOltbInJldmVudWUiLCJkcm9wIiwiMTAiXV19",
                "title": "10% Drop in Revenue",
                "description": "10% Drop in Revenue (last day over same day last week)",
                "rank": 5,
                "resourceType": "PUBLISHER",
                "resourceId": 31445,
                "timeZone": "PST",
                "featureSwitch": true,
                "triggerFrequency": "DAILY",
                "emailSwitch": true,
                "emailContentType": "INDIVIDUAL",
                "emailIds": [
                    "12162@mailinator.com",
                    "11819@mailinator.com"
                ],
                "createdAt": "2014-12-05T01:10:19+0000",
                "updatedAt": "2014-12-05T01:10:45+0000"
            }];
        }

        function getSharedReportMock() {
            return [{
                "userId": 13044,
                "firstName": "Peter",
                "lastName": "MacKenzie",
                "email": "13044@mailinator.com"
            }, {
                "userId": 11726,
                "firstName": "Eric",
                "lastName": "Meth",
                "email": "11726@mailinator.com"
            }, {
                "userId": 11727,
                "firstName": "Matthew",
                "lastName": "Romano",
                "email": "11727@mailinator.com"
            }];
        }

    });

}).call(this);
