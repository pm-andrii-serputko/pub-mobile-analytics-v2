/*global angular*/
(function (angular) {
    "use strict";

    var app =  angular.module("pub-ui-analytics.domain");

    /**
     * @ngdoc filter
     * @name pubCurrency
     * @function
     *
     * @description
     * Formats a number as a currency (ie $1,234.56). When no currency symbol is provided, default
     * symbol for current locale is used.
     *
     * @params input {number|string}
     *
     * @returns {string} Formated currency
     */
    app.filter("pubCurrency", ["$filter", "currencySymbol", function ($filter, currencySymbol) {
        return function (input, options) {
            var out = "", symbol;
            input = input || "";

            symbol = currencySymbol.get(options.currency);
            out = $filter("currency")(input, symbol);

            if (options.decimalPlaces === 0 && input > 1) {
                out = out.replace(/\.\d*/gi, "");
            }

            return out;
        };
    }]);

}).call(this, angular);



