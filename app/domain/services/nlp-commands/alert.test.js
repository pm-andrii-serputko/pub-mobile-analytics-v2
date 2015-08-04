/*global describe, beforeEach, it, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Command: alert", function () {
        
        var commands;

        // load the module
        beforeEach(function () {
            module("pub-ui-analytics.domain");
        });


        /** inject model*/
        beforeEach(function () {
            inject(["pubNLPService.Alerts", function (alert) {
                commands = {
                    alerts: alert
                };
            }]);
        });
        
        it("should return alerts", function () {
            var fn = commands.alerts;
            expect(fn("alert")).to.equal("alerts");
        });

    });


}).call(this);