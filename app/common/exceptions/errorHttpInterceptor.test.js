/*global describe, beforeEach, afterEach, it, expect, inject, sinon*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("common.exceptions.errorHttpInterceptor", function () {

        beforeEach(function () {
            module("pub-ui-analytics");
        });

        beforeEach(function () {
            inject(function(errorHttpInterceptor) {
                this.errorHttpInterceptor = errorHttpInterceptor;
            });
        });

        beforeEach(function() {
            sinon.spy(console, "log");
        });

        afterEach(function() {
            console.log.restore();
        });

        it("should be registered in the 'common' module", function () {
            expect(this.errorHttpInterceptor).to.be.an("object");
        });

        describe("responseError", function() {
            it("should trigger pubTokenException if 400 error", function() {
                var rejection = {
                    data: { message: "400 Error Message" },
                    status: 400
                };
                this.errorHttpInterceptor.responseError(rejection);
                expect(console.log).to.have.been.calledWith("Token error, status text: ", "400 Error Message");
            });
        });

        describe("responseError", function() {
            it("should trigger pubTokenException if 401 error", function() {
                var rejection = {
                    data: { message: "401 Error Message" },
                    status: 401
                };
                this.errorHttpInterceptor.responseError(rejection);
                expect(console.log).to.have.been.calledWith("Token error, status text: ", "401 Error Message");
            });
        });


        describe("responseError", function() {
            it("should notify if 405 error", function() {
                var rejection = {
                    data: { message: "405 Error Message" },
                    status: 405
                };
                this.errorHttpInterceptor.responseError(rejection);
                expect(console.log).to.have.been.calledWith("Analytics UI is received a rejection status of 405");
            });
        });
    });

}).call(this);