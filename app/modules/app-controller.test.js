/*global describe, it, beforeEach, afterEach, expect, inject, sinon*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("modules.pubSlicerCtrl", function () {

        /** Load module */
        beforeEach(function () {
            module("pubSlicerApp");
        });

        beforeEach(inject(function ($injector) {
            this.$scope = $injector.get("$rootScope").$new();
            this.mediator = $injector.get("mediator");
            this.googleAnalyticsService = $injector.get("googleAnalyticsService");
            
            // Sinon overrides
            sinon.spy(this.googleAnalyticsService, "gTrackTraffic");
            
            $injector.get("$controller")("pubSlicerCtrl", {
                $scope: this.$scope
            });

            this.$scope.navigate = sinon.spy();

            this.$scope.$digest();
        }));

        afterEach(function() {
            // Sinon restores
            this.googleAnalyticsService.gTrackTraffic.restore();
        });

        it("should track traffic in GA tool", function () {
            expect(this.googleAnalyticsService.gTrackTraffic).to.have.been.called;
        });

        describe("Update Top Header", function() {
            it("should have help URL for settings URL for buyer", function() {
                this.mediator.publish("update:topHeaderUserLinks", "buyer");
                expect(this.$scope.settingsUrl).to.equal("http://apps.pubmatic.com/mediabuyer/?viewName=accountSettings");
                expect(this.$scope.helpUrl).to.equal("bower_components/pubSlicerHelp/buyer/index.htm");
            });
            it("should have help URL for settings URL for dsp", function() {
                this.mediator.publish("update:topHeaderUserLinks", "dsp");
                expect(this.$scope.settingsUrl).to.equal("http://apps.pubmatic.com/mediabuyer/?viewName=accountSettings");
                expect(this.$scope.helpUrl).to.equal("bower_components/pubSlicerHelp/dsp/index.htm");
            });
            it("should have help URL for settings URL for publisher", function() {
                this.mediator.publish("update:topHeaderUserLinks", "publisher");
                expect(this.$scope.settingsUrl).to.equal("https://apps.pubmatic.com/08_account_edit.jsp");
                expect(this.$scope.helpUrl).to.equal("bower_components/pubSlicerHelp/normal_publisher/index.htm");
            });
        });

        describe("$idleTimeout", function() {
            it("should navigate to signout page", function() {
                this.$scope.$broadcast("$idleTimeout");
                expect(this.$scope.navigate).to.have.been.calledWith("http://www.pubmatic.com");
            });
        });

        describe("$idleWarn", function() {
            it("should notify User");
        });

    });
}).call(this);
