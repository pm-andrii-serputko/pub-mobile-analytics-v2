/*global angular*/
(function (angular) {
	"use strict";

	var app =  angular.module("pub-ui-analytics.domain");

	/**
	 * @ngdoc filter
	 * @name pubNumber
	 * @function
	 *
	 * @description
	 * Convert a input data to number
	 *
	 * @params input {number|string}
	 *
	 * @returns {string} Formated number
	 */
	app.filter("pubNumber", ["$filter", function ($filter) {
		return function (input, options) {
			var out = "";
			input = input || "";

			out = $filter("number")(input, options.decimalPlaces);

			if (!options.thousandSeparator) {
				out = out.split(",").join("");
			}

			return out;
		};
	}]);

}).call(this, angular);