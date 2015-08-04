/*global describe, beforeEach, it, expect, inject*/
(function () {
    "use strict";

    describe("domain.AlertsConfigModel", function () {

        beforeEach(function () {
            module("pub-ui-analytics.domain");
        });

        beforeEach(function () {
            inject(function(AlertsConfigModel) {
                this.AlertsConfigModel = AlertsConfigModel;
                this.mock = {
                    "id":1,
                    "userId":11528,
                    "type":"STANDARD",
                    "query":"#/slice?f=eyJkIjpbXSwibSI6WyJyZXZlbnVlIl0sImYiOltdLCJ0IjpbOV0sImEiOiJkYXRlIiwiYWYiOltbInJldmVudWUiLCJkcm9wIiwiMTAiXV19",
                    "title":"10% Drop in Revenue",
                    "description":"10% Drop in Revenue (last day over same day last week)",
                    "rank":5,
                    "resourceType":"PUBLISHER",
                    "resourceId":31445,
                    "timeZone":"PST",
                    "featureSwitch":true,
                    "triggerFrequency":"DAILY",
                    "emailSwitch":true,
                    "emailContentType":"INDIVIDUAL",
                    "emailIds":[
                        "12162@mailinator.com",
                        "11819@mailinator.com"
                    ],
                    "createdAt":"2014-12-05T01:10:19+0000",
                    "updatedAt":"2014-12-05T01:10:45+0000"
                };
            });
        });

        it("should be registered in the 'domain' module", function () {
            expect(this.AlertsConfigModel).to.be.a("function");
        });

        it("should have default values", function () {
            var model = new this.AlertsConfigModel();

            expect(model).to.be.an("object");
            expect(model.attributes.id).to.equal(null);
            expect(model.attributes.userId).to.equal(null);
            expect(model.attributes.type).to.equal("");
            expect(model.attributes.query).to.equal("");
            expect(model.attributes.title).to.equal("");
            expect(model.attributes.description).to.equal("");
            expect(model.attributes.rank).to.equal(0);
            expect(model.attributes.featureSwitch).to.equal(false);
            expect(model.attributes.triggerFrequency).to.equal("");
            expect(model.attributes.emailSwitch).to.equal(false);
            expect(model.attributes.createdAt).to.equal("");
            expect(model.attributes.updatedAt).to.equal("");
            expect(model.attributes.emailIds).to.be.a("array");
        });

        it("should set passed attributes", function () {
            var model = new this.AlertsConfigModel(this.mock);
            expect(model).to.be.an("object");
            expect(model.attributes.id).to.equal(1);
            expect(model.attributes.userId).to.equal(11528);
            expect(model.attributes.type).to.equal("STANDARD");
            expect(model.attributes.query).to.equal("#/slice?f=eyJkIjpbXSwibSI6WyJyZXZlbnVlIl0sImYiOltdLCJ0IjpbOV0sImEiOiJkYXRlIiwiYWYiOltbInJldmVudWUiLCJkcm9wIiwiMTAiXV19");
            expect(model.attributes.title).to.equal("10% Drop in Revenue");
            expect(model.attributes.description).to.equal("10% Drop in Revenue (last day over same day last week)");
            expect(model.attributes.rank).to.equal(5);
            expect(model.attributes.featureSwitch).to.equal(true);
            expect(model.attributes.triggerFrequency).to.equal("DAILY");
            expect(model.attributes.emailSwitch).to.equal(true);
            expect(model.attributes.createdAt).to.equal("2014-12-05T01:10:19+0000");
            expect(model.attributes.updatedAt).to.equal("2014-12-05T01:10:45+0000");
        });

        it("should call get and set functions", function () {
            var model, attrGet, attrSet;
            model = new this.AlertsConfigModel(this.mock);
            attrGet = model.get("id");
            expect(attrGet).to.equal(this.mock.id);
            model.set("id");
            attrSet = model.get("id");
            expect(attrSet).to.equal(this.mock.id);

        });

        it("should call getQuery and setQuery functions", function () {
            var model, attrGet, attrSet;
            model = new this.AlertsConfigModel(this.mock);
            attrGet = model.getQuery();
            expect(attrGet).to.equal(this.mock.query);
            model.setQuery(this.mock.query);
            attrSet = model.getQuery();
            expect(attrSet).to.equal(this.mock.query);
        });

        it("should call getId and setId functions", function () {
            var model, attrGet, attrSet;
            model = new this.AlertsConfigModel(this.mock);
            attrGet = model.getId();
            expect(attrGet).to.equal(this.mock.id);
            model.setId(this.mock.id);
            attrSet = model.getId();
            expect(attrSet).to.equal(this.mock.id);
        });


        it("should call getDescription and setDescription functions", function () {
            var model, attrGet, attrSet;
            model = new this.AlertsConfigModel(this.mock);
            attrGet = model.getDescription();
            expect(attrGet).to.equal(this.mock.description);
            model.setDescription(this.mock.description);
            attrSet = model.getDescription();
            expect(attrSet).to.equal(this.mock.description);
        });

        it("should call getUserId and setUserId functions", function () {
            var model, attrGet, attrSet;
            model = new this.AlertsConfigModel(this.mock);
            attrGet = model.getUserId();
            expect(attrGet).to.equal(this.mock.userId);
            model.setUserId(this.mock.userId);
            attrSet = model.getUserId();
            expect(attrSet).to.equal(this.mock.userId);
        });

        it("should call getTitle and setTitle functions", function () {
            var model, attrGet, attrSet;
            model = new this.AlertsConfigModel(this.mock);
            attrGet = model.getTitle();
            expect(attrGet).to.equal(this.mock.title);
            model.setTitle(this.mock.title);
            attrSet = model.getTitle();
            expect(attrSet).to.equal(this.mock.title);
        });

        it("should call getEmailIds and setEmailIds functions", function () {
            var model, attrGet, attrSet;
            model = new this.AlertsConfigModel(this.mock);
            attrGet = model.getEmailIds();
            expect(attrGet).to.equal(this.mock.emailIds);
            model.setEmailIds(this.mock.emailIds);
            attrSet = model.getEmailIds();
            expect(attrSet).to.equal(this.mock.emailIds);
        });

        it("should call getCreatedAt and setCreatedAt functions", function () {
            var model, attrGet, attrSet;
            model = new this.AlertsConfigModel(this.mock);
            attrGet = model.getCreatedAt();
            expect(attrGet).to.equal(this.mock.createdAt);
            model.setCreatedAt(this.mock.createdAt);
            attrSet = model.getCreatedAt();
            expect(attrSet).to.equal(this.mock.createdAt);
        });

        it("should call getUpdatedAt and setUpdatedAt functions", function () {
            var model, attrGet, attrSet;
            model = new this.AlertsConfigModel(this.mock);
            attrGet = model.getUpdatedAt();
            expect(attrGet).to.equal(this.mock.updatedAt);
            model.setUpdatedAt(this.mock.updatedAt);
            attrSet = model.getUpdatedAt();
            expect(attrSet).to.equal(this.mock.updatedAt);
        });

        it("should call getRank and setRank functions", function () {
            var model, attrGet, attrSet;
            model = new this.AlertsConfigModel(this.mock);
            attrGet = model.getRank();
            expect(attrGet).to.equal(this.mock.rank);
            model.setRank(this.mock.rank);
            attrSet = model.getRank();
            expect(attrSet).to.equal(this.mock.rank);
        });

        it("should call getTriggerFrequency and setTriggerFrequency functions", function () {
            var model, attrGet, attrSet;
            model = new this.AlertsConfigModel(this.mock);
            attrGet = model.getTriggerFrequency();
            expect(attrGet).to.equal(this.mock.triggerFrequency);
            model.setTriggerFrequency(this.mock.triggerFrequency);
            attrSet = model.getTriggerFrequency();
            expect(attrSet).to.equal(this.mock.triggerFrequency);
        });


        it("should call getEmailContentType and setEmailContentType functions", function () {
            var model, attrGet, attrSet;
            model = new this.AlertsConfigModel(this.mock);
            attrGet = model.getEmailContentType();
            expect(attrGet).to.equal(this.mock.emailContentType);
            model.setEmailContentType(this.mock.emailContentType);
            attrSet = model.getEmailContentType();
            expect(attrSet).to.equal(this.mock.emailContentType);
        });

        it("should call getFeatureSwitch and setFeatureSwitch functions", function () {
            var model, attrGet, attrSet;
            model = new this.AlertsConfigModel(this.mock);
            attrGet = model.getFeatureSwitch();
            expect(attrGet).to.equal(this.mock.featureSwitch);
            model.setFeatureSwitch(this.mock.featureSwitch);
            attrSet = model.getFeatureSwitch();
            expect(attrSet).to.equal(this.mock.featureSwitch);
        });

        it("should call getEmailSwitch and setEmailSwitch functions", function () {
            var model, attrGet, attrSet;
            model = new this.AlertsConfigModel(this.mock);
            attrGet = model.getEmailSwitch();
            expect(attrGet).to.equal(this.mock.emailSwitch);
            model.setEmailSwitch(this.mock.emailSwitch);
            attrSet = model.getEmailSwitch();
            expect(attrSet).to.equal(this.mock.emailSwitch);
        });

        it("should call getType and setType functions", function () {
            var model, attrGet, attrSet;
            model = new this.AlertsConfigModel(this.mock);
            attrGet = model.getType();
            expect(attrGet).to.equal(this.mock.type);
            model.setType(this.mock.type);
            attrSet = model.getType();
            expect(attrSet).to.equal(this.mock.type);
        });



    });

}).call(this);