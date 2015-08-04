/*global describe, beforeEach, it, expect */
/*jshint expr: true */
(function () {
    "use strict";

    describe("pub-ui-analytics", function() {
        var dependencies;
        beforeEach(function() {
            this.module = angular.module("pub-ui-analytics");
            dependencies = this.module.value("appName").requires;
        });

        describe("Dependencies:", function() {

            it("should have 'ngResource' module", function() {
                expect(hasModule("ngResource")).to.equal(true);
            });

            it("should have 'ngRoute' module", function() {
                expect(hasModule("ngRoute")).to.equal(true);
            });

            it("should have 'nvd3ChartDirectives' module", function() {
                expect(hasModule("nvd3ChartDirectives")).to.equal(true);
            });

            it("should have 'pascalprecht.translate' module", function() {
                expect(hasModule("pascalprecht.translate")).to.equal(true);
            });

            it("should have 'base64' module", function() {
                expect(hasModule("base64")).to.equal(true);
            });

            it("should have 'pubDatepicker' module", function() {
                expect(hasModule("pubDatepicker")).to.equal(true);
            });

            it("should have 'ngDialog' module", function() {
                expect(hasModule("ngDialog")).to.equal(true);
            });

            it("should have 'emguo.poller' module", function() {
                expect(hasModule("emguo.poller")).to.equal(true);
            });

            it("should have 'ngIdle' module", function() {
                expect(hasModule("ngIdle")).to.equal(true);
            });

            it("should have 'pmlComponents' module", function() {
                expect(hasModule("pmlComponents")).to.equal(true);
            });

            it("should have 'pub-ui-analytics.common' module", function() {
                expect(hasModule("pub-ui-analytics.common")).to.equal(true);
            });

            it("should have 'pub-ui-analytics.dao' module", function() {
                expect(hasModule("pub-ui-analytics.dao")).to.equal(true);
            });

            it("should have 'pub-ui-analytics.domain' module", function() {
                expect(hasModule("pub-ui-analytics.domain")).to.equal(true);
            });

            it("should have 'pubUniversalAnalyticService' module", function() {
                expect(hasModule("pubUniversalAnalyticService")).to.equal(true);
            });

            it("should have 'tophat.common' module", function() {
                expect(hasModule("tophat.common")).to.equal(true);
            });

            it("should have 'tophat.multiselect' module", function() {
                expect(hasModule("tophat.multiselect")).to.equal(true);
            });

            it("should have 'tophat.threshold-slider' module", function() {
                expect(hasModule("tophat.threshold-slider")).to.equal(true);
            });

            it("should have 'pmcc' module", function() {
                expect(hasModule("pmcc")).to.equal(true);
            });

            function hasModule(module) {
                return dependencies.indexOf(module) >= 0;
            }
        });
    });

}).call(this);
