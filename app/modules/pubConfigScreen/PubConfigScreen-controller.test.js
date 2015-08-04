/*global describe, it, beforeEach, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Controller: pubConfigScreenCtrl", function () {
        var Config, PubAnalyticService;
        beforeEach(module("pubSlicerApp"));

        beforeEach(inject(function ($rootScope, $controller, config, pubAnalyticService) {
            this.$scope = $rootScope.$new();
            this.controller = $controller("pubConfigScreenCtrl", {
                $scope: this.$scope
            });
            Config = config;
            PubAnalyticService = pubAnalyticService;
        }));

        it("should exist", function () {
            expect(this.controller).to.exist;
            expect(this.controller).to.be.an("object");
        });

        it("should has the correct version number", function () {
            expect(this.$scope.version).to.equal(Config.version);
        });

        it("should has the correct build date", function () {
            expect(this.$scope.buildDate).to.equal(Config.buildDate);
        });

        it("should has the correct git commit", function () {
            expect(this.$scope.gitCommit).to.equal(Config.gitCommit);
        });

        it("should has the correct locale", function () {
            expect(this.$scope.locale).to.equal(PubAnalyticService.getLocale());
        });

        it("should has the correct locale", function () {
            this.$scope.locale = "ja-JP";
            this.$scope.changeLocale();
            expect(PubAnalyticService.getLocale()).to.equal("ja-jp");
        });
    });
}).call(this);
