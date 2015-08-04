/*global describe, beforeEach, it, expect, inject*/
(function () {
    "use strict";

    describe("domain.AlertsModel", function () {

        beforeEach(function () {
            module("pub-ui-analytics.domain");
        });

        beforeEach(function () {
            inject(function(AlertsModel) {
                this.AlertsModel = AlertsModel;
                this.mock = {
                    "id":96011,
                    "ruleId":1,
                    "title":"10% Drop in Revenue",
                    "description":"10% Drop in Revenue (last day over same day last week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T22:10:50",
                    "updatedAt":"2015-02-05T13:58:01"
                };
            });
        });

        it("should be registered in the 'domain' module", function () {
            expect(this.AlertsModel).to.be.a("function");
        });

        it("should have default values", function () {
            var model = new this.AlertsModel();

            expect(model).to.be.an("object");
            expect(model.attributes.id).to.equal(null);
            expect(model.attributes.ruleId).to.equal(null);
            expect(model.attributes.title).to.equal("");
            expect(model.attributes.description).to.equal("");
            expect(model.attributes.message).to.equal("");
            expect(model.attributes.rank).to.equal(null);
            expect(model.attributes.readFlag).to.equal(false);
            expect(model.attributes.createdAt).to.equal("");
            expect(model.attributes.updatedAt).to.equal("");
        });

        it("should set passed attributes", function () {
            var model = new this.AlertsModel(this.mock);
            expect(model).to.be.an("object");
            expect(model.attributes.id).to.equal(96011);
            expect(model.attributes.ruleId).to.equal(1);
            expect(model.attributes.title).to.equal("10% Drop in Revenue");
            expect(model.attributes.description).to.equal("10% Drop in Revenue (last day over same day last week)");
            expect(model.attributes.message).to.equal("You have recieved this alert as there is 10% Drop in Revenue. Please get in touch with support@pubmatic.com for further details.");
            expect(model.attributes.rank).to.equal(5);
            expect(model.attributes.readFlag).to.equal(false);
            expect(model.attributes.createdAt).to.equal("2015-02-02T22:10:50");
            expect(model.attributes.updatedAt).to.equal("2015-02-05T13:58:01");
        });

        it("should call get function", function () {
            var model, attr;
            model = new this.AlertsModel(this.mock);
            attr = model.get("id");
            expect(attr).to.equal(this.mock.id);
        });

        it("should call getUrl function", function () {
            var model, attr;
            model = new this.AlertsModel(this.mock);
            attr = model.getUrl();
            expect(attr).to.equal(this.mock.url);
        });

        it("should call getId function", function () {
            var model, attr;
            model = new this.AlertsModel(this.mock);
            attr = model.getId();
            expect(attr).to.equal(this.mock.id);
        });

        it("should call getRuleId function", function () {
            var model, attr;
            model = new this.AlertsModel(this.mock);
            attr = model.getRuleId();
            expect(attr).to.equal(this.mock.ruleId);
        });

        it("should call getTitle function", function () {
            var model, attr;
            model = new this.AlertsModel(this.mock);
            attr = model.getTitle();
            expect(attr).to.equal(this.mock.title);
        });

        it("should call getDesription function", function () {
            var model, attr;
            model = new this.AlertsModel(this.mock);
            attr = model.getDescription();
            expect(attr).to.equal(this.mock.description);
        });

        it("should call getReadFlag function", function () {
            var model, attr;
            model = new this.AlertsModel(this.mock);
            attr = model.getReadFlag();
            expect(attr).to.equal(this.mock.readFlag);
        });

        it("should call getCreatedAt function", function () {
            var model, attr;
            model = new this.AlertsModel(this.mock);
            attr = model.getCreatedAt();
            expect(attr).to.equal(this.mock.createdAt);
        });

        it("should call getUpdatedAt function", function () {
            var model, attr;
            model = new this.AlertsModel(this.mock);
            attr = model.getUpdatedAt();
            expect(attr).to.equal(this.mock.updatedAt);
        });

    });

}).call(this);