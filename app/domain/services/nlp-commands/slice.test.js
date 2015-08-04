/*global describe, beforeEach, it, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Command: slice", function () {
        
        var commands;

        // load the module
        beforeEach(function () {
            module("pub-ui-analytics.domain");
        });

        /** inject model*/
        beforeEach(function () {
            inject(["pubNLPService.Slice", function (slice) {
                commands = {
                    slice: slice,
                };
            }]);
        });
        
        it("should return createreport", function () {
            var fn = commands.slice;
            expect(fn("slice")).to.equal("slice");
        });
    });

}).call(this);