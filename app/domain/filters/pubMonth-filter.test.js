/*global describe, beforeEach, it, expect, inject*/
(function () {
    "use strict";

    describe("Filter: pubMonthFilter", function () {

        // load the module
        beforeEach(function () {
            module("pub-ui-analytics.domain");
        });

        beforeEach(function () {
            inject(function($filter) {
                this.pubMonthFilter = $filter("pubMonthFilter");
            });
        });

        it("should convert data to month format", function () {
            // valid values
            expect(this.pubMonthFilter("2015-01")).to.equal("Jan 2015");
            expect(this.pubMonthFilter("2015-03")).to.equal("Mas 2015");
            expect(this.pubMonthFilter("2015-07")).to.equal("Jul 2015");
            expect(this.pubMonthFilter("2015-12")).to.equal("Dis 2015");

            expect(this.pubMonthFilter("2015-13")).to.equal("Jan 2016");
            
            // // invalid values
            expect(this.pubMonthFilter("999-01")).to.equal("undefined NaN");
            expect(this.pubMonthFilter("2015-1")).to.equal("undefined NaN");
            expect(this.pubMonthFilter("2015-1")).to.equal("undefined NaN");
        });
    });

}).call(this);