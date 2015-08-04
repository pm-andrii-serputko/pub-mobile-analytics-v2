/*global describe, beforeEach, it, expect, inject, sinon*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("common.extensions.mediator", function () {

        beforeEach(function () {
            module("pub-ui-analytics.common");
        });

        beforeEach(function () {
            inject(function(mediator) {
                this.mediator = mediator;
            });
        });

        it("should be registered in the 'common' module", function () {
            expect(this.mediator).to.be.an("object");
        });

        describe("subscribe", function() {
            it("should subscribe events", function() {
                var spy = sinon.spy();
                this.mediator.subscribe("custom-event", spy);
                this.mediator.publish("custom-event");
                spy.should.have.been.calledOnce;

                this.mediator.publish("custom-event");
                spy.should.have.been.calledTwice;
            });
        });

        describe("publish", function() {
            it("should trigger events", function() {
                var spy1 = sinon.spy();
                var spy2 = sinon.spy();

                this.mediator.subscribe("custom-event", spy1);
                this.mediator.subscribe("custom-event", spy2);
                this.mediator.publish("custom-event");
                spy1.should.have.been.calledOnce;
                spy2.should.have.been.calledOnce;

                this.mediator.publish("custom-event", 1111, 2222, 3333);
                spy1.should.have.been.calledTwice;
                spy1.should.have.been.calledWith(1111, 2222, 3333);

                spy2.should.have.been.calledTwice;
                spy2.should.have.been.calledWith(1111, 2222, 3333);
            });

            it("should return false if no subscribers", function() {
                expect(this.mediator.publish("custom-event")).to.equal(false);
            });
        });

        describe("unsubscribe", function() {
            it("should unsubscribe events", function() {
                var spy = sinon.spy();
                this.mediator.subscribe("custom-event", spy);
                this.mediator.publish("custom-event");
                spy.should.have.been.calledOnce;

                this.mediator.unsubscribe("custom-event", spy);
                this.mediator.publish("custom-event");
                spy.should.have.been.calledOnce;
            });

            it("should return false if nothing to unsubscribe", function() {
                var spy = sinon.spy();
                var spy2 = sinon.spy();

                expect(this.mediator.unsubscribe("custom-event")).to.equal(false);
                expect(this.mediator.unsubscribe("custom-event", spy)).to.equal(false);

                this.mediator.subscribe("custom-event", spy);
                expect(this.mediator.unsubscribe("custom-event", spy2)).to.equal(false);
            });
        });
    });

}).call(this);