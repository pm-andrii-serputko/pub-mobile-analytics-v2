(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.common")
        .service("validator", validator);

    /**
     * @ngdoc service
     * @name validator
     * @function
     * @description
     * This is validator, a part of crosscutting concerns functionality.
     * So we can use it on different layer of application (presentation, domain, dao).
     * The validator has just one public method (validate) and
     * collection of standard validators (for example: isNumeric, required, isEmail, ...).
     * There is small example how to use validator:
     * @example
            var data = {id: "email", name: "examole@gmail.com"};
            var constraints = {
                id: [
                    { validator: "required", message: "ID is required" },
                    { validator: "isAlpha", message: "ID should be a string" }
                ],
                name: [
                    { validator: "required", message: "NAME is required" },
                    { validator: "isEmail", message: "NAME should be an amail" },
                    { validator: "isLength", params: [7, 25], message: "NAME should be ..." },
                    { validator: customValidator, message: "NAME should be ..." },
                ]
            }
            function customValidator(field, formData, callback) {
                // Add your custom validation logic here
                var isValid = formData[field] ? true : false;
                callback(isValid);
            }
            validate(data, constraints);
     */
    function validator () {
        var DEFAULT_MESSAGE = "Field is not valid";
        var service = {
            validate: validate
        };

        /**
         * @description
         * List of standard validators.
         * @private
         */
        var validates = {
            equals: function() { /**TODO: add implementation */},
            contains: function() { /**TODO: add implementation */},
            matches: function() { /**TODO: add implementation */},
            isEmail: function() { /**TODO: add implementation */},
            isURL: function() { /**TODO: add implementation */},
            isFQDN: function() { /**TODO: add implementation */},
            isIP: function() { /**TODO: add implementation */},
            isAlpha: function() { /**TODO: add implementation */},
            isNumeric: isNumeric,
            isAlphanumeric: function() { /**TODO: add implementation */},
            isBase64: function() { /**TODO: add implementation */},
            isHexadecimal: function() { /**TODO: add implementation */},
            isHexColor: function() { /**TODO: add implementation */},
            isLowercase: function() { /**TODO: add implementation */},
            isUppercase: function() { /**TODO: add implementation */},
            isInt: function() { /**TODO: add implementation */},
            isFloat: function() { /**TODO: add implementation */},
            isDivisibleBy: function() { /**TODO: add implementation */},
            isNull: function() { /**TODO: add implementation */},
            isLength: function() { /**TODO: add implementation */},
            isByteLength: function() { /**TODO: add implementation */},
            isUUID: function() { /**TODO: add implementation */},
            isDate: function() { /**TODO: add implementation */},
            isAfter: function() { /**TODO: add implementation */},
            isBefore: function() { /**TODO: add implementation */},
            isIn: function() { /**TODO: add implementation */},
            isCreditCard: function() { /**TODO: add implementation */},
            isISBN: function() { /**TODO: add implementation */},
            isMobilePhone: function() { /**TODO: add implementation */},
            isJSON: function() { /**TODO: add implementation */},
            isMultibyte: function() { /**TODO: add implementation */},
            isAscii: function() { /**TODO: add implementation */},
            isFullWidth: function() { /**TODO: add implementation */},
            isHalfWidth: function() { /**TODO: add implementation */},
            isVariableWidth: function() { /**TODO: add implementation */},
            isSurrogatePair: function() { /**TODO: add implementation */},
            isMongoId: function() { /**TODO: add implementation */}
        };

        /**
         * @description
         * Validate data using constraints
         * @params data {object} data in JSON format
         * @params constraints {object} List of data properties and constraints for each of the property.
         * @example
                var data = {id: "email", name: "examole@gmail.com"};
                var constraints = {
                    id: [
                        { validator: "required", message: "ID is required" },
                        { validator: "isAlpha", message: "ID should be a string" }
                    ],
                    name: [
                        { validator: "required", message: "NAME is required" },
                        { validator: "isEmail", message: "NAME should be an amail" },
                        { validator: "isLength", params: [7, 25], message: "NAME should be ..." },
                        { validator: customValidator, message: "NAME should be ..." },
                    ]
                }
                function customValidator(field, formData, callback) {
                    // Add your custom validation logic here
                    var isValid = formData[field] ? true : false;
                    callback(isValid);
                }
                validate(data, constraints);
         * @public
         */
        function validate(data, constraints) {
            var errors = {},
                flattenData = flattenJSON(data),
                validators  = constraints,
                stack = [];
            Object.keys(validators).forEach(function(field) {
                if (validators[field]) {
                    validators[field].forEach(function(constraint) {
                        if (constraint.validator) {
                            addValidator.call(this, field, constraint, stack, flattenData, errors);
                        }
                    });
                }
            });

            stack.forEach(function (cb) { return cb.apply(null, arguments); });
            
            return Object.keys(errors).length ? errors : null;
        }

        /**
         * @description
         * Add validator to stack.
         * @params field {string} Property of data object
         * @params constraint {object}
         * @params stack {array} List of current validators
         * @params flattenData {object} Flatten data in JSON format
         * @params flattenData {array} List of errors
         * @private
         */
        function addValidator(field, constraint, stack, flattenData, errors) {
            var validator,
                params,
                checkEmpty = false;
            if ("function" === typeof constraint.validator) {
                validator = constraint.validator;
                params = [ field, flattenData ];
                if (constraint.checkEmpty) {
                    checkEmpty = true;
                }
            } else {
                var handler;
                if ("required" === constraint.validator) {
                    handler = function(value) {
                        return null !== value && "" !== value && typeof value !== "undefined";
                    };
                    checkEmpty = true;
                } else {

                    handler = validates[constraint.validator] || function() { return false; };
                }
                validator = function() {
                    var params = Array.prototype.slice.call(arguments, 0, -1),
                        callback = Array.prototype.slice.call(arguments, -1)[0],
                        isValid = handler.apply(handler, params);
                    callback(isValid);
                };
                params = constraint.params ? constraint.params.slice(0) : [];
                params.unshift(flattenData[field]);
            }
            if (checkEmpty || flattenData[field]) {
                stack.push(function validateValue() {
                    if (!errors[field]) {
                        params.push(function resultHandler(valid) {
                            if (!valid) {
                                errors[field] = constraint.message || DEFAULT_MESSAGE;
                            }
                        });
                        validator.apply(null, params);
                    }
                });
            }
        }

        /**
         * @description
         * Remove duplicated properties
         * @params data {object} data in JSON format
         * @params acc {object}
         * @params nestedKey {string}
         * @private
         */
        function flattenJSON(data, acc, nestedKey) {
            if (!acc) {
                acc = {};
            }
            Object.keys(data).forEach(function(key) {
                var flattenKey = nestedKey ? nestedKey + "." + key : key;
                if (canBeFlattened(data[key])) {
                    acc = flattenJSON(data[key], acc, flattenKey);
                } else {
                    acc[flattenKey] = data[key];
                }
            });
            return acc;
        }

        /**
         * @description
         * Check if data might be flattened
         * @params data {object} data in JSON format
         * @private
         */
        function canBeFlattened(data) {
            return "[object Object]" === Object.prototype.toString.call(data);
        }

        /**
         * @description
         * Check if the string contains only numbers.
         * @params str {string}
         * @returns {boolean}
         * @private
         */
        function isNumeric(str) {
            var numeric = /^-?[0-9]+$/;
            return numeric.test(str);
        }

        return service;
    }

}).call(this, angular);
