/*global describe, beforeEach, it, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Command: all report", function () {
        
        var commands;

        // load the module
        beforeEach(function () {
            module("pub-ui-analytics.domain");
        });


        /** inject model*/
        beforeEach(function () {
            inject(["pubNLPService.AllReport", function (allReport) {
                commands = {
                    allReport: allReport
                };
            }]);
        });
        
        it("should return allReport", function () {
            var fn = commands.allReport;
            expect(fn("allReport")).to.equal("allReports");
        });

    });


}).call(this);