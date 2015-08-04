/*global describe, beforeEach, afterEach, it, expect, inject, sinon*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("common.exceptions.pubTokenException", function () {

        beforeEach(function () {
            module("pub-ui-analytics");
        });

        beforeEach(function () {
            inject(function(pubTokenException, tokenStorageService) {
                this.pubTokenException = pubTokenException;
                this.tokenStorageService = tokenStorageService;
            });
        });

        beforeEach(function() {
            sinon.spy(console, "log");
        });

        beforeEach(function() {
            this.rejection = {
                data: { message: "400 Error Message" },
                status: 400
            };
        });

        afterEach(function() {
            console.log.restore();
        });

        it("should be registered in the 'common' module", function () {
            expect(this.pubTokenException).to.be.a("function");
        });

        describe("responseError", function() {
            it("should log error", function() {
                this.pubTokenException(this.rejection);
                expect(console.log).to.have.been.calledWith("Token error, status text: ", "400 Error Message");
            });

            it("should change URL", function() {
                window.location.hash = "dashboard";
                this.pubTokenException(this.rejection);
                expect(window.location.hash).to.equal("#/loginlinks");
            });
        });
    });

}).call(this);