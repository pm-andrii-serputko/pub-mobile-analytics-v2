/*global describe, beforeEach, it, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("common.validations.validator", function () {

        beforeEach(function () {
            module("pub-ui-analytics.common");
        });

        beforeEach(function () {
            inject(function(validator) {
                this.validator = validator;
            });
        });

        beforeEach(function() {
            this.data = {id: "age", value: 30};
            this.constraints = {
                id: [
                    { validator: "required", message: "ID is required" }
                ],
                value: [
                    { validator: "required", message: "VALUE is required" },
                    { validator: "isNumeric", message: "VALUE should be a number" }
                ]
            };
        });

        it("should be registered in the 'common' module", function () {
            expect(this.validator).to.be.an("object");
        });

        describe("validate", function() {
            it("should validate data using constraints", function() {
                var errors = this.validator.validate(this.data, this.constraints);
                expect(errors).to.equal(null);
            });

            it("should return errors if data invalid", function() {
                this.data.value = "30years";

                var errors = this.validator.validate(this.data, this.constraints);
                expect(Object.keys(errors)).have.length(1);
                expect(errors.value).to.equal("VALUE should be a number");

                this.data.id = "";
                
                errors = this.validator.validate(this.data, this.constraints);
                expect(Object.keys(errors)).have.length(2);
                expect(errors.id).to.equal("ID is required");
                expect(errors.value).to.equal("VALUE should be a number");
            });

            it("should support custom validate rules", function() {
                this.constraints.value.push({
                    validator: equalTo20,
                    message: "VALUE should be equal tp 20"
                });

                function equalTo20(field, formData, callback) {
                    var isValid = formData[field] === 20;
                    callback(isValid);
                }

                var errors = this.validator.validate(this.data, this.constraints);
                expect(Object.keys(errors)).have.length(1);
                expect(errors.value).to.equal("VALUE should be equal tp 20");
            });
        });
    });

}).call(this);