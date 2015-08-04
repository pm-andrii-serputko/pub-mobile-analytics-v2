/*global describe, beforeEach, it, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("modules.removeCtrl", function () {
        beforeEach(function () {
            module("pubSlicerApp");
        });
        beforeEach(function () {
            inject(function($rootScope, $controller) {
                this.$scope = $rootScope.$new();
                this.$scope.confirm = function(){
                    //fake ng dialog function.
                };
                this.$scope.closeThisDialog = function(){
                    //fake ng dialog function.
                };
                this.$scope.alertRemove = true;

                this.controller = $controller("removeCtrl", {
                    $scope: this.$scope
                });
                this.$scope.$digest();

            });
        });

        it("should exist", function () {
            expect(this.controller).to.exist;
            expect(this.controller).to.be.an("object");
            expect(this.$scope.displayRemoveMessage).to.be.defined;
            expect(this.$scope.reportName).to.be.defined;
            expect(this.$scope.reportDescription).to.be.defined;
        });

        it("validate remove Item function", function () {
            expect(this.$scope.removeItem).to.be.a("function");
            this.$scope.removeItem();

        });

        it("call close function", function () {
            expect(this.$scope.close).to.be.a("function");
            this.$scope.close();

        });

        it("displayRemoveMessage to contain alert message- if branch", function () {
            expect(this.$scope.displayRemoveMessage).to.equal("ALERTS.REMOVE_ALERTS");
        });

    });

}).call(this);