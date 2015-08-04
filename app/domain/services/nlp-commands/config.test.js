/*global describe, beforeEach, it, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Command: config", function () {
        
        var commands;

        // load the module
        beforeEach(function () {
            module("pub-ui-analytics.domain");
        });

        /** inject model*/
        beforeEach(function () {
            inject(["pubNLPService.Config", function (config) {
                commands = {
                    config: config
                };
            }]);
        });
        
        it("should return config", function () {
            var fn = commands.config;
            expect(fn("config")).to.equal("config");
        });
    });

}).call(this);