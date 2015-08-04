/*global describe, beforeEach, it, expect, inject*/
(function () {
    "use strict";

    describe("domain.AlertsCountModel", function () {

        beforeEach(function () {
            module("pub-ui-analytics.domain");
        });

        beforeEach(function () {
            inject(function(AlertsCountModel) {
                this.AlertsCountModel = AlertsCountModel;
                this.mock = {
                    "readCount":0,
                    "unreadCount":51
                };
            });
        });

        it("should be registered in the 'domain' module", function () {
            expect(this.AlertsCountModel).to.be.a("function");
        });

        it("should have default values", function () {
            var model = new this.AlertsCountModel();
            expect(model).to.be.an("object");
            expect(model.attributes.readCount).to.equal(0);
            expect(model.attributes.unreadCount).to.equal(0);
        });

        it("should set passed attributes", function () {
            var model = new this.AlertsCountModel(this.mock);
            expect(model).to.be.an("object");
            expect(model.attributes.readCount).to.equal(0);
            expect(model.attributes.unreadCount).to.equal(51);
        });

        it("should call get function", function () {
            var model, attr;
            model = new this.AlertsCountModel(this.mock);
            attr = model.get("readCount");
            expect(attr).to.equal(this.mock.readCount);
        });

        it("should call getReadCount function", function () {
            var model, attr;
            model = new this.AlertsCountModel(this.mock);
            attr = model.getReadCount();
            expect(attr).to.equal(this.mock.readCount);
        });

        it("should call getUnreadCount function", function () {
            var model, attr;
            model = new this.AlertsCountModel(this.mock);
            attr = model.getUnreadCount();
            expect(attr).to.equal(this.mock.unreadCount);
        });

        it("should call isValid function", function () {
            var model;
            model = new this.AlertsCountModel(this.mock);
            model.isValid();
        });


    });

}).call(this);