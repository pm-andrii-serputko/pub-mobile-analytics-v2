/*global describe, beforeEach, it, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Factory: AlertsFactory", function () {
        var alertsViewService, alertsFetchData, alertsRead, alertsConfig, alertUserSettingMockResult, alertsViewMockResult, alertsCount, alertsUserSetting;

        beforeEach(function () {
            module("pubSlicerApp");
        });
        beforeEach(module("modules/pubNotifications/toast.html"));

        beforeEach(function () {
            inject(function(alertsService, $httpBackend, pubAnalyticService, alertsCountService, alertsReadService, alertsConfigService, alertsUserSettingService) {
                pubAnalyticService.fetch();
                $httpBackend.whenPOST("api/v1/analytics/displayvalue").respond([]);
                alertsService.fetch();
                $httpBackend.whenPUT("api/v1/analytics/alert/msgs/read?pageSize=").respond([]);
                alertsViewMockResult = alertsResultMock();
                $httpBackend.whenDELETE(/^api\/v1\/analytics\/alert\/msgs\w*/).respond(alertsViewMockResult);
                $httpBackend.whenGET("api/v1/analytics/alert/msgs/count?pageSize=").respond({"readCount":0,"unreadCount":51});
                alertUserSettingMockResult = alertsUserSettingResultMock();
                $httpBackend.whenPUT("api/v1/analytics/user/setting/12?pageSize=").respond(alertUserSettingMockResult);

                alertsRead = alertsReadService;
                alertsViewService = alertsService;
                alertsConfig = alertsConfigService;
                alertsCount = alertsCountService;
                alertsUserSetting = alertsUserSettingService;

                /* call to delete method */
                alertsViewService.destroy(96089);
                /*call to fetch all alerts */
                alertsViewService.fetch().then(function(data){
                    alertsFetchData = data.data;
                    alertsRead.update();
                });

                /* call to fetch alert count */
                alertsCountService.fetch();

                /* call to fetch user data */
                alertsUserSetting.fetch();

                /*call to fetch standard alerts */
                alertsConfig.fetch("STANDARD");

                alertsUserSetting.update(12, alertUserSettingMockResult);

                $httpBackend.flush();
            });
        });

        it("should be a function", function () {
            expect(alertsViewService).to.be.an("object");
        });

        it("should test all alert method", function () {
            var alertList = alertsViewService.all();
            expect(alertsViewService.all).to.be.a("function");
            expect(alertList).to.have.length(51);
        });

        it("should test reset alert  method", function (){
            var resetAlertResponse, alertMockResult;
            alertMockResult = alertsResultMock();
            alertsViewService.reset(alertMockResult);
            resetAlertResponse = alertsViewService.all();
            expect(alertsViewService.reset).to.be.a("function");
            expect(resetAlertResponse).to.have.length(3);
        });

        it("should test update alert  method", function (){
            expect(alertsRead.update).to.be.a("function");
        });

        it("should test destroy alert method", function (){
            var alertList = alertsViewService.all();
            expect(alertsViewService.destroy).to.be.a("function");
            expect(alertList).to.have.length(51);

        });

        it("should test findById alert method", function (){
            var resetAlertResponse, alertMockResult, findByIdAlertModel;
            alertMockResult = alertsResultMock();
            alertsViewService.reset(alertMockResult);
            resetAlertResponse = alertsViewService.all();
            expect(alertsViewService.reset).to.be.a("function");
            expect(resetAlertResponse).to.have.length(3);
            findByIdAlertModel = alertsViewService.findById(96089);
            expect(findByIdAlertModel).to.be.a("object");
            expect(findByIdAlertModel.attributes.id).to.equal(96089);
        });

        function alertsResultMock(){
            var resultMock;
            resultMock =  [
                {
                    "id":96089,
                    "ruleId":17,
                    "title":"New Entrants in Top 10 Advertisers by revenue",
                    "description":"New Entrants in Top 10 Advertisers by revenue (last day over weekly moving average)",
                    "message":"You have recieved this alert as there is New Entrants in Top 10 Advertisers by revenue. Please get in touch with support@pubmatic.com for further details.",
                    "rank":1,
                    "readFlag":false,
                    "createdAt":"2015-02-02T23:00:27",
                    "updatedAt":"2015-02-03T02:39:01"
                },
                {
                    "id":96090,
                    "ruleId":18,
                    "title":"New Entrants in Top 10 Buyers revenue",
                    "description":"New Entrants in Top 10 Buyers revenue (last day over weekly moving average)",
                    "message":"You have recieved this alert as there is New Entrants in Top 10 Buyers revenue. Please get in touch with support@pubmatic.com for further details.",
                    "rank":1,
                    "readFlag":false,
                    "createdAt":"2015-02-02T23:00:27",
                    "updatedAt":"2015-02-03T02:39:01"
                },
                {
                    "id":96091,
                    "ruleId":19,
                    "title":"New Entrants in Top 10 DSPs revenue",
                    "description":"New Entrants in Top 10 DSPs revenue (last day over weekly moving average)",
                    "message":"You have recieved this alert as there is New Entrants in Top 10 DSPs revenue. Please get in touch with support@pubmatic.com for further details.",
                    "rank":1,
                    "readFlag":false,
                    "createdAt":"2015-02-02T23:00:27",
                    "updatedAt":"2015-02-03T02:39:01"
                }
            ];
            return resultMock;
        }

        function alertsUserSettingResultMock(){
            var mockResult;
            mockResult = {
                "id":12,
                "userId":11528,
                "featureSwitch":false,
                "emailSwitch":false,
                "deleteInDays":90,
                "isNew":false
            };
            return mockResult;
        }

    });

}).call(this);