/*global describe, it, beforeEach, afterEach, expect, inject */
/*jshint expr: true */
(function () {
    "use strict";

    describe("domain.tokenStorageService", function () {

        beforeEach(function () {
            module("pub-ui-analytics.domain");
        });

        beforeEach(inject(function ($injector) {
            this.tokenStorageService = $injector.get("tokenStorageService");
        }));

        afterEach(function() {
            this.tokenStorageService.setAuthType("");
            this.tokenStorageService.setAuthToken("");
            this.tokenStorageService.setRefLoginOriginApp("");
            this.tokenStorageService.setRefLoginOriginUrl("#/loginlinks");
            this.tokenStorageService.setRefSignoutUrl("http://www.pubmatic.com");
            this.tokenStorageService.setResourceId("");
            this.tokenStorageService.setResourceType("");
        });

        describe("setters and getters", function() {
            it("should return auth type", function() {
                this.tokenStorageService.setAuthType("AUTH_TYPE");
                expect(this.tokenStorageService.getAuthType()).to.equal("AUTH_TYPE");
            });

            it("should return auth token", function() {
                this.tokenStorageService.setAuthToken("AUTH_TOKEN");
                expect(this.tokenStorageService.getAuthToken()).to.equal("AUTH_TOKEN");
            });

            it("should return login reference to origin application", function() {
                this.tokenStorageService.setRefLoginOriginApp("REF_LOGIN_ORIGIN_APP");
                expect(this.tokenStorageService.getRefLoginOriginApp()).to.equal("REF_LOGIN_ORIGIN_APP");
            });

            it("should return login reference to origin URL", function() {
                this.tokenStorageService.setRefLoginOriginUrl("#/loginlinks");
                expect(this.tokenStorageService.getRefLoginOriginUrl()).to.equal("#/loginlinks");
            });

            it("should return signout reference", function() {
                this.tokenStorageService.setRefSignoutUrl("http://www.pubmatic.com");
                expect(this.tokenStorageService.getRefSignoutUrl()).to.equal("http://www.pubmatic.com");
            });

            it("should return resource id", function() {
                this.tokenStorageService.setResourceId("RESOURCE_ID");
                expect(this.tokenStorageService.getResourceId()).to.equal("RESOURCE_ID");
            });

            it("should return resource id", function() {
                this.tokenStorageService.setResourceType("RESOURCE_TYPE");
                expect(this.tokenStorageService.getResourceType()).to.equal("RESOURCE_TYPE");
            });
        });

        describe("clearAllSessionStorage", function() {
            it("should remove all session keys and values", function() {
                this.tokenStorageService.clearAllSessionStorage();

                expect(this.tokenStorageService.getAuthType()).to.equal(null);
                expect(this.tokenStorageService.getAuthToken()).to.equal(null);
                expect(this.tokenStorageService.getRefLoginOriginApp()).to.equal(null);
                expect(this.tokenStorageService.getRefLoginOriginUrl()).to.equal(null);
                expect(this.tokenStorageService.getRefSignoutUrl()).to.equal(null);
                expect(this.tokenStorageService.getResourceId()).to.equal(null);
                expect(this.tokenStorageService.getResourceType()).to.equal(null);
            });
        });
    });
}).call(this);
