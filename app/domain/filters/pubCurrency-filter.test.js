/*global describe, beforeEach, it, expect, inject*/
(function () {
	"use strict";

	describe("Filter: pubCurrency", function () {

		var pubCurrency;

		// load the module
		beforeEach(function () {
			module("pubSlicerApp");
		});

		beforeEach(function () {
			inject(function($filter) {
				pubCurrency = $filter("pubCurrency");
			});
		});

		it("should return valid currency", function () {
			expect(pubCurrency(100, { decimalPlaces: 2, thousandSeparator: true })).to.equal("R100.00");
			expect(pubCurrency(0.1, { decimalPlaces: 2, thousandSeparator: true })).to.equal("R0.10");
			expect(pubCurrency(0.11, { decimalPlaces: 2, thousandSeparator: true })).to.equal("R0.11");
			expect(pubCurrency(0.05, { decimalPlaces: 2, thousandSeparator: true })).to.equal("R0.05");
			expect(pubCurrency(10.05, { decimalPlaces: 2, thousandSeparator: true })).to.equal("R10.05");
			expect(pubCurrency(10.051, { decimalPlaces: 2, thousandSeparator: true })).to.equal("R10.05");
			expect(pubCurrency(10.05999, { decimalPlaces: 2, thousandSeparator: true })).to.equal("R10.06");
			expect(pubCurrency(1234567890.12, { decimalPlaces: 2, thousandSeparator: true })).to.equal("R1,234,567,890.12");
			expect(pubCurrency("1234567890.12", { decimalPlaces: 2, thousandSeparator: true })).to.equal("R1,234,567,890.12");
			expect(pubCurrency("1234567890", { decimalPlaces: 2, thousandSeparator: true })).to.equal("R1,234,567,890.00");
		});

	});

}).call(this);