/*global describe, beforeEach, it, expect */
(function () {
    "use strict";

    describe("dao.module", function() {

        beforeEach(function() {
            this.module = angular.module("pub-ui-analytics.dao");
        });

        it("should be registered", function() {
            expect(this.module).not.to.equal(null);
        });

        describe("dependencies", function() {
            var deps, hasModule;
            
            hasModule = function (module) {
                return deps.indexOf(module) >= 0;
            };

            beforeEach(function() {
                deps = this.module.value("appName").requires;
            });

            it("should have 'ngResource' as a dependency", function() {
                expect(hasModule("ngResource")).to.equal(true);
            });

            it("should have 'emguo.poller' as a dependency", function() {
                expect(hasModule("emguo.poller")).to.equal(true);
            });

            it("should have 'pub-ui-analytics.common' as a dependency", function() {
                expect(hasModule("pub-ui-analytics.common")).to.equal(true);
            });

        });
    });

}).call(this);
