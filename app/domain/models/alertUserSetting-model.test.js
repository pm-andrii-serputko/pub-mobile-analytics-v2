/*global describe, beforeEach, it, expect, inject*/
(function () {
    "use strict";

    describe("domain.AlertsUserSettingModel", function () {

        beforeEach(function () {
            module("pub-ui-analytics.domain");
        });

        beforeEach(function () {
            inject(function(AlertsUserSettingModel) {
                this.AlertsUserSettingModel = AlertsUserSettingModel;
                this.mock = {
                    "id":12,
                    "userId":11528,
                    "featureSwitch":false,
                    "emailSwitch":false,
                    "deleteInDays":90,
                    "isNew":false
                };
            });
        });

        it("should be registered in the 'domain' module", function () {
            expect(this.AlertsUserSettingModel).to.be.a("function");
        });

        it("should have default values", function () {
            var model = new this.AlertsUserSettingModel();
            expect(model).to.be.an("object");
            expect(model.attributes.id).to.equal(null);
            expect(model.attributes.featureSwitch).to.equal(false);
            expect(model.attributes.emailSwitch).to.equal(false);
            expect(model.attributes.userId).to.equal(null);
        });

        it("should set passed attributes", function () {
            var model = new this.AlertsUserSettingModel(this.mock);
            expect(model).to.be.an("object");
            expect(model.attributes.id).to.equal(12);
            expect(model.attributes.featureSwitch).to.equal(false);
            expect(model.attributes.emailSwitch).to.equal(false);
            expect(model.attributes.userId).to.equal(11528);
        });

        it("should call get and set functions", function () {
            var model, attrGet, attrSet;
            model = new this.AlertsUserSettingModel(this.mock);
            attrGet = model.get("id");
            expect(attrGet).to.equal(this.mock.id);
            model.set("id");
            attrSet = model.get("id");
            expect(attrSet).to.equal(this.mock.id);

        });

        it("should call getId and setId functions", function () {
            var model, attrGet, attrSet;
            model = new this.AlertsUserSettingModel(this.mock);
            attrGet = model.getId();
            expect(attrGet).to.equal(this.mock.id);
            model.setId(this.mock.id);
            attrSet = model.getId();
            expect(attrSet).to.equal(this.mock.id);
        });

        it("should call getUserId and setUserId functions", function () {
            var model, attrGet, attrSet;
            model = new this.AlertsUserSettingModel(this.mock);
            attrGet = model.getUserId();
            expect(attrGet).to.equal(this.mock.userId);
            model.setUserId(this.mock.userId);
            attrSet = model.getUserId();
            expect(attrSet).to.equal(this.mock.userId);
        });

        it("should call getFeatureSwitch and setFeatureSwitch functions", function () {
            var model, attrGet, attrSet;
            model = new this.AlertsUserSettingModel(this.mock);
            attrGet = model.getFeatureSwitch();
            expect(attrGet).to.equal(this.mock.featureSwitch);
            model.setFeatureSwitch(this.mock.featureSwitch);
            attrSet = model.getFeatureSwitch();
            expect(attrSet).to.equal(this.mock.featureSwitch);
        });

        it("should call getEmailSwitch and setEmailSwitch functions", function () {
            var model, attrGet, attrSet;
            model = new this.AlertsUserSettingModel(this.mock);
            attrGet = model.getEmailSwitch();
            expect(attrGet).to.equal(this.mock.emailSwitch);
            model.setEmailSwitch(this.mock.emailSwitch);
            attrSet = model.getEmailSwitch();
            expect(attrSet).to.equal(this.mock.emailSwitch);
        });

        it("should call isValid function", function () {
            var model;
            model = new this.AlertsUserSettingModel(this.mock);
            model.isValid();
        });


    });

}).call(this);