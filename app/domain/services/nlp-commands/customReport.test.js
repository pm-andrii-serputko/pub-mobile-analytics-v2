/*global describe, beforeEach, it, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Command: custom report", function () {
        
        var commands;

        // load the module
        beforeEach(function () {
            module("pub-ui-analytics.domain");
        });

        /** inject model*/
        beforeEach(function () {
            inject(["pubNLPService.Customreport", function (customreport) {
                commands = {
                    customreport: customreport,
                };
            }]);
        });
        
        it("should return custom", function () {
            var fn = commands.customreport;
            expect(fn("custom")).to.equal("custom");
        });
    });

}).call(this);