/*global describe, beforeEach, it, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Command: help", function () {
        
        var commands;

        // load the module
        beforeEach(function () {
            module("pub-ui-analytics.domain");
        });

        /** inject model*/
        beforeEach(function () {
            inject(["pubNLPService.Help", function (help) {
                commands = {
                    help: help,
                };
            }]);
        });
        
        it("should return help", function () {
            var fn = commands.help;
            expect(fn("help")).to.equal("help");
        });
    });

}).call(this);