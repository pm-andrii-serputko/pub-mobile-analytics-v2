/*global describe, beforeEach, it, expect, inject*/
(function () {
    "use strict";

    describe("Config: config", function () {


        // load the module
        beforeEach(function () {
            module("pub-ui-analytics.common");
        });

        beforeEach(function () {
            inject(function(config) {
                this.config = config;
            });
        });

        it("should be a object", function () {
            expect(this.config).to.be.an("object");
        });

        describe("version", function () {
            it("should be equal to '1.7.*'", function () {
                var expr = /1\.7\..*/;

                expect(expr.test(this.config.version)).to.equal(true);
            });
        });

        describe("middlewareVersion", function () {
            it("should be equal to 'v1'", function () {
                expect(this.config.middlewareVersion).to.equal("v1");
            });
        });

        describe("middlewarePrefix", function () {
            it("should be equal to 'api'", function () {
                expect(this.config.middlewarePrefix).to.equal("api");
            });
        });

        describe("default locale", function () {
            it("should be equal to 'en-us'", function () {
                expect(this.config.defaultLocale).to.equal("en-us");
            });
        });


    });

}).call(this);
