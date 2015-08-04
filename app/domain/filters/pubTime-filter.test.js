/*global describe, beforeEach, it, expect, inject*/
(function () {
	"use strict";

	describe("Filter: pubTime", function () {
		
		var pubTime;

		// load the module
		beforeEach(function () {
			module("pubSlicerApp");
		});

		beforeEach(function () {
			inject(function($filter) {
				pubTime = $filter("pubTime");
			});
		});

		it("should be a function", function () {
			expect(pubTime).to.be.a("function");
		});

		it("should be a valid if input is a number", function () {
			expect(pubTime(1, { decimalPlaces: 2, thousandSeparator: true })).to.equal("1.00s");
			expect(pubTime(12, { decimalPlaces: 2, thousandSeparator: true })).to.equal("12.00s");
			expect(pubTime(123, { decimalPlaces: 2, thousandSeparator: true })).to.equal("123.00s");
			expect(pubTime(1234, { decimalPlaces: 2, thousandSeparator: true })).to.equal("1,234.00s");
			expect(pubTime(12345, { decimalPlaces: 2, thousandSeparator: true })).to.equal("12,345.00s");
			expect(pubTime(123456, { decimalPlaces: 2, thousandSeparator: true })).to.equal("123,456.00s");
			expect(pubTime(1234567, { decimalPlaces: 2, thousandSeparator: true })).to.equal("1,234,567.00s");
			expect(pubTime(12345678, { decimalPlaces: 2, thousandSeparator: true })).to.equal("12,345,678.00s");
			expect(pubTime(123456789, { decimalPlaces: 2, thousandSeparator: true })).to.equal("123,456,789.00s");
			expect(pubTime(123456789.10, { decimalPlaces: 2, thousandSeparator: true })).to.equal("123,456,789.10s");
			expect(pubTime(123456789.11, { decimalPlaces: 2, thousandSeparator: true })).to.equal("123,456,789.11s");
			expect(pubTime(123456789.111, { decimalPlaces: 2, thousandSeparator: true })).to.equal("123,456,789.11s");
		});

		it("should be a valid if input is a string", function () {
			expect(pubTime("", { decimalPlaces: 2, thousandSeparator: true })).to.equal("0.00s");
			expect(pubTime("1", { decimalPlaces: 2, thousandSeparator: true })).to.equal("1.00s");
			expect(pubTime("12", { decimalPlaces: 2, thousandSeparator: true })).to.equal("12.00s");
			expect(pubTime("123", { decimalPlaces: 2, thousandSeparator: true })).to.equal("123.00s");
			expect(pubTime("1234", { decimalPlaces: 2, thousandSeparator: true })).to.equal("1,234.00s");
			expect(pubTime("12345", { decimalPlaces: 2, thousandSeparator: true })).to.equal("12,345.00s");
			expect(pubTime("123456", { decimalPlaces: 2, thousandSeparator: true })).to.equal("123,456.00s");
			expect(pubTime("1234567", { decimalPlaces: 2, thousandSeparator: true })).to.equal("1,234,567.00s");
			expect(pubTime("12345678", { decimalPlaces: 2, thousandSeparator: true })).to.equal("12,345,678.00s");
			expect(pubTime("123456789", { decimalPlaces: 2, thousandSeparator: true })).to.equal("123,456,789.00s");
			expect(pubTime("123456789.10", { decimalPlaces: 2, thousandSeparator: true })).to.equal("123,456,789.10s");
			expect(pubTime("123456789.11", { decimalPlaces: 2, thousandSeparator: true })).to.equal("123,456,789.11s");
			expect(pubTime("123456789.111", { decimalPlaces: 2, thousandSeparator: true })).to.equal("123,456,789.11s");
		});

	});

}).call(this);