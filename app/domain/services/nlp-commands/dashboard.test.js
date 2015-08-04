/*global describe, beforeEach, it, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Command: dashboard", function () {
        
        var commands;

        // load the module
        beforeEach(function () {
            module("pub-ui-analytics.domain");
        });


        /** inject model*/
        beforeEach(function () {
            inject(["pubNLPService.Dashboard", function (dashboard) {
                commands = {
                    dashboard: dashboard
                };
            }]);
        });
        
        it("should return dashboard", function () {
            var fn = commands.dashboard;
            expect(fn("dashboard")).to.equal("dashboard");
        });

    });


}).call(this);