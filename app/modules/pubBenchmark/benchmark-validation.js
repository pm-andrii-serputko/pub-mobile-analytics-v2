(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics")
        .value("benchmarkValidation", {
            interquartileRange: [
                { validator: "required", message: "Interquartile range is required" },
                { validator: "isNumeric", message: "Interquartile range should be a number" },
                { validator: lessThen, message: "Interquartile range should be less then 100" },
                { validator: greaterThen, message: "Interquartile range should be greater then 0" }
            ]
        });

    /** Custom validation rule */
    function lessThen(field, formData, callback) {
        var isValid = formData[field] <= 100;
        callback(isValid);
    }

    /** Custom validation rule */
    function greaterThen(field, formData, callback) {
        var isValid = formData[field] >= 0;
        callback(isValid);
    }

    

}).call(this, angular);