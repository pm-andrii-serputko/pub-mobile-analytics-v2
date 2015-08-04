/*global describe, beforeEach, it, expect, inject*/
(function () {
	"use strict";

	describe("Filter: pubNumber", function () {
		
		var pubNumber;

		// load the module
		beforeEach(function () {
			module("pub-ui-analytics.domain");
		});

		beforeEach(function () {
			inject(function($filter) {
				pubNumber = $filter("pubNumber");
			});
		});

		it("should be a function", function () {
			expect(pubNumber).to.be.a("function");
		});

		it("should return valid number", function () {
			expect(pubNumber(100, { decimalPlaces: 0, thousandSeparator: true })).to.equal("100");
			expect(pubNumber(0.1, { decimalPlaces: 0, thousandSeparator: true })).to.equal("0");
			expect(pubNumber(0.11, { decimalPlaces: 0, thousandSeparator: true })).to.equal("0");
			expect(pubNumber(0.05, { decimalPlaces: 0, thousandSeparator: true })).to.equal("0");
			expect(pubNumber(10.05, { decimalPlaces: 0, thousandSeparator: true })).to.equal("10");
			expect(pubNumber(10.051, { decimalPlaces: 0, thousandSeparator: true })).to.equal("10");
			expect(pubNumber(10.05999, { decimalPlaces: 0, thousandSeparator: true })).to.equal("10");
			expect(pubNumber(1234567890.12, { decimalPlaces: 0, thousandSeparator: true })).to.equal("1,234,567,890");
			expect(pubNumber("1234567890.12", { decimalPlaces: 0, thousandSeparator: true })).to.equal("1,234,567,890");
			expect(pubNumber("1234567890", { decimalPlaces: 0, thousandSeparator: true })).to.equal("1,234,567,890");
		});

		it("should support different decimal values", function () {
			expect(pubNumber(100, { decimalPlaces: 0, thousandSeparator: true })).to.equal("100");
			expect(pubNumber(100, { decimalPlaces: 1, thousandSeparator: true })).to.equal("100.0");
			expect(pubNumber(100, { decimalPlaces: 2, thousandSeparator: true })).to.equal("100.00");
			expect(pubNumber(100, { decimalPlaces: 3, thousandSeparator: true })).to.equal("100.000");
			expect(pubNumber(100.77, { decimalPlaces: 3, thousandSeparator: true })).to.equal("100.770");
		});

		it("should be formated with thousand separator", function () {
			expect(pubNumber(1234567890.12, { decimalPlaces: 2, thousandSeparator: true })).to.equal("1,234,567,890.12");
			expect(pubNumber("1234567890.12", { decimalPlaces: 2, thousandSeparator: true })).to.equal("1,234,567,890.12");
		});

		it("should be formated without thousand separator", function () {
			expect(pubNumber(1234567890.12, { decimalPlaces: 2, thousandSeparator: false })).to.equal("1234567890.12");
			expect(pubNumber(1234567890.12, { decimalPlaces: 2, thousandSeparator: false })).to.equal("1234567890.12");
			expect(pubNumber("1234567890.12", { decimalPlaces: 2, thousandSeparator: false })).to.equal("1234567890.12");
		});

		it("should be formated with decimal and with thousand separator", function () {
			expect(pubNumber(1234567890.12, { decimalPlaces: 2, thousandSeparator: true })).to.equal("1,234,567,890.12");
		});

		it("should be formated without decimal and with thousand separator", function () {
			expect(pubNumber(1234567890.12, { decimalPlaces: 0, thousandSeparator: true })).to.equal("1,234,567,890");
		});

		it("should be formated with decimal and without thousand separator", function () {
			expect(pubNumber(1234567890.12, { decimalPlaces: 2, thousandSeparator: false })).to.equal("1234567890.12");
		});

		it("should be formated without decimal and without thousand separator", function () {
			expect(pubNumber(1234567890.12, { decimalPlaces: 0, thousandSeparator: false })).to.equal("1234567890");
		});

	});

}).call(this);