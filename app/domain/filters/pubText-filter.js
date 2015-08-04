/*global angular*/
(function (angular) {
	"use strict";

	var app =  angular.module("pub-ui-analytics.domain");

	/**
	 * @ngdoc filter
	 * @name pubText
	 * @function
	 *
	 * @description
	 * Convert a input data to a string
	 *
	 * @params input {number|string}
	 * @params symbol {string}
	 *
	 * @returns {string} Formated string
	 */
	app.filter("pubText", function () {
		return function (input) {
			var out;
			out = input + "";
			return out;
		};
	});

}).call(this, angular);