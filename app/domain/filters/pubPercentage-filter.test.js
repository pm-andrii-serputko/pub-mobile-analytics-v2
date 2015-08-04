/*global describe, beforeEach, it, expect, inject*/
(function () {
	"use strict";

	describe("Filter: pubPercentage", function () {
		
		var pubPercentage;

		// load the module
		beforeEach(function () {
			module("pub-ui-analytics.domain");
		});

		beforeEach(function () {
			inject(function($filter) {
				pubPercentage = $filter("pubPercentage");
			});
		});

		it("should be a function", function () {
			expect(pubPercentage).to.be.a("function");
		});

		it("should be valide", function () {
			expect(pubPercentage("", { decimalPlaces: 0, thousandSeparator: false })).to.equal("0%");
			expect(pubPercentage("1", { decimalPlaces: 0, thousandSeparator: false })).to.equal("1%");
			expect(pubPercentage("12", { decimalPlaces: 0, thousandSeparator: false })).to.equal("12%");
			expect(pubPercentage("123", { decimalPlaces: 0, thousandSeparator: false })).to.equal("123%");
			expect(pubPercentage("1234", { decimalPlaces: 0, thousandSeparator: false })).to.equal("1234%");
			expect(pubPercentage("12345", { decimalPlaces: 0, thousandSeparator: false })).to.equal("12345%");
			expect(pubPercentage("123456", { decimalPlaces: 0, thousandSeparator: false })).to.equal("123456%");
		});

	});

}).call(this);