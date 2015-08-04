/*global describe, it, beforeEach, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Controller: pubSavedReportsCtrl", function () {

        beforeEach(module("pubSlicerApp"));

        beforeEach(inject(function ($rootScope, $controller) {
            this.$scope = $rootScope.$new();
            this.$scope.navigateNLP = function(){
                //fake navigateNLP which is nlp component.
            };
            this.$scope.currentPageIndicator = function(){
                //fake currentPageIndicator which is nlp component.
            };


            this.controller = $controller("pubSavedReportsCtrl", {
                $scope: this.$scope
            });
        }));

        it("should exist", function () {
            expect(this.controller).to.exist;
            expect(this.controller).to.be.an("object");
        });

    });
}).call(this);