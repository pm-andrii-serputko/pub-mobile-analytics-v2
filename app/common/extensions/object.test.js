/*global describe, it, expect*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("common.extensions.Function", function () {

        it("should have extend method", function () {
            var fn = function() {};
            expect(fn.extend).to.be.a("function");
        });

        it("should extend instance properties", function() {
            function A() {}

            A.extend({
                name: "ClassA",
                getName: function() {
                    return this.name;
                }
            });

            var a = new A();
            expect(a.name).to.be.a("string");
            expect(a.getName).to.be.a("function");
        });

        it("should extend static properties", function() {
            function A() {}

            A.extend({}, { version: "0.0.1" });

            expect(A.version).to.equal("0.0.1");
        });
    });

}).call(this);