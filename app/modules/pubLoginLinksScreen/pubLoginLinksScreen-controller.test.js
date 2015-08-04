/*global describe, it, beforeEach, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Controller: pubLoginLinksScreenCtrl", function () {
        beforeEach(module("pubSlicerApp"));

        beforeEach(inject(function ($rootScope, $controller, $location) {
            this.$scope = $rootScope.$new();
            this.$location = $location;
            this.controller = $controller("pubLoginLinksScreenCtrl", {
                $scope: this.$scope
            });
        }));


        describe("scope", function () {
            it("should exist", function () {
                expect(this.$scope).to.exist;
                expect(this.$scope).to.be.an("object");
            });
        });

        it("should exist", function () {
            expect(this.controller).to.exist;
            expect(this.controller).to.be.an("object");
        });

        it("should has correct media buyer login URL", function () {
            expect(this.$scope.mediaBuyerLoginURL).to.equal("http://apps.pubmatic.com/mediabuyer/");
        });

        it("should has correct publisher login URL", function () {
            expect(this.$scope.publisherLoginURL).to.equal("http://apps.pubmatic.com/publisher/");
        });

        it("should redirect to /loginlinks", function () {
            this.$scope.redirectReport();
            expect(this.$location.url()).to.equal("/loginlinks");
        });
    
    });
}).call(this);
