/*global describe, it, beforeEach, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Controller: benchmarkDateDialogCtrl", function () {

        beforeEach(module("pubSlicerApp"));
        beforeEach(module("modules/pubNotifications/toast.html"));

        beforeEach(inject(function ($rootScope, $controller,$httpBackend,DateModel) {
            $httpBackend.whenPOST("api/v1/analytics/displayvalue").respond([]);
            $httpBackend.flush();
            this.$scope = $rootScope.$new();
            this.DateModel = DateModel;

            this.controller = $controller("benchmarkDateDialogCtrl", {
                $scope: this.$scope
            });
            
        }));

        beforeEach(inject(function ($compile) {
            this.$scope.dateParam = "{\"optionIndex\":2}";
            this.element = angular.element("<benchmark-date-dialog date-object=" + this.$scope.dateParam + "></benchmark-date-dialog>");
            $compile(this.element)(this.$scope);

            this.$compile = $compile;
        }));

        describe("scope", function () {
            it("should exist", function () {
                expect(this.$scope).to.exist;
                expect(this.$scope).to.be.an("object");
            });
        });

        it("should exist", function () {
            expect(this.controller).to.exist;
            expect(this.controller).to.be.an("object");
        });


        it("getOptionGroup should return hour/date", function () {
            this.$scope.datepickerAggregation = "quarter";
            expect(this.$scope.getOptionGroup()).to.equal("quarter");

            this.$scope.datepickerAggregation = "month";
            expect(this.$scope.getOptionGroup()).to.equal("month");
        });

        it("selectDateOption should set the right aggregation", function () {
            this.$scope.confirm = function () {
                //empty function fake the ngDialog confirm.
            };
            this.$scope.selectDateOption(4);
            expect(this.DateModel.getAggregation()).to.equal("week");

            this.$scope.selectDateOption(5);
            expect(this.DateModel.getAggregation()).to.equal("month");

        });



        it("test pickerClick function", function () {
            this.$scope.confirm = function () {
                //empty function fake the ngDialog confirm.
            };
            this.$scope.selectDateOption(4);
            this.$scope.setDatepickerAggregation("week");

            this.$scope.pickerClick();

            this.$scope.setDatepickerAggregation("month");


            this.$scope.pickerClick();

        });


        it("testing yearFormat", function () {
            var temp = new Date(2014,11,5);
            expect(this.$scope.yearFormat(temp)).to.equal(2014);

        });

        it("testing validateDate", function () {
            var tempStart = new Date();
            var tempEnd = new Date(tempStart);


            //testing week
            this.$scope.datepickerAggregation = "week";
            tempEnd.setDate(tempStart.getDate()-10);
            this.$scope.validateDate(tempStart,tempEnd);
            expect(this.$scope.errorMessage).to.equal("ERROR.INVALID_END_WEEK");


            tempStart = new Date();
            tempEnd = new Date(tempStart);
            tempEnd.setDate(tempStart.getDate()+40);
            this.$scope.validateDate(tempStart,tempEnd);
            expect(this.$scope.errorMessage).to.equal("ERROR.INVALID_WEEK_FUTURE");


            //testing month
            this.$scope.errorMessage = "";
            this.$scope.datepickerAggregation = "month";
            tempStart = new Date();
            tempEnd = new Date(tempStart);
            tempEnd.setDate(tempStart.getDate()-40);
            this.$scope.validateDate(tempStart,tempEnd);
            this.$scope.validateDate(tempStart,tempEnd);
            expect(this.$scope.errorMessage).to.equal("ERROR.INVALID_END_MONTH");


            tempStart = new Date();
            tempEnd = new Date(tempStart);
            tempEnd.setDate(tempStart.getDate()+40);
            this.$scope.validateDate(tempStart,tempEnd);
            expect(this.$scope.errorMessage).to.equal("ERROR.INVALID_MONTH_FUTURE");



        });
     
    });
}).call(this);
