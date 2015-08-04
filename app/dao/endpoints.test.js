/*global describe, beforeEach, it, expect, inject*/
(function () {
    "use strict";

    describe("dao.endpoints", function () {

        beforeEach(function () {
            module("pub-ui-analytics.dao");
        });

        beforeEach(function () {
            inject(function(endpoints) {
                this.endpoints = endpoints;
            });
        });

        it("should exist and have limited number of routes", function () {
            expect(this.endpoints).to.be.an("object");
            expect(Object.keys(this.endpoints)).to.have.length(21);
        });

        describe("routes", function () {
            it("'endpoints.analytic' should be equal to 'api/v1/analytics/user'", function () {
                expect(this.endpoints.analytic).to.equal("api/v1/analytics/user");
            });

            it("'endpoints.historic' should be equal to 'api/v1/analytics/data'", function () {
                expect(this.endpoints.historic).to.equal("api/v1/analytics/data");
            });

            it("'endpoints.exportData' should be equal to 'api/v1/analytics/export'", function () {
                expect(this.endpoints.exportData).to.equal("api/v1/analytics/export");
            });

            it("'endpoints.realtime' should be equal to 'api/v1/analytics/data/rt'", function () {
                expect(this.endpoints.realtime).to.equal("api/v1/analytics/data/rt");
            });

            it("'endpoints.measureValues' should be equal to 'api/v1/analytics/metadata/value/idvalue'", function () {
                expect(this.endpoints.measureValues).to.equal("api/v1/analytics/metadata/value/idvalue");
            });

            it("'endpoints.filterDimensionValuesLookup' should be equal to 'api/v1/analytics/displayvalue'", function () {
                expect(this.endpoints.filterDimensionValuesLookup).to.equal("api/v1/analytics/displayvalue");
            });

            it("'endpoints.common' should be equal to 'api/v1/analytics/common'", function () {
                expect(this.endpoints.common).to.equal("api/v1/analytics/common");
            });

            it("'endpoints.saved' should be equal to 'api/v1/analytics/saved'", function () {
                expect(this.endpoints.saved).to.equal("api/v1/analytics/saved");
            });

            it("'endpoints.schedule' should be equal to 'api/v1/analytics/schedule'", function () {
                expect(this.endpoints.schedule).to.equal("api/v1/analytics/schedule");
            });

            it("'endpoints.bTextProcessing' should be equal to 'api/v1/analytics/data/nlp'", function () {
                expect(this.endpoints.bTextProcessing).to.equal("api/v1/analytics/data/nlp");
            });

            it("'endpoints.userShared' should be equal to 'api/v1/analytics/user/sameaccount'", function () {
                expect(this.endpoints.userShared).to.equal("api/v1/analytics/user/sameaccount");
            });

            it("'endpoints.shareSaved' should be equal to 'api/v1/analytics/share/saved'", function () {
                expect(this.endpoints.shareSaved).to.equal("api/v1/analytics/share/saved");
            });

            it("'endpoints.shareNotSaved' should be equal to 'api/v1/analytics/share/newcustom'", function () {
                expect(this.endpoints.shareNotSaved).to.equal("api/v1/analytics/share/newcustom");
            });

            it("'endpoints.feedback' should be equal to 'api/v1/analytics/data/feedback/user'", function () {
                expect(this.endpoints.feedback).to.equal("api/v1/analytics/data/feedback/user");
            });

            it("'endpoints.benchmark' should be equal to 'api/v1/analytics/benchmark'", function () {
                expect(this.endpoints.benchmark).to.equal("api/v1/analytics/benchmark");
            });

            it("'endpoints.alerts' should be equal to 'api/v1/analytics/alert/msgs'", function () {
                expect(this.endpoints.alerts).to.equal("api/v1/analytics/alert/msgs");
            });

            it("'endpoints.alertsCount' should be equal to 'api/v1/analytics/alert/msgs/count'", function () {
                expect(this.endpoints.alertsCount).to.equal("api/v1/analytics/alert/msgs/count");
            });

            it("'endpoints.alertsRead' should be equal to 'api/v1/analytics/alert/msgs/read'", function () {
                expect(this.endpoints.alertsRead).to.equal("api/v1/analytics/alert/msgs/read");
            });

            it("'endpoints.alertsConfig' should be equal to 'api/v1/analytics/alert/config'", function () {
                expect(this.endpoints.alertsConfig).to.equal("api/v1/analytics/alert/config");
            });

            it("'endpoints.alertsUserSetting' should be equal to 'api/v1/analytics/user/setting'", function () {
                expect(this.endpoints.alertsUserSetting).to.equal("api/v1/analytics/user/setting");
            });

            it("'endpoints.systemNotification' should be equal to 'api/v1/analytics/system/notification'", function () {
                expect(this.endpoints.systemNotification).to.equal("api/v1/analytics/system/notification");
            });

        });
    });

}).call(this);