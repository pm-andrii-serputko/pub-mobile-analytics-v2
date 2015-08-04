/*global describe, it, beforeEach, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Controller: pubHelpScreenCtrl", function () {
        
        beforeEach(module("pubSlicerApp"));
        beforeEach(module("modules/pubNotifications/toast.html"));
        beforeEach(inject(function ($rootScope, $controller, $location) {
            this.$scope = $rootScope.$new();
            this.$location = $location;
            
            this.$scope.currentPageIndicator = function(){
                //fake currentPageIndicator which is nlp component.
            };

            this.controller = $controller("pubHelpScreenCtrl", {
                $scope: this.$scope
            });
        }));

	    beforeEach(inject(function ($compile, $httpBackend, pubAnalyticService) {
	        pubAnalyticService.fetch();
	        $httpBackend.whenPOST("api/v1/analytics/displayvalue").respond([]);
	        $httpBackend.flush();
            this.element = angular.element("<div id='nlpBar' pub-nlp-input  contenteditable={{canEdit}} ng-class='cursorSwitcher' ng-model='nlpDisplay' class='nlp-input'>");
            $compile(this.element)(this.$scope);
	    }));

        it("should exist", function () {
            expect(this.controller).to.exist;
            expect(this.controller).to.be.an("object");
        });

        it("redirectReport will redirect", function () {
            this.$scope.redirectReport();
            expect(this.$location.url()).to.equal("/help");
        });

        it("redirectCreate will redirect", function () {
            this.$scope.redirectCreate();
            expect(this.$location.url()).to.equal("/dimensions");
        });

    });
}).call(this);
