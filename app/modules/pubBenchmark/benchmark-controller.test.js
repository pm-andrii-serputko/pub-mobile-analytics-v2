/*global describe, it, beforeEach, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Controller: Benchmark", function () {

        beforeEach(module("pubSlicerApp"));
        beforeEach(module("modules/pubBenchmark/benchmark.html"));
        beforeEach(module("modules/pubNotifications/toast.html"));


        beforeEach(inject(function (DateModel, $compile, $rootScope, $httpBackend, pubAnalyticService) {
            this.DateModel = DateModel;
           
            pubAnalyticService.fetch();
            $httpBackend.whenPOST("api/v1/analytics/displayvalue").respond([]);
            this.$httpBackend = $httpBackend;
            $httpBackend.flush();
        }));

        beforeEach(inject(function ($compile, $rootScope, $controller) {
            this.$compile = $compile;
            this.$scope = $rootScope.$new();
            this.$scope.navigateNLP = function(){};
            this.controller = $controller("pubBenchmarkCtrl", {
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
    });
}).call(this);
