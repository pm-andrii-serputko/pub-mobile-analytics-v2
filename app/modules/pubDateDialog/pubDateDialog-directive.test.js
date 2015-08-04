/*global describe, it, beforeEach, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Directive: pubDateDialog", function () {
        beforeEach(module("pubSlicerApp"));
        beforeEach(module("modules/pubDateDialog/pubDateDialog-directive.html"));
        beforeEach(module("modules/pubNotifications/toast.html"));

        beforeEach(inject(function ($rootScope, $controller,$httpBackend) {
            $httpBackend.whenPOST("api/v1/analytics/displayvalue").respond([]);
            $httpBackend.flush();
            this.$scope = $rootScope.$new();
            this.controller = $controller("PubDateDialogCtrl", {
                $scope: this.$scope
            });
        }));

        beforeEach(inject(function ($compile) {
            this.$scope.dateParam = "{\"optionIndex\":2}";
            this.element = angular.element("<pub-date-dialog date-object="+this.$scope.dateParam+" ></pub-date-dialog>");
            $compile(this.element)(this.$scope);

            this.$compile = $compile;
        }));


        it("Should display pub-date-dialog directive", function () {
            expect(this.element).to.exist;
        });

        describe("scope", function () {
            it("should exist", function () {
                expect(this.$scope).to.exist;
                expect(this.$scope).to.be.an("object");
            });
        });

        it("Should set the date option index to 2", function () {
            this.$scope.$digest();
            expect(this.$scope.selectedOption).to.equal(2);
        });
    });
}).call(this);
