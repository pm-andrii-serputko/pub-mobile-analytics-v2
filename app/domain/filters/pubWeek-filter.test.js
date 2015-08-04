/*global describe, beforeEach, it, expect, inject*/
(function () {
    "use strict";

    describe("Filter: pubWeekFilter", function () {

        // load the module
        beforeEach(function () {
            module("pub-ui-analytics.domain");
        });

        beforeEach(function () {
            inject(function($filter) {
                this.pubWeekFilter = $filter("pubWeekFilter");
            });
        });

        it("should convert data to week format", function () {
            // valid values
            expect(this.pubWeekFilter("2015W01")).to.equal("2015 W01");
            expect(this.pubWeekFilter("2015W11")).to.equal("2015 W11");
            expect(this.pubWeekFilter("2015W222")).to.equal("2015 W22");
            // NOTE: the filter does not have validation. 
            expect(this.pubWeekFilter("2015W70")).to.equal("2015 W70");

            // invalid values
            expect(this.pubWeekFilter("2015Week7")).to.equal("undefined Wundefined");
            expect(this.pubWeekFilter("2015Week12")).to.equal("undefined Wundefined");
            expect(this.pubWeekFilter("2015Week111")).to.equal("undefined Wundefined");
            expect(this.pubWeekFilter("10Week02")).to.equal("undefined Wundefined");
            expect(this.pubWeekFilter("10W02")).to.equal("undefined Wundefined");
        });
    });

}).call(this);