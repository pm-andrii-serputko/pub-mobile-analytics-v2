/*global describe, beforeEach, it, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Factory: ReportsFactory", function () {
        var savedReports, sharedSavedReports, sharedNotSavedReports, sharedReportList, scheduleReports, updateScheduleReportList, reportResetList;

        beforeEach(function () {
            module("pubSlicerApp");
        });
        beforeEach(module("modules/pubNotifications/toast.html"));

        beforeEach(function () {
            inject(function(savedReportsService, scheduleReportsService, sharedSavedReportsService, sharedNotSavedReportsService, $httpBackend, pubAnalyticService) {
                pubAnalyticService.fetch();
                $httpBackend.whenPOST("api/v1/analytics/displayvalue").respond([]);

                $httpBackend.whenPOST("api/v1/analytics/share/saved").respond([]);

                $httpBackend.whenPOST("api/v1/analytics/share/newcustom").respond([]);

                $httpBackend.whenPUT("api/v1/analytics/schedule/1406").respond([]);

                sharedReportList = reportsResultMock();
                $httpBackend.whenDELETE(/^api\/v1\/analytics\/saved\w*/).respond(sharedReportList);
                savedReportsService.fetch();
                savedReports = savedReportsService;
                sharedSavedReports = sharedSavedReportsService;
                sharedNotSavedReports = sharedNotSavedReportsService;
                scheduleReports = scheduleReportsService;
                updateScheduleReportList= updateMockData();
                savedReportsService.destroy(6251);
                reportResetList = scheduleReportsList();
                scheduleReportsService.reset(reportResetList);
                scheduleReportsService.update(1406,updateScheduleReportList);
                $httpBackend.flush();
            });
        });

        it("should be a function", function () {
            expect(savedReports).to.be.an("object");
        });

        it("should test all reports method", function () {
            var reportList = savedReports.all();
            expect(savedReports.all).to.be.a("function");
            expect(reportList).to.have.length(116);
        });

        it("should test update reports method", function (){

            expect(scheduleReports.update).to.be.a("function");
        });

        it("should test reset reports method", function (){

            var resetReportsResponse, reportResultList;
            reportResultList = reportsResultMock();
            savedReports.reset(reportResultList);
            resetReportsResponse = savedReports.all();
            expect(savedReports.reset).to.be.a("function");
            expect(resetReportsResponse).to.have.length(3);
        });

        it("should test findById report method", function (){
            var resetReportsResponse, reportResultList, findByIdReportModel;
            reportResultList = reportsResultMock();
            savedReports.reset(reportResultList);
            resetReportsResponse = savedReports.all();
            expect(savedReports.reset).to.be.a("function");
            expect(resetReportsResponse).to.have.length(3);
            findByIdReportModel = savedReports.findById(6359);
            expect(findByIdReportModel).to.be.a("object");
            expect(findByIdReportModel.attributes.id).to.equal(6359);
        });

        it("should test groupBy report method", function (){
            var resetReportsResponse, reportResultList, groupByReportModel;
            reportResultList = reportsResultMock();
            savedReports.reset(reportResultList);
            resetReportsResponse = savedReports.all();
            expect(savedReports.reset).to.be.a("function");
            expect(resetReportsResponse).to.have.length(3);
            groupByReportModel = savedReports.groupBy("id");
            expect(groupByReportModel).to.be.a("object");
        });

        function updateMockData(){
            var updateMockDataResult;
            updateMockDataResult = {
                "id":1406,
                "reportId":35,
                "reportName":"Ad Size Performance",
                "reportType":"STANDARD",
                "downloadType":"EXCEL",
                "frequency":"DAILY",
                "day":1,
                "hour":1,
                "email":"abcd@mailinator.co",
                "subject":"abcd",
                "comment":"",
                "reportTypeEnum":"STANDARD",
                "downloadTypeEnum":"EXCEL",
                "frequencyEnum":"DAILY"
            };
            return updateMockDataResult;
        }
        function reportsResultMock(){
            var resultMock;
            resultMock =  [
                {
                    "id":6359,
                    "name":"111AA_18I",
                    "url":"#/slice?f=eyJkIjpbImFkRm9ybWF0SWQiLCJhZFNpemVJZCJdLCJtIjpbInJldmVudWUiLCJwYWlkSW1wcmVzc2lvbnMiLCJlY3BtIl0sImYiOltbInQiLCJyZXZlbnVlIiwidCIsMTAsIiIsIiIsW11dLFsidCIsInJldmVudWUiLCJ0IiwxMCwiIiwiIixbXV1dLCJ0IjpbMl0sImN0IjpbXSwiYyI6eyJ0IjoibGluZWNoYXJ0IiwiZCI6IiIsImEiOiJkYXRlIiwibSI6InJldmVudWUifSwiYSI6ImRhdGUifQ%3D%3D",
                    "description":"",
                    "sharedByUserId":null,
                    "sharedByUser":null,
                    "shared":false,
                    "creationDate":"2015-02-21T23:36:52+0000",
                    "modificationDate":"2015-02-21T23:36:52+0000"
                },
                {
                    "id":6387,
                    "name":"111AA_68W",
                    "url":"#/slice?f=eyJkIjpbImFkRm9ybWF0SWQiLCJhZFNpemVJZCJdLCJtIjpbInJldmVudWUiLCJwYWlkSW1wcmVzc2lvbnMiLCJlY3BtIl0sImYiOltbInQiLCJyZXZlbnVlIiwidCIsMTAsIiIsIiIsW11dLFsidCIsInJldmVudWUiLCJ0IiwxMCwiIiwiIixbXV1dLCJ0IjpbMl0sImN0IjpbXSwiYyI6eyJ0IjoibGluZWNoYXJ0IiwiZCI6IiIsImEiOiJkYXRlIiwibSI6InJldmVudWUifSwiYSI6ImRhdGUifQ%3D%3D",
                    "description":"",
                    "sharedByUserId":null,
                    "sharedByUser":null,
                    "shared":false,
                    "creationDate":"2015-02-23T00:10:56+0000",
                    "modificationDate":"2015-02-23T00:10:56+0000"
                },
                {
                    "id":6251,
                    "name":"111AA_7f8Z",
                    "url":"#/slice?f=eyJkIjpbImFkRm9ybWF0SWQiLCJhZFNpemVJZCJdLCJtIjpbInJldmVudWUiLCJwYWlkSW1wcmVzc2lvbnMiLCJlY3BtIl0sImYiOltbInQiLCJyZXZlbnVlIiwidCIsMTAsIiIsIiIsW11dLFsidCIsInJldmVudWUiLCJ0IiwxMCwiIiwiIixbXV1dLCJ0IjpbMl0sImN0IjpbXSwiYyI6eyJ0IjoibGluZWNoYXJ0IiwiZCI6IiIsImEiOiJkYXRlIiwibSI6InJldmVudWUifSwiYSI6ImRhdGUifQ%3D%3D",
                    "description":"",
                    "sharedByUserId":null,
                    "sharedByUser":null,
                    "shared":false,
                    "creationDate":"2015-02-12T22:41:22+0000",
                    "modificationDate":"2015-02-12T22:41:22+0000"
                }
            ];
            return resultMock;
        }

        function scheduleReportsList(){
            var resultMock;
            resultMock =   [
                {
                    "id":1403,
                    "reportId":44,
                    "reportName":"Geography Report",
                    "reportType":"STANDARD",
                    "downloadType":"CSV",
                    "frequency":"WEEKLY",
                    "day":5,
                    "hour":17,
                    "email":"email_I58W@mailinator.com",
                    "subject":"SampleReport_I58W",
                    "comment":"This is a test comment_I58W",
                    "reportTypeEnum":"STANDARD",
                    "downloadTypeEnum":"CSV",
                    "frequencyEnum":"WEEKLY"
                },
                {
                    "id":1405,
                    "reportId":44,
                    "reportName":"Geography Report",
                    "reportType":"STANDARD",
                    "downloadType":"CSV",
                    "frequency":"WEEKLY",
                    "day":5,
                    "hour":17,
                    "email":"email_xcqd@mailinator.com",
                    "subject":"SampleReport_xcqd",
                    "comment":"This is a test comment_xcqd",
                    "reportTypeEnum":"STANDARD",
                    "downloadTypeEnum":"CSV",
                    "frequencyEnum":"WEEKLY"
                },
                {
                    "id":1406,
                    "reportId":35,
                    "reportName":"Ad Size Performance",
                    "reportType":"STANDARD",
                    "downloadType":"EXCEL",
                    "frequency":"DAILY",
                    "day":1,
                    "hour":1,
                    "email":"abcd@mailinator.co",
                    "subject":"abcd",
                    "comment":"",
                    "reportTypeEnum":"STANDARD",
                    "downloadTypeEnum":"EXCEL",
                    "frequencyEnum":"DAILY"
                }
            ];
            return resultMock;
        }

    });

}).call(this);