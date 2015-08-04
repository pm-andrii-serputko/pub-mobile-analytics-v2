/*global describe, beforeEach, afterEach, it, expect, inject, sinon*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("modules.scheduleReportCtrl", function () {
        beforeEach(function () {
            module("pubSlicerApp");
        });

        beforeEach(function () {
            inject(function($rootScope, $controller, $timeout) {
                this.$scope = $rootScope.$new();
                this.$timeout = $timeout;

                sinon.stub(document, "getElementById", function() {
                        var defer = {
                            focus: function() {
                                return;
                            }
                        };
                        return defer;
                    });
                $controller("scheduleReportCtrl", {
                    $scope: this.$scope
                });
                this.$scope.$digest();
            });
        });
        afterEach(function() {
            document.getElementById.restore();
        });

        it("should have initialized variables", function() {
            expect(this.$scope.scheduleSuccess).to.equal(false);
            expect(this.$scope.duplicateReport).to.equal(false);
            expect(this.$scope.scheduleReportValidationMessage).to.equal("");
            expect(this.$scope.model).to.be.an("object");
            expect(this.$scope.lookup).to.be.an("object");
            expect(this.$scope.timeZone).to.be.a("string");
            expect(this.$scope.freqArray).to.be.an("array");
            expect(this.$scope.periodArray).to.be.an("array");
            expect(this.$scope.hourArray).to.be.an("array");
            this.$timeout.flush();
        });

        describe("populateDaysBasedOnFrequency", function() {

            it("should test if selected frequency is Daily", function() {
                this.$scope.populateDaysBasedOnFrequency("DAILY");
                expect(this.$scope.removeDay).to.equal(true);
                expect(this.$scope.lookup.frequency).to.equal("DAILY");
                expect(this.$scope.lookup.day).to.equal(1);

            });

            it("should test if selected frequency is Weekly", function() {
                this.$scope.lookup.day = 8;
                this.$scope.populateDaysBasedOnFrequency("WEEKLY");
                expect(this.$scope.removeDay).to.equal(false);
                expect(this.$scope.lookup.frequency).to.equal("WEEKLY");
                expect(this.$scope.lookup.day).to.equal(1);
                this.$scope.lookup.day = 6;
                this.$scope.populateDaysBasedOnFrequency("WEEKLY");
                expect(this.$scope.lookup.day).to.equal(6);

            });

            it("should test if selected frequency is Monthly", function() {
                this.$scope.populateDaysBasedOnFrequency("MONTHLY");
                expect(this.$scope.removeDay).to.equal(false);
                expect(this.$scope.lookup.frequency).to.equal("MONTHLY");
            });

        });

        describe("save", function() {
            beforeEach(function () {
                inject(function($rootScope, $controller, $timeout, scheduleReportsService) {
                    this.scheduleReportsService = scheduleReportsService;
                    sinon.stub(this.scheduleReportsService, "all", function() {
                        return getWholeScheduleMockList();
                    });

                    $controller("scheduleReportCtrl", {
                        $scope: this.$scope
                    });
                    this.$scope.$digest();
                });
            });
            afterEach(function() {
                this.scheduleReportsService.all.restore();
            });

            it("should check if report is a duplicate one and return true if so", function() {
                this.$scope.scheduleReportId = null;
                this.$scope.lookup = getScheduleReportMock();
                this.$scope.save();
                expect(this.$scope.duplicateReport).to.equal(true);
                expect(this.$scope.scheduleReportValidationMessage).to.equal("REPORTS.DUPLICATE_REPORT_MESSAGE");
            });

            it("if email and subject fields are valid, call service to update a schedule report", function() {
                this.$scope.subjectForm = {
                        subject: {
                            $valid: true
                        }
                    };
                this.$scope.emailForm = {
                    email: {
                        $valid: true
                    }
                };
                this.$scope.scheduleReportId = true;
                this.$scope.save();
                expect(this.$scope.scheduleReportId).to.equal(true);
                expect(this.$scope.scheduleReportValidationMessage).to.equal("REPORTS.SCHEDULING");
            });
            it("if email and subject fields are valid, call service to create a schedule report", function() {
                this.$scope.scheduleReportId = false;
                this.$scope.subjectForm = {
                        subject: {
                            $valid: true
                        }
                    };
                this.$scope.emailForm = {
                    email: {
                        $valid: true
                    }
                };
                this.$scope.save();
                expect(this.$scope.scheduleReportId).to.equal(false);
                expect(this.$scope.scheduleReportValidationMessage).to.equal("REPORTS.SCHEDULING");
            });

            it("if subject field is not set, throw an error", function() {
                this.$scope.scheduleReportId = false;
                this.$scope.subjectForm = {
                    subject: {
                        $valid: false
                    }
                };
                this.$scope.emailForm = {
                    email: {
                        $error: {
                            multipleEmails: false
                        }
                    }
                };
                this.$scope.lookup.email = true;
                this.$scope.save();
                expect(this.$scope.scheduleReportId).to.equal(false);
                expect(this.$scope.scheduleReportValidationMessage).to.equal("REPORTS.SCHEDULE_REQUIRED_SUBJECT");
            });

            it("if email field is incorrectly set, throw an error", function() {
                this.$scope.scheduleReportId = false;
                this.$scope.subjectForm = {
                    subject: {
                        $valid: true
                    }
                };
                this.$scope.emailForm = {
                    email: {
                        $error: {
                            multipleEmails: true
                        }
                    }
                };
                this.$scope.lookup.email = true;
                this.$scope.save();
                expect(this.$scope.scheduleReportId).to.equal(false);
                expect(this.$scope.scheduleReportValidationMessage).to.equal("REPORTS.SCHEDULE_WRONG_EMAIL_FORMAT");
            });

            it("if email field is not set, throw an error", function() {
                this.$scope.scheduleReportId = false;
                this.$scope.subjectForm = {
                    subject: {
                        $valid: true
                    }
                };
                this.$scope.emailForm = {
                    email: {
                        $error: {
                            multipleEmails: false
                        }
                    }
                };
                this.$scope.lookup.email = false;
                this.$scope.save();
                expect(this.$scope.scheduleReportId).to.equal(false);
                expect(this.$scope.scheduleReportValidationMessage).to.equal("REPORTS.SCHEDULE_REQUIRED_EMAIL");
            });

        });
        function getScheduleReportMock() {
            return  {
                "id":64,
                "reportId":334,
                "reportName":"report2",
                "reportType":"CUSTOM",
                "downloadType":"EXCEL",
                "frequency":"DAILY",
                "day":1,
                "hour":1,
                "email":"gajendra.chavan@gmail.com",
                "subject":"sss",
                "comment":"sss",
                "reportTypeEnum":"CUSTOM",
                "downloadTypeEnum":"EXCEL",
                "frequencyEnum":"DAILY"
            };
        }

        function getWholeScheduleMockList(){
            return [
                {
                    attributes: {
                        "id":32,
                        "reportId":261,
                        "reportName":"Ad Size Performance",
                        "reportType":"STANDARD",
                        "downloadType":"EXCEL",
                        "frequency":"DAILY",
                        "day":1,
                        "hour":5,
                        "email":"omkar.saraf@pubmatic.com",
                        "subject":"Ad Size Performance!",
                        "comment":"this is test report by ME.",
                        "reportTypeEnum":"STANDARD",
                        "downloadTypeEnum":"EXCEL",
                        "frequencyEnum":"DAILY"
                    }
                },{
                    attributes: {
                        "id":54,
                        "reportId":292,
                        "reportName":"4/1/2015",
                        "reportType":"CUSTOM",
                        "downloadType":"EXCEL",
                        "frequency":"DAILY",
                        "day":1,
                        "hour":1,
                        "email":"gajendra.chavan@pubmatic.com",
                        "subject":"Scheduled report",
                        "comment":"",
                        "reportTypeEnum":"CUSTOM",
                        "downloadTypeEnum":"EXCEL",
                        "frequencyEnum":"DAILY"
                    }
                },{
                    attributes: {
                        "id":55,
                        "reportId":317,
                        "reportName":"report1",
                        "reportType":"CUSTOM",
                        "downloadType":"EXCEL",
                        "frequency":"DAILY",
                        "day":1,
                        "hour":1,
                        "email":"gajendra.chavan@pubmatic.com",
                        "subject":"Scheduled report",
                        "comment":"",
                        "reportTypeEnum":"CUSTOM",
                        "downloadTypeEnum":"EXCEL",
                        "frequencyEnum":"DAILY"
                    }
                },{
                    attributes:{
                        "id":64,
                        "reportId":334,
                        "reportName":"report2",
                        "reportType":"CUSTOM",
                        "downloadType":"EXCEL",
                        "frequency":"DAILY",
                        "day":1,
                        "hour":1,
                        "email":"gajendra.chavan@gmail.com",
                        "subject":"sss",
                        "comment":"sss",
                        "reportTypeEnum":"CUSTOM",
                        "downloadTypeEnum":"EXCEL",
                        "frequencyEnum":"DAILY"
                    }
                },{
                    attributes:{
                        "id":70,
                        "reportId":347,
                        "reportName":null,
                        "reportType":"CUSTOM",
                        "downloadType":"EXCEL",
                        "frequency":"DAILY",
                        "day":1,
                        "hour":1,
                        "email":"gajendra.chavan@pubmatic.com",
                        "subject":"_report",
                        "comment":"",
                        "reportTypeEnum":"CUSTOM",
                        "downloadTypeEnum":"EXCEL",
                        "frequencyEnum":"DAILY"
                    }
                }
            ];
        }
    });

}).call(this);