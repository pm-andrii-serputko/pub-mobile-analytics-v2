/*global describe, beforeEach, it, expect */
/*jshint expr: true */
(function () {
    "use strict";

    describe("pubSlicerApp Module:", function() {

        var module;
        beforeEach(function() {
            module = angular.module("pubSlicerApp");
        });

        describe("Dependencies:", function() {

            var deps;
            var hasModule = function (m) {
                return deps.indexOf(m) >= 0;
            };
            beforeEach(function() {
                deps = module.value("appName").requires;
            });

            it("should have 'pub-ui-analytics' as a dependency", function() {
                expect(hasModule("pub-ui-analytics")).to.equal(true);
            });
        });
    });

}).call(this);
