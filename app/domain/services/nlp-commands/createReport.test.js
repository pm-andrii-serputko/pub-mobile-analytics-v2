/*global describe, beforeEach, it, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Command: create report", function () {
        
        var commands;

        // load the module
        beforeEach(function () {
            module("pub-ui-analytics.domain");
        });

        /** inject model*/
        beforeEach(function () {
            inject(["pubNLPService.Createreport", function (createReport) {
                commands = {
                    createreport: createReport,
                };
            }]);
        });
        
        it("should return createreport", function () {
            var fn = commands.createreport;
            expect(fn("createreport")).to.equal("dimensions");
        });
    });

}).call(this);