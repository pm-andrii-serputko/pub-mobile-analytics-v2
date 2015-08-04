/*global describe, beforeEach, it, expect, inject*/
(function () {
    "use strict";

    describe("Filter: pubQuarterFilter", function () {

        // load the module
        beforeEach(function () {
            module("pub-ui-analytics.domain");
        });

        beforeEach(function () {
            inject(function($filter) {
                this.pubQuarterFilter = $filter("pubQuarterFilter");
            });
        });

        it("should convert data to quarter format", function () {
            // valid values
            expect(this.pubQuarterFilter("2015Q01")).to.equal("2015 Q01");
            expect(this.pubQuarterFilter("2015Q02")).to.equal("2015 Q02");
            expect(this.pubQuarterFilter("2015Q03")).to.equal("2015 Q03");
            expect(this.pubQuarterFilter("2015Q04")).to.equal("2015 Q04");
            // NOTE: the filter does not have validation. 
            expect(this.pubQuarterFilter("2015Q05")).to.equal("2015 Q05");

            // invalid values
            expect(this.pubQuarterFilter("2015Quarter1")).to.equal("undefined Qundefined");
            expect(this.pubQuarterFilter("2015Q1")).to.equal("undefined Qundefined");
            expect(this.pubQuarterFilter("2015Q2")).to.equal("undefined Qundefined");
            expect(this.pubQuarterFilter("2015Q3")).to.equal("undefined Qundefined");
            expect(this.pubQuarterFilter("2015Q4")).to.equal("undefined Qundefined");
            expect(this.pubQuarterFilter("10Quarter01")).to.equal("undefined Qundefined");
            expect(this.pubQuarterFilter("10Q01")).to.equal("undefined Qundefined");
        });
    });

}).call(this);