/*global angular*/
(function(angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");
    app.directive("multipleEmails", function () {
            var EMAIL_REGEXP = /^[a-z0-9!#$%&*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i;

            function validateAll(ctrl, validatorName, value) {
                var validity = ctrl.$isEmpty(value) || value.split(",").every(
                    function (email) {
                        return EMAIL_REGEXP.test(email.trim());
                    }
                );

                ctrl.$setValidity(validatorName, validity);
                return validity ? value : value;
            }

            return {
                restrict: "A",
                require: "ngModel",
                link: function postLink(scope, elem, attrs, modelCtrl) {
                    function multipleEmailsValidator(value) {
                        return validateAll(modelCtrl, "multipleEmails", value);
                    }

                    modelCtrl.$formatters.push(multipleEmailsValidator);
                    modelCtrl.$parsers.push(multipleEmailsValidator);
                }
            };
        });
}).call(this, angular);