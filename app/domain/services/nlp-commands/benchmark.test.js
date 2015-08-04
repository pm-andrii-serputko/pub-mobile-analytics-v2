/*global describe, beforeEach, it, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Command: benchmark", function () {
        
        var commands;

        // load the module
        beforeEach(function () {
            module("pub-ui-analytics.domain");
        });

        /** inject model*/
        beforeEach(function () {
            inject(["pubNLPService.Benchmark", function (benchmark) {
                commands = {
                    benchmark: benchmark
                };
            }]);
        });
        
        it("should return benchmark", function () {
            var fn = commands.benchmark;
            expect(fn("benchmark")).to.equal("benchmarkMain");
        });
    });
}).call(this);