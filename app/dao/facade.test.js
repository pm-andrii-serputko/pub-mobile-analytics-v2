/*global describe, beforeEach, it, expect, inject*/
(function () {
    "use strict";

    describe("dao.facade", function () {

        beforeEach(function () {
            module("pub-ui-analytics.dao");
        });

        beforeEach(function () {
            inject(function(dao) {
                this.dao = dao;
            });
        });

        it("should exist and have limited number public properties/methods", function () {
            expect(this.dao).to.be.an("object");
            expect(Object.keys(this.dao)).to.have.length(6);
        });

        describe("properties", function () {
            it("should have access to all dao services", function () {
                expect(this.dao).to.include.keys([
                    "daySummary",
                    "timeSeries",
                    "topQueries",
                    "measureValues",
                    "benchmark"
                ]);
                expect(this.dao.daySummary).to.be.an("object");
                expect(this.dao.timeSeries).to.be.an("object");
                expect(this.dao.topQueries).to.be.an("object");
                expect(this.dao.measureValues).to.be.an("object");
                expect(this.dao.benchmark).to.be.an("object");
            });
        });


        describe("methods", function () {
            it("should have public methods", function () {
                expect(this.dao).to.include.keys([
                    "closeAllConnections"
                ]);
                expect(this.dao.closeAllConnections).to.be.a("function");
            });
        });

    });

}).call(this);