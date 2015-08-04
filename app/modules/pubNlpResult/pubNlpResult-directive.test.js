/*global describe, it, beforeEach, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Directive: pubNlpResult", function () {
        var PubUniversalAnalyticService;

        beforeEach(module("pubSlicerApp"));
        beforeEach(module("modules/pubNotifications/toast.html"));
        beforeEach(module("modules/pubNlpResult/pubNlpResult-directive.html"));

        beforeEach(inject(function ($rootScope, $controller) {
            this.$scope = $rootScope.$new();
            this.controller = $controller("pubNlpResultCtrl", {
                $scope: this.$scope
            });
        }));

        beforeEach(inject(function ($compile, $httpBackend, pubAnalyticService, $location, pubUniversalAnalyticService) {
            PubUniversalAnalyticService = pubUniversalAnalyticService;
            pubAnalyticService.fetch();
            this.$location = $location;
            $httpBackend.whenPOST("api/v1/analytics/displayvalue").respond([]);
            $httpBackend.flush();
            this.element = angular.element("<pub-nlp-result></pub-nlp-result>");
            $compile(this.element)(this.$scope);
        }));


        it("Should display pub-nlp-result directive", function () {
            expect(this.element).to.exist;
        });

        describe("scope", function () {
            it("should exist", function () {
                expect(this.$scope).to.exist;
                expect(this.$scope).to.be.an("object");
            });
        });

        it("showResult should equal to false if no nlp input", function () {
            this.$scope.$digest();
            expect(this.$scope.showResult).to.equal(false);
            
        });

        it("location should redirect to root if no nlp input and aggregator", function () {
            this.$location.url("/dimensions");
            PubUniversalAnalyticService.attributes.accountSubtype = "aggregator";
            this.$scope.nlpDisplay = "";
            this.$scope.$digest();
            expect(this.$location.url()).to.equal("/");
        });

        it("showResult should equal to false if nlp is a command", function () {
            this.$scope.nlpDisplay = "dashboard";
            this.$scope.$digest();
            expect(this.$scope.showResult).to.equal(false);
        });

        it("showResult should equal to false if nlp is not a command", function () {
            this.$scope.nlpDisplay = "larlar,larlarlar";
            this.$scope.$digest();
            expect(this.$scope.showResult).to.equal(true);
        });
       
    });
}).call(this);
