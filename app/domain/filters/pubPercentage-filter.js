/*global angular*/
(function (angular) {
	"use strict";

	var app =  angular.module("pub-ui-analytics.domain");

	/**
	 * @ngdoc filter
	 * @name pubPercentage
	 * @function
	 *
	 * @description
	 * Convert a input data to percentage (ie 1233456%).
	 *
	 * @params input {number|string}
	 *
	 * @returns {string} Formated percentage
	 */
	app.filter("pubPercentage", ["$filter", function ($filter) {
		return function (input, options) {
			var out, symbol;
			symbol = "%";
			options.decimalPlaces = options.decimalPlaces || 0;

			out = $filter("number")(input, options.decimalPlaces);
			out = out.replace(",", "");
			out = out + symbol;

			return out;
		};
	}]);

}).call(this, angular);