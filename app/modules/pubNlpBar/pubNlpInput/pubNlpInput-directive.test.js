/*global describe, it, beforeEach, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Directive: pubNlpInput", function () {

        beforeEach(module("pubSlicerApp"));
        beforeEach(module("modules/pubNotifications/toast.html"));
	    beforeEach(inject(function ($httpBackend, pubAnalyticService) {
	        pubAnalyticService.fetch();
	        $httpBackend.whenPOST("api/v1/analytics/displayvalue").respond([]);
	        $httpBackend.flush();
	    }));


        beforeEach(inject(function ($compile, $rootScope, $location) {

            this.$compile = $compile;
            this.$scope = $rootScope.$new();
            this.$location = $location;
            this.element = angular.element("<div id='nlpBar' pub-nlp-input  contenteditable={{canEdit}} ng-class='cursorSwitcher' ng-model='nlpDisplay' class='nlp-input'>");

            $compile(this.element)(this.$scope);
        }));

        it("Should display pub-nlp-input directive", function () {
            expect(this.element).to.exist;
        });

        describe("scope", function () {

            it("should exist", function () {
                expect(this.$scope).to.exist;
                expect(this.$scope).to.be.an("object");
            });
            it("'$scope.read' method should exist", function () {
                expect(this.$scope.read).to.be.a("function");
            });
        });

        it("tool tip function should set showTooltip to false", function () {
            this.$scope.togglePillTip();
            expect(this.$scope.showTooltip).to.equal(false);
        });

        it("update function should set the nlp to 'create report'", function () {
            this.$scope.update();
            expect(this.$scope.nlpDisplay).to.equal("create report");
        });

        it("updateNlp function should set the nlp to ''", function () {
            this.$scope.updateNlp(true);
            expect(this.$scope.nlpDisplay).to.equal("");
        });

        it("navigateNLP function should set the nlp to 'standard reports'", function () {
            this.$scope.navigateNLP("standard reports");
            expect(this.$scope.nlpDisplay).to.equal("standard reports");
        });

        it("pill maker function should make pills'", function () {
            var pillList = ["Ad Size","Revenue"];
            this.$scope.pillBtnMaker(pillList);
            expect(this.element.children()[0].innerHTML).to.equal("Ad Size");
            expect(this.element.children()[1].innerHTML).to.equal("Revenue");
        });

        it("pillNavigate function should redirect", function () {
            this.$location.url("/dimensions");
            this.$scope.pillNavigate("dimensions");

            var absUrl = this.$location.absUrl();
            expect(absUrl).to.equal("http://server/#/dimensions?f=eyJkIjpbXSwibSI6WyJyZXZlbnVlIiwicGFpZEltcHJlc3Npb25zIiwiZWNwbSJdLCJmIjpbXSwidCI6WzJdLCJjdCI6W10sImMiOnsidCI6ImxpbmVjaGFydCIsImQiOiIiLCJhIjoiZGF0ZSIsIm0iOiIifSwiYSI6ImRhdGUifQ%3D%3D");
        });

        it("test NLP display watch function if is command", function () {
            this.$scope.nlpDisplay = "slice <a>pill</a>";
            this.$scope.$digest();
            
            expect(this.$scope.canEdit).to.equal(false);
            expect(this.$scope.cursorSwitcher).to.equal("non-editable");
            expect(this.$scope.textProcessed).to.equal(false);
        });

        it("test NLP display watch function if is not a command", function () {
            this.$scope.nlpDisplay = "larlarlar";
            this.$scope.$digest();

            expect(this.$scope.canEdit).to.equal(true);
            expect(this.$scope.cursorSwitcher).to.equal("");
            expect(this.$scope.textProcessed).to.equal(undefined);
        });

    });
}).call(this);
