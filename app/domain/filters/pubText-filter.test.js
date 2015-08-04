/*global describe, beforeEach, it, expect, inject*/
(function () {
	"use strict";

	describe("Filter: pubText", function () {
		
		var pubText;

		// load the module
		beforeEach(function () {
			module("pub-ui-analytics.domain");
		});

		beforeEach(function () {
			inject(function($filter) {
				pubText = $filter("pubText");
			});
		});

		it("should be a function", function () {
			expect(pubText).to.be.a("function");
		});

		it("should be valide", function () {
			expect(pubText("")).to.equal("");
			expect(pubText("Hello")).to.equal("Hello");
			expect(pubText("Filter: pubText")).to.equal("Filter: pubText");
			expect(pubText(1234567890)).to.equal("1234567890");
			expect(pubText(1234567890.12)).to.equal("1234567890.12");
			expect(pubText(NaN)).to.equal("NaN");
			expect(pubText(true)).to.equal("true");
		});

	});

}).call(this);