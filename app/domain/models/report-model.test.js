/*global describe, beforeEach, it, expect, inject*/
(function () {
    "use strict";

    describe("domain.ReportModel", function () {
        var slicerService;
        beforeEach(function () {
            module("pub-ui-analytics");
        });

        beforeEach(function () {
            inject(function(ReportModel, pubAnalyticService, slicerURLParamsService, $httpBackend) {
                pubAnalyticService.fetch();
                $httpBackend.whenPOST("api/v1/analytics/displayvalue").respond([]);
                $httpBackend.flush();
                slicerService = slicerURLParamsService;
                this.ReportModel = ReportModel;
                this.mock = {
                    "id":6359,
                    "name":"111AA_18I",
                    "url":"#/slice?f=eyJkIjpbImFkRm9ybWF0SWQiLCJhZFNpemVJZCJdLCJtIjpbInJldmVudWUiLCJwYWlkSW1wcmVzc2lvbnMiLCJlY3BtIl0sImYiOltbInQiLCJyZXZlbnVlIiwidCIsMTAsIiIsIiIsW11dLFsidCIsInJldmVudWUiLCJ0IiwxMCwiIiwiIixbXV1dLCJ0IjpbMl0sImN0IjpbXSwiYyI6eyJ0IjoibGluZWNoYXJ0IiwiZCI6IiIsImEiOiJkYXRlIiwibSI6InJldmVudWUifSwiYSI6ImRhdGUifQ%3D%3D",
                    "description":"-",
                    "groupId":null,
                    "groupName":"",
                    "updatedAt":"2015-02-21T23:36:52+0000",
                    "sharedByUserId":null,
                    "sharedByUser":null,
                    "shared":false
                };
                var model = new this.ReportModel(this.mock);
                model.validate();
            });
        });

        it("should be registered in the 'domain' module", function () {
            expect(this.ReportModel).to.be.a("function");
        });

        it("should have default values", function () {
            var model = new this.ReportModel();

            expect(model).to.be.an("object");
            expect(model.attributes.id).to.equal(null);
            expect(model.attributes.url).to.equal("");
            expect(model.attributes.name).to.equal("");
            expect(model.attributes.description).to.equal("");
            expect(model.attributes.groupId).to.equal(null);
            expect(model.attributes.groupName).to.equal("");
            expect(model.attributes.sharedByUser).to.be.an("object");
            expect(model.attributes.shared).to.equal(false);
        });

        it("should set passed attributes", function () {
            var model = new this.ReportModel(this.mock);
            expect(model).to.be.an("object");
            expect(model.attributes.id).to.equal(6359);
            expect(model.attributes.url).to.equal("#/slice?f=eyJkIjpbImFkRm9ybWF0SWQiLCJhZFNpemVJZCJdLCJtIjpbInJldmVudWUiLCJwYWlkSW1wcmVzc2lvbnMiLCJlY3BtIl0sImYiOltbInQiLCJyZXZlbnVlIiwidCIsMTAsIiIsIiIsW11dLFsidCIsInJldmVudWUiLCJ0IiwxMCwiIiwiIixbXV1dLCJ0IjpbMl0sImN0IjpbXSwiYyI6eyJ0IjoibGluZWNoYXJ0IiwiZCI6IiIsImEiOiJkYXRlIiwibSI6InJldmVudWUifSwiYSI6ImRhdGUifQ%3D%3D");
            expect(model.attributes.name).to.equal("111AA_18I");
            expect(model.attributes.description).to.equal("-");
            expect(model.attributes.sharedByUser).to.be.an("object");
            expect(model.attributes.shared).to.equal(false);
        });

        it("should call get and set functions", function () {
            var model, attrGet, attrSet;
            model = new this.ReportModel(this.mock);
            attrGet = model.get("id");
            expect(attrGet).to.equal(this.mock.id);
            model.set("id");
            attrSet = model.get("id");
            expect(attrSet).to.equal(this.mock.id);

        });

        it("should call getUrl and setUrl functions", function () {
            var model, attrGet, attrSet;
            model = new this.ReportModel(this.mock);
            attrGet = model.getUrl();
            expect(attrGet).to.equal(this.mock.url);
            model.setUrl(this.mock.url);
            attrSet = model.getUrl();
            expect(attrSet).to.equal(this.mock.url);
        });

        it("should call getId and setId functions", function () {
            var model, attrGet, attrSet;
            model = new this.ReportModel(this.mock);
            attrGet = model.getId();
            expect(attrGet).to.equal(this.mock.id);
            model.setId(this.mock.id);
            attrSet = model.getId();
            expect(attrSet).to.equal(this.mock.id);
        });


        it("should call getDescription and setDescription functions", function () {
            var model, attrGet, attrSet;
            model = new this.ReportModel(this.mock);
            attrGet = model.getDescription();
            expect(attrGet).to.equal(this.mock.description);
            model.setDescription(this.mock.description);
            attrSet = model.getDescription();
            expect(attrSet).to.equal(this.mock.description);
        });

        it("should call getName and setName functions", function () {
            var model, attrGet, attrSet;
            model = new this.ReportModel(this.mock);
            attrGet = model.getName();
            expect(attrGet).to.equal(this.mock.name);
            model.setName(this.mock.name);
            attrSet = model.getName();
            expect(attrSet).to.equal(this.mock.name);
        });

        it("should call getGroupId and setGroupId functions", function () {
            var model, attrGet, attrSet;
            model = new this.ReportModel(this.mock);
            attrGet = model.getGroupId();
            expect(attrGet).to.equal(this.mock.groupId);
            model.setGroupId(this.mock.groupId);
            attrSet = model.getGroupId();
            expect(attrSet).to.equal(this.mock.groupId);
        });

        it("should call getGroupName and setGroupName functions", function () {
            var model, attrGet, attrSet;
            model = new this.ReportModel(this.mock);
            attrGet = model.getGroupName();
            expect(attrGet).to.equal(this.mock.groupName);
            model.setGroupName(this.mock.groupName);
            attrSet = model.getGroupName();
            expect(attrSet).to.equal(this.mock.groupName);
        });

        it("should call getUpdatedAt and setUpdatedAt functions", function () {
            var model, attrGet, attrSet;
            model = new this.ReportModel(this.mock);
            attrGet = model.getUpdatedAt();
            expect(attrGet).to.equal("");
            model.setUpdatedAt(this.mock.updatedAt);
            attrSet = model.getUpdatedAt();
            expect(attrSet).to.equal(this.mock.updatedAt);
        });

        it("should call getShared and setShared functions", function () {
            var model, attrGet, attrSet;
            model = new this.ReportModel(this.mock);
            attrGet = model.getShared();
            expect(attrGet).to.equal(this.mock.shared);
            model.setShared(this.mock.shared);
            attrSet = model.getShared();
            expect(attrSet).to.equal(this.mock.shared);
        });

        it("should call getSharedByUserInformation functions", function () {
            var model, attrGet;
            model = new this.ReportModel(this.mock);
            attrGet = model.getSharedByUserInformation();
            expect(attrGet).to.equal("");
        });
    });

}).call(this);