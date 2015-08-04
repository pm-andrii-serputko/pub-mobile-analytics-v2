/*global describe, it, beforeEach, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Controller: PubDateDialogCtrl", function () {
        beforeEach(module("pubSlicerApp"));
        beforeEach(module("modules/pubNotifications/toast.html"));

        beforeEach(inject(function ($rootScope, $controller,$httpBackend,DateModel) {
            $httpBackend.whenPOST("api/v1/analytics/displayvalue").respond([]);
            $httpBackend.flush();
            this.$scope = $rootScope.$new();
            this.$scope.compare = true;
            this.controller = $controller("PubDateDialogCtrl", {
                $scope: this.$scope
            });
            this.DateModel = DateModel;
        }));

	    beforeEach(inject(function ($compile) {
            this.$scope.dateParam = "{\"optionIndex\":2}";
            this.element = angular.element("<pub-date-dialog date-object="+this.$scope.dateParam+" ></pub-date-dialog>");
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

        it("hour init function should set the right hour", function () {
            this.$scope.datepickerAggregation = "hour";
            var tempDate = new Date();
            tempDate.setHours(0);
            this.DateModel.setStartDate(tempDate);
            this.DateModel.setEndDate(tempDate);
            this.$scope.hourpickerInit();

            expect(this.$scope.hourObject.startHour).to.equal(12);

            tempDate.setHours(13);
            this.DateModel.setStartDate(tempDate);
            this.DateModel.setEndDate(tempDate);
            this.$scope.hourpickerInit();
            expect(this.$scope.hourObject.startHour).to.equal(1);
        });

        it("getOptionGroup should return hour/date", function () {
            this.$scope.datepickerAggregation = "hour";
            expect(this.$scope.getOptionGroup()).to.equal("hour");

            this.$scope.datepickerAggregation = "date";
            expect(this.$scope.getOptionGroup()).to.equal("date");
        });

        it("selectDateOption should set the right aggregation", function () {
            this.$scope.confirm = function () {
                //empty function fake the ngDialog confirm.
            };
            this.$scope.selectDateOption(0);
            expect(this.DateModel.getAggregation()).to.equal("hour");

            this.$scope.selectDateOption(1);
            expect(this.DateModel.getAggregation()).to.equal("date");

            this.$scope.selectDateOption(4);
            expect(this.DateModel.getAggregation()).to.equal("week");

            this.$scope.selectDateOption(5);
            expect(this.DateModel.getAggregation()).to.equal("month");

            this.$scope.selectDateOption(6);
            expect(this.DateModel.getAggregation()).to.equal("date");

            this.$scope.selectDateOption(10);
            expect(this.DateModel.getAggregation()).to.equal("date");
        });

        it("compareSwitch should set currentCompareView to 'compare'", function () {
            this.$scope.dateError = true;
            this.$scope.compareSwitch();

            this.$scope.dateError = false;
            this.$scope.compareSwitch();
            expect(this.$scope.currentCompareView).to.equal("compare");
        });

        it("test pickerClick function", function () {
            this.$scope.confirm = function () {
                //empty function fake the ngDialog confirm.
            };
            this.$scope.selectDateOption(4);
            this.$scope.setDatepickerAggregation("week");
            this.$scope.compare = true;

            this.$scope.comparePickerClick();
            this.$scope.pickerClick();

            this.$scope.setDatepickerAggregation("month");

            this.$scope.comparePickerClick();
            this.$scope.pickerClick();

        });

        it("testing toggleCompareView", function () {
            this.$scope.toggleCompareView("");
        });

        it("testing yearFormat", function () {
            this.$scope.toggleCompareView("");
            var temp = new Date(2014,11,5);
            expect(this.$scope.yearFormat(temp)).to.equal(2014);

        });

        it("testing validateDate", function () {
            var tempStart = new Date();
            var tempEnd = new Date(tempStart);
            tempEnd.setDate(tempStart.getDate()-1);
            this.$scope.validateDate(tempStart,tempEnd);
            this.$scope.validateDate(tempStart,tempEnd);
            expect(this.$scope.errorMessage).to.equal("ERROR.INVALID_END_DATE");


            tempStart = new Date();
            tempEnd = new Date(tempStart);
            tempEnd.setDate(tempStart.getDate()+1);
            this.$scope.validateDate(tempStart,tempEnd);
            expect(this.$scope.errorMessage).to.equal("ERROR.INVALID_DATE_FUTURE");

            tempStart = new Date();
            tempStart.setDate(tempStart.getDate()-10);
            tempEnd = new Date(tempStart);
            tempEnd.setDate(tempStart.getDate()+2);
            this.$scope.endDate = new Date(tempStart);
            this.$scope.endDate.setDate(tempStart.getDate()+1);
            this.$scope.compare = true;
            this.$scope.currentCompareView = "compare";
            this.$scope.validateDate(tempStart,tempEnd);
            expect(this.$scope.errorMessage).to.equal("ERROR.INVALID_DATE_COMPARE_FUTURE");

            this.$scope.compareEndDate = new Date(tempStart);
            this.$scope.compareEndDate.setDate(tempStart.getDate()+3);
            this.$scope.currentCompareView = "report";
            this.$scope.validateDate(tempStart,tempEnd);
            expect(this.$scope.errorMessage).to.equal("ERROR.INVALID_DATE_COMPARE_FUTURE");



            this.$scope.currentCompareView = "report";
            this.$scope.datepickerAggregation = "hour";
            this.$scope.validateDate(tempStart,tempEnd);
            this.$scope.hourObject.startHour = 10;
            this.$scope.hourObject.startPeriod = "PM";
            this.$scope.validateDate(tempStart,tempEnd);
            this.$scope.hourObject.startPeriod = "AM";
            this.$scope.hourObject.startHour = 12;
            this.$scope.validateDate(tempStart,tempEnd);



            this.$scope.currentCompareView = "compare";
            this.$scope.validateDate(tempStart,tempEnd);
            this.$scope.hourCompareObject.startHour = 14;
            this.$scope.hourCompareObject.startPeriod = "PM";
            this.$scope.validateDate(tempStart,tempEnd);
            this.$scope.hourCompareObject.startPeriod = "AM";


            this.$scope.endDate= new Date();
            this.$scope.startDate= new Date();
            this.$scope.hourCompareObject.startHour = 12;
            this.$scope.validateDate(tempStart,tempEnd);

            this.$scope.hourCompareObject.startHour = 12;
            this.$scope.hourCompareObject.startPeriod === "PM";
            this.$scope.validateDate(tempStart,tempEnd);



            //testing week
            this.$scope.datepickerAggregation = "week";
            tempStart = new Date();
            tempEnd = new Date(tempStart);
            tempEnd.setDate(tempStart.getDate()-10);
            this.$scope.validateDate(tempStart,tempEnd);
            expect(this.$scope.errorMessage).to.equal("ERROR.INVALID_END_WEEK");


            tempStart = new Date();
            tempEnd = new Date(tempStart);
            tempEnd.setDate(tempStart.getDate()+40);
            this.$scope.validateDate(tempStart,tempEnd);
            expect(this.$scope.errorMessage).to.equal("ERROR.INVALID_WEEK_FUTURE");




            this.$scope.errorMessage = "";
            tempStart = new Date();
            tempStart.setDate(tempStart.getDate()-50);
            tempEnd = new Date(tempStart);
            tempEnd.setDate(tempStart.getDate()+10);
            this.$scope.endDate = new Date(tempStart);
            this.$scope.endDate.setDate(tempStart.getDate()+1);
            this.$scope.compare = true;
            this.$scope.currentCompareView = "compare";
            this.$scope.validateDate(tempStart,tempEnd);
            expect(this.$scope.errorMessage).to.equal("ERROR.INVALID_DATE_COMPARE_FUTURE");



            this.$scope.compareEndDate = new Date(tempStart);
            this.$scope.compareEndDate.setDate(tempStart.getDate()+20);
            this.$scope.currentCompareView = "report";
            this.$scope.validateDate(tempStart,tempEnd);
            expect(this.$scope.errorMessage).to.equal("ERROR.INVALID_DATE_COMPARE_FUTURE");

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


            this.$scope.errorMessage = "";
            tempStart = new Date();
            tempStart.setDate(tempStart.getDate()-120);
            tempEnd = new Date(tempStart);
            tempEnd.setDate(tempStart.getDate()+35);
            this.$scope.endDate = new Date(tempStart);
            this.$scope.endDate.setDate(tempStart.getDate()+1);
            this.$scope.compare = true;
            this.$scope.currentCompareView = "compare";
            this.$scope.validateDate(tempStart,tempEnd);
            expect(this.$scope.errorMessage).to.equal("ERROR.INVALID_DATE_COMPARE_FUTURE");



            this.$scope.compareEndDate = new Date(tempStart);
            this.$scope.compareEndDate.setDate(tempStart.getDate()+85);
            this.$scope.currentCompareView = "report";
            this.$scope.validateDate(tempStart,tempEnd);
            expect(this.$scope.errorMessage).to.equal("ERROR.INVALID_DATE_COMPARE_FUTURE");
        });
     
    });
}).call(this);
