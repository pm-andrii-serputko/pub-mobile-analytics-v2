/*global describe, beforeEach, it, expect, inject*/
(function () {
    "use strict";

    describe("Config: middlewareRoutes", function () {


        // load the module
        beforeEach(function () {
            module("pubSlicerApp");
        });

        beforeEach(function () {
            inject(function(middlewareRoutes) {
                this.middlewareRoutes = middlewareRoutes;
            });
        });

        it("should be a object", function () {
            expect(this.middlewareRoutes).to.be.an("object");
        });

        describe("publisher", function () {
            it("should be equal to 'api/v1/analytics/data/rt/publisher'", function () {
                expect(this.middlewareRoutes.publisher).to.equal("api/v1/analytics/data/rt/publisher");
            });
        });

        describe("analytic", function () {
            it("should be equal to 'api/v1/analytics/user'", function () {
                expect(this.middlewareRoutes.analytic).to.equal("api/v1/analytics/user");
            });
        });

        describe("historic", function () {
            it("should be equal to 'api/v1/analytics/data'", function () {
                expect(this.middlewareRoutes.historic).to.equal("api/v1/analytics/data");
            });
        });

        describe("exportData", function () {
            it("should be equal to 'api/v1/analytics/export'", function () {
                expect(this.middlewareRoutes.exportData).to.equal("api/v1/analytics/export");
            });
        });

        describe("realtime", function () {
            it("should be equal to 'api/v1/analytics/data/rt'", function () {
                expect(this.middlewareRoutes.realtime).to.equal("api/v1/analytics/data/rt");
            });
        });

        describe("filterDimensionValues", function () {
            it("should be equal to 'reports'", function () {
                expect(this.middlewareRoutes.filterDimensionValues).to.equal("api/v1/analytics/metadata/value/idvalue");
            });
        });

        describe("filterDimensionValuesLookup", function () {
            it("should be equal to 'reports'", function () {
                expect(this.middlewareRoutes.filterDimensionValuesLookup).to.equal("api/v1/analytics/displayvalue");
            });
        });

        describe("common", function () {
            it("should be equal to 'api/v1/analytics/common'", function () {
                expect(this.middlewareRoutes.common).to.equal("api/v1/analytics/common");
            });
        });

        describe("saved", function () {
            it("should be equal to 'api/v1/analytics/saved'", function () {
                expect(this.middlewareRoutes.saved).to.equal("api/v1/analytics/saved");
            });
        });

        describe("saved", function () {
            it("should be equal to 'api/v1/analytics/schedule'", function () {
                expect(this.middlewareRoutes.schedule).to.equal("api/v1/analytics/schedule");
            });
        });

    });

}).call(this);