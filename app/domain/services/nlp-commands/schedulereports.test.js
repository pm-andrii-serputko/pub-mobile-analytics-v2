/*global describe, beforeEach, it, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Command: schedule reports", function () {
        
        var commands;

        // load the module
        beforeEach(function () {
            module("pub-ui-analytics.domain");
        });

        /** inject model*/
        beforeEach(function () {
            inject(["pubNLPService.ScheduleReports", function (scheduleReports) {
                commands = {
                    scheduleReports: scheduleReports,
                };
            }]);
        });
        
        it("should return help", function () {
            var fn = commands.scheduleReports;
            expect(fn("schedule")).to.equal("schedule");
        });
    });

}).call(this);