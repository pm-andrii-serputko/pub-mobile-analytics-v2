/*global describe, beforeEach, it, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Command: standard report", function () {
        
        var commands;

        // load the module
        beforeEach(function () {
            module("pub-ui-analytics.domain");
        });

        /** inject model*/
        beforeEach(function () {
            inject(["pubNLPService.Standardreport", function (standardreport) {
                commands = {
                    standardreport: standardreport,
                };
            }]);
        });
        
        it("should return custom", function () {
            var fn = commands.standardreport;
            expect(fn("standard")).to.equal("standard");
        });
    });

}).call(this);