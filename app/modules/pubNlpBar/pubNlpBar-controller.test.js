/*global describe, sinon, afterEach, it, beforeEach, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Controller: pubNlpBarCtrl", function () {

        beforeEach(module("pubSlicerApp"));
        beforeEach(module("modules/pubNotifications/toast.html"));
        beforeEach(inject(function ($rootScope, $controller) {
            this.$scope = $rootScope.$new();
            this.controller = $controller("pubNlpBarCtrl", {
                $scope: this.$scope
            });
        }));

	    beforeEach(inject(function ($compile, $rootScope, $httpBackend, pubAnalyticService) {
	        pubAnalyticService.fetch();
	        $httpBackend.whenPOST("api/v1/analytics/displayvalue").respond([]);
	        $httpBackend.flush();
	    }));

        it("should exist", function () {
            expect(this.controller).to.exist;
            expect(this.controller).to.be.an("object");
        });

        it("clean up function should clean up nlp display", function () {
            this.$scope.clearNlp();
            expect(this.$scope.textProcessed).to.equal(false);
            expect(this.$scope.nlpDisplay).to.equal("");
        });

        //TODO rohit continutes unit tests for the alert function
        describe("openAlertsConfirm", function() {
            beforeEach(function () {
                inject(function($injector) {
                    this.googleAnalyticsService = $injector.get("googleAnalyticsService");
                    this.alertsService = $injector.get("alertsService");
                    sinon.spy(this.googleAnalyticsService, "gTrackEventUsage");
                    sinon.stub(this.alertsService, "fetch", function() {
                        var defer = {
                            then: function(cb) {
                                cb({data: getAlerts()});
                            }
                        };
                        return defer;
                    });
                    $injector.get("$controller")("pubNlpBarCtrl", {
                        $scope: this.$scope
                    });
                    this.$scope.$digest();

                });
            });
            afterEach(function() {
                this.googleAnalyticsService.gTrackEventUsage.restore();
                this.alertsService.fetch.restore();
            });
            it("should check if all values are initialized", function() {
                this.$scope.openAlertsConfirm();
                expect(this.$scope.alertDropdownClosed).to.equal(true);
                expect(this.googleAnalyticsService.gTrackEventUsage).to.be.calledOnce;
                expect(this.$scope.alertsNotificationResponse).to.be.an("array");
                expect(this.$scope.alertDisplay).to.be.equal(true);
                var alertList = getAlerts();
                expect(this.$scope.alertsNotificationResponse.length).to.equal(alertList.length);
                expect(this.$scope.setMutex).to.equal(true);
                expect(this.$scope.checkedNotification).to.equal(false);
            });
        });
        function getAlerts(){

            return [
                {
                    "id":149,
                    "ruleId":21,
                    "title":"New Entrants in Top 10 Advertisers by total lost bids",
                    "description":"New Entrants in Top 10 Advertisers by total lost bids (last week over previous week)",
                    "message":"New Entrants in Top 10 Advertisers by total lost bids (last week over previous week) (old list:Name is not available (172600),Unknown,Future Ads,Name is not available (92134),Name is not available (125437),PayPal,Western Union Holdings Inc,Name is not available (96995),Mercedes Benz,Verizon Wireless; new list:Unknown,Future Ads,PayPal,Verizon Wireless,Name is not available (125437),Name is not available (172600),Name is not available (92134),Name is not available (96995),Western Union Holdings Inc,State Farm)",
                    "rank":1,
                    "readFlag":false,
                    "createdAt":"2015-06-26T05:14:44",
                    "updatedAt":"2015-06-26T05:14:44"
                },{
                    "id":148,
                    "ruleId":16,
                    "title":"10% Drop in Revenue for any of top 10 Buyers",
                    "description":"10% Drop in Revenue for any of top 10 Buyers (last week over previous week)",
                    "message":"10% Drop in Revenue for any of top 10 Buyers (last week over previous week) (old:1782.718567764706; new:1344.4379095714287)",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-06-26T05:14:10",
                    "updatedAt":"2015-06-26T05:14:10"
                },{
                    "id":147,
                    "ruleId":15,
                    "title":"10% Drop in Revenue for any of top 10 DSPs",
                    "description":"10% Drop in Revenue for any of top 10 DSPs (last week over previous week)",
                    "message":"10% Drop in Revenue for any of top 10 DSPs (last week over previous week) (old:4505.040674560976; new:3812.4571297297293)",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-06-26T05:14:09",
                    "updatedAt":"2015-06-26T05:14:09"
                },{
                    "id":146,
                    "ruleId":21,
                    "title":"New Entrants in Top 10 Advertisers by total lost bids",
                    "description":"New Entrants in Top 10 Advertisers by total lost bids (last week over previous week)",
                    "message":"New Entrants in Top 10 Advertisers by total lost bids (last week over previous week) (old list:Name is not available (172600),Unknown,Future Ads,Name is not available (92134),Name is not available (125437),PayPal,Western Union Holdings Inc,Name is not available (96995),Mercedes Benz,Verizon Wireless; new list:Unknown,Future Ads,PayPal,Verizon Wireless,Name is not available (125437),Name is not available (172600),Name is not available (92134),Name is not available (96995),Western Union Holdings Inc,State Farm)",
                    "rank":1,
                    "readFlag":false,
                    "createdAt":"2015-06-25T05:14:51",
                    "updatedAt":"2015-06-25T05:14:51"
                },{
                    "id":145,
                    "ruleId":16,
                    "title":"10% Drop in Revenue for any of top 10 Buyers",
                    "description":"10% Drop in Revenue for any of top 10 Buyers (last week over previous week)",
                    "message":"10% Drop in Revenue for any of top 10 Buyers (last week over previous week) (old:1782.718567764706; new:1344.4379095714287)",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-06-25T05:14:15",
                    "updatedAt":"2015-06-25T05:14:15"
                }
            ];
        }

    });
}).call(this);
