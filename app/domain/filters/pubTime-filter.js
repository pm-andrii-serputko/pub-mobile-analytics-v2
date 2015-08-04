/*global angular*/
(function (angular) {
	"use strict";

	var app =  angular.module("pub-ui-analytics.domain");

	/**
	 * @ngdoc filter
	 * @name pubTime
	 * @function
	 *
	 * @description
	 * Convert a input data to time in seconds (ie 123,456.00s).
	 * 
	 * @params input {number|string}
	 * @params symbol {string}
	 * 
	 * @returns {string} Formated time
	 */
	app.filter("pubTime", ["$filter", function ($filter) {
		return function (input, options) {
			var out = "";
			var symbol = $filter("translate")("TIME.SECONDS_SYM");
			symbol = symbol === "TIME.SECONDS_SYM" ? "s" : symbol;

			out = $filter("number")(input, options.decimalPlaces);
			out = out + symbol;

			return out;
		};
	}]);

}).call(this, angular);