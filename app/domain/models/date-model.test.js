/*global describe, beforeEach, afterEach, it, expect, inject*/
(function() {
    "use strict";

    describe("domain.DateModel", function() {

        beforeEach(function() {
            module("pub-ui-analytics.domain");
        });

        beforeEach(function() {
            inject(function(DateModel) {
                this.DateModel = DateModel;
            });
        });

        afterEach(function() {

        });

        describe("getRangeList", function() {
            it("should return list of ranges", function() {
                var rangeList = this.DateModel.getRangeList();
                expect(rangeList).have.length(9);
                getMockedRangeList().forEach(function(range, index) {
                    expect(rangeList[index]).to.equal(range);
                });
            });
        });

        describe("getSelectRangeList", function() {
            it("should return selected list of ranges", function() {
                var selectedRangeList = this.DateModel.getSelectRangeList();
                expect(selectedRangeList).have.length(9);
                getMockedSelectedRangeList().forEach(function(range, index) {
                    expect(selectedRangeList[index].name).to.equal(range.name);
                    expect(selectedRangeList[index].ticked).to.equal(range.ticked);
                    expect(selectedRangeList[index].aggregation).to.equal(range.aggregation);
                    expect(selectedRangeList[index].group).to.equal(range.group);
                });
            });
        });

        describe("getBenchmarkSelectRangeList", function() {
            it("should return selected list of ranges", function() {
                var selectedRangeList = this.DateModel.getBenchmarkSelectRangeList();
                expect(selectedRangeList).have.length(8);
                getMockedBenchmarkSelectedRangeList().forEach(function(range, index) {
                    expect(selectedRangeList[index].name).to.equal(range.name);
                    expect(selectedRangeList[index].ticked).to.equal(range.ticked);
                    expect(selectedRangeList[index].aggregation).to.equal(range.aggregation);
                    expect(selectedRangeList[index].group).to.equal(range.group);
                });
            });
        });

        describe("startDate", function() {
            it("should return startDate", function() {
                var date = new Date(2015, 6 - 1, 5, 10, 0, 0);
                this.DateModel.setStartDate(date);
                expect(this.DateModel.getStartDate()).to.equal(date);
            });

            it("should return formated startDate", function() {
                var date = new Date(2015, 6 - 1, 5, 10, 0, 0);
                this.DateModel.setStartDate(date);
                expect(this.DateModel.getStartDate(true)).to.equal("2015-06-05T10:00");
            });
        });

        describe("compareStartDate", function() {
            it("should return compareStartDate", function() {
                var date = new Date(2015, 7 - 1, 5, 10, 0, 0);
                this.DateModel.setCompareStartDate(date);
                expect(this.DateModel.getCompareStartDate()).to.equal(date);
            });

            it("should return formated compareStartDate", function() {
                var date = new Date(2015, 7 - 1, 5, 10, 0, 0);
                this.DateModel.setCompareStartDate(date);
                expect(this.DateModel.getCompareStartDate(true)).to.equal("2015-07-05T10:00");
            });
        });

        describe("endDate", function() {
            it("should return endDate", function() {
                var date = new Date(2015, 8 - 1, 5, 10, 0, 0);
                this.DateModel.setEndDate(date);
                expect(this.DateModel.getEndDate()).to.equal(date);
            });

            it("should return formated endDate", function() {
                var date = new Date(2015, 8 - 1, 5, 10, 0, 0);
                this.DateModel.setEndDate(date);
                expect(this.DateModel.getEndDate(true)).to.equal("2015-08-05T10:00");
            });
        });

        describe("compareEndDate", function() {
            it("should return compareEndDate", function() {
                var date = new Date(2015, 9 - 1, 5, 10, 0, 0);
                this.DateModel.setCompareEndDate(date);
                expect(this.DateModel.getCompareEndDate()).to.equal(date);
            });

            it("should return formated compareEndDate", function() {
                var date = new Date(2015, 9 - 1, 5, 10, 0, 0);
                this.DateModel.setCompareEndDate(date);
                expect(this.DateModel.getCompareEndDate(true)).to.equal("2015-09-05T10:00");
            });
        });

        describe("compareFlag", function() {
            it("should be 'false' by default", function() {
                expect(this.DateModel.getCompareFlag()).to.equal(false);
            });

            it("should set new value", function() {
                this.DateModel.setCompareFlag(true);
                expect(this.DateModel.getCompareFlag()).to.equal(true);
            });
        });

        describe("selectedRangeId", function() {
            it("should be '2' by default", function() {
                expect(this.DateModel.getDefaultRangeId()).to.equal(2);
            });

            it("should set new value", function() {
                this.DateModel.setSelectedRangeId(7);
                expect(this.DateModel.getSelectedRangeId()).to.equal(7);
            });
        });

        describe("selectedRangeName", function() {
            it("should be '2' by default", function() {
                expect(this.DateModel.getSelectedRangeName()).to.equal("DATE.LAST_7_DAYS");
            });

            it("should set new value", function() {
                this.DateModel.setSelectedRangeName("DATE.YESTERDAY");
                expect(this.DateModel.getSelectedRangeName()).to.equal("DATE.YESTERDAY");
            });
        });

        describe("getDateById", function() {
            it("should return today range", function() {
                var startDate = new Date();
                startDate.setHours(0);
                startDate.setMinutes(0);
                startDate.setSeconds(0);

                var endDate = new Date();
                endDate.setHours(23);
                endDate.setMinutes(59);
                endDate.setSeconds(59);

                var range = this.DateModel.getDateById(0);
                expect(range.startDate.toString()).to.equal(startDate.toString());
                expect(range.endDate.toString()).to.equal(endDate.toString());
            });

            it("should return yesterday range", function() {
                var today = new Date();
                var startDate = new Date(today);
                startDate.setDate(today.getDate() - 1);
                startDate.setHours(0);
                startDate.setMinutes(0);
                startDate.setSeconds(0);

                var endDate = new Date(startDate);
                endDate.setHours(23);
                endDate.setMinutes(59);
                endDate.setSeconds(59);

                var range = this.DateModel.getDateById(1);
                expect(range.startDate.toString()).to.equal(startDate.toString());
                expect(range.endDate.toString()).to.equal(endDate.toString());
            });

            it("should return last 7 days range", function() {
                var today = new Date();
                var startDate = new Date();
                startDate.setDate(today.getDate() - 7);
                startDate.setHours(0);
                startDate.setMinutes(0);
                startDate.setSeconds(0);

                var endDate = new Date();
                endDate.setDate(today.getDate() - 1);
                endDate.setHours(23);
                endDate.setMinutes(59);
                endDate.setSeconds(59);

                var range = this.DateModel.getDateById(2);
                expect(range.startDate.toString()).to.equal(startDate.toString());
                expect(range.endDate.toString()).to.equal(endDate.toString());
            });

            it("should return last 30 days range", function() {
                var today = new Date();
                var startDate = new Date();
                startDate.setDate(today.getDate() - 30);
                startDate.setHours(0);
                startDate.setMinutes(0);
                startDate.setSeconds(0);

                var endDate = new Date();
                endDate.setDate(today.getDate() - 1);
                endDate.setHours(23);
                endDate.setMinutes(59);
                endDate.setSeconds(59);

                var range = this.DateModel.getDateById(3);
                expect(range.startDate.toString()).to.equal(startDate.toString());
                expect(range.endDate.toString()).to.equal(endDate.toString());
            });

            it("should return last week range", function() {
                var today = new Date();
                var lastWeek = getWeekNumber(today);
                lastWeek--;
                lastWeek = today.getFullYear() + "W" + lastWeek;

                var startDate = convertWeekToDate(lastWeek).startDate;
                var endDate = convertWeekToDate(lastWeek).endDate;

                var range = this.DateModel.getDateById(4);
                expect(range.startDate.toString()).to.equal(startDate.toString());
                expect(range.endDate.toString()).to.equal(endDate.toString());
            });

            it("should return last month range", function() {
                var today = new Date();
                var startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                startDate.setHours(0);
                startDate.setMinutes(0);
                startDate.setSeconds(0);

                var endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
                endDate.setHours(23);
                endDate.setMinutes(59);
                endDate.setSeconds(59);

                var range = this.DateModel.getDateById(5);
                expect(range.startDate.toString()).to.equal(startDate.toString());
                expect(range.endDate.toString()).to.equal(endDate.toString());
            });

            it("should return this month range", function() {
                var endDate = new Date();
                var startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
                startDate.setHours(0);
                startDate.setMinutes(0);
                startDate.setSeconds(0);

                var range = this.DateModel.getDateById(6);
                expect(range.startDate.toString()).to.equal(startDate.toString());
                expect(range.endDate.toString()).to.equal(endDate.toString());
            });

            it("should return last quarter range", function() {
                var today = new Date();
                var startDate = convertQuarterToDate(today.getFullYear() + "Q" + getQuarterNumber(today)).startDate;

                startDate = new Date(startDate.getFullYear(), startDate.getMonth() - 3, 1);
                startDate.setHours(0);
                startDate.setMinutes(0);
                startDate.setSeconds(0);

                var endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 3, 0);
                endDate.setHours(23);
                endDate.setMinutes(59);
                endDate.setSeconds(59);

                var range = this.DateModel.getDateById(7);
                expect(range.startDate.toString()).to.equal(startDate.toString());
                expect(range.endDate.toString()).to.equal(endDate.toString());
            });

            describe("custom range", function() {
                it("should be default range if aggregation is 'week'", function() {
                    // set default range
                    var startDate = new Date(2015, 5, 1);
                    var endDate = new Date(2015, 5, 25);
                    this.DateModel.setStartDate(startDate);
                    this.DateModel.setEndDate(endDate);
                    this.DateModel.setAggregation("week");
                    // set week aggregation
                    var range = this.DateModel.getDateById(8);
                    expect(range.startDate.toString()).to.equal(startDate.toString());
                    expect(range.endDate.toString()).to.equal(endDate.toString());
                });

                it("should be default range if aggregation is 'month'", function() {
                    // set default range
                    var startDate = new Date(2015, 5, 1);
                    var endDate = new Date(2015, 5, 25);
                    this.DateModel.setStartDate(startDate);
                    this.DateModel.setEndDate(endDate);
                    // set month aggregation
                    this.DateModel.setAggregation("month");

                    var range = this.DateModel.getDateById(8);
                    expect(range.startDate.toString()).to.equal(startDate.toString());
                    expect(range.endDate.toString()).to.equal(endDate.toString());
                });

                it("should be default range if no options provided and agregation is not 'week' or 'month'", function() {
                    // set default range
                    var startDate = new Date(2015, 5, 1);
                    var endDate = new Date(2015, 5, 25);
                    this.DateModel.setStartDate(startDate);
                    this.DateModel.setEndDate(endDate);
                    // set month aggregation
                    this.DateModel.setAggregation("date");

                    var range = this.DateModel.getDateById(8);
                    expect(range.startDate.toString()).to.equal(startDate.toString());
                    expect(range.endDate.toString()).to.equal(endDate.toString());
                });

                it("should be default range if options were provided", function() {
                    // set month aggregation
                    this.DateModel.setAggregation("date");

                    var options = ["2015-05-01T10:00", "2015-5-25T10:00"];
                    var range = this.DateModel.getDateById(8, options);
                    expect(range.startDate.getFullYear()).to.equal(2015);
                    expect(range.startDate.getMonth() + 1).to.equal(5);
                    expect(range.startDate.getDate()).to.equal(1);

                    expect(range.endDate.getFullYear()).to.equal(2015);
                    expect(range.endDate.getMonth() + 1).to.equal(5);
                    expect(range.endDate.getDate()).to.equal(25);
                });

            });
        });

        describe("originalAggregation", function() {
            it("should be 'date' by default", function() {
                expect(this.DateModel.getOriginalAggregation()).to.equal("date");
            });

            it("should set new value", function() {
                this.DateModel.setOriginalAggregation("week");
                expect(this.DateModel.getOriginalAggregation()).to.equal("week");
            });
        });

        function getMockedRangeList() {
            return [
                "DATE.TODAY",
                "DATE.YESTERDAY",
                "DATE.LAST_7_DAYS",
                "DATE.LAST_30_DAYS",
                "DATE.LAST_WEEK",
                "DATE.LAST_MONTH",
                "DATE.THIS_MONTH",
                "DATE.LAST_QUARTER",
                "DATE.CUSTOM_RANGE"
            ];
        }

        function getMockedSelectedRangeList() {
            return [{
                name: "DATE.TODAY",
                ticked: false,
                index: 0,
                aggregation: "hour",
                group: "hour"
            }, {
                name: "DATE.YESTERDAY",
                ticked: false,
                index: 1,
                aggregation: "hour",
                group: "hour"
            }, {
                name: "DATE.LAST_7_DAYS",
                ticked: false,
                index: 2,
                aggregation: "date",
                group: "date"
            }, {
                name: "DATE.LAST_30_DAYS",
                ticked: true,
                index: 3,
                aggregation: "date",
                group: "date"
            }, {
                name: "DATE.LAST_WEEK",
                ticked: false,
                index: 4,
                aggregation: "week",
                group: "date"
            }, {
                name: "DATE.LAST_MONTH",
                ticked: false,
                index: 5,
                aggregation: "month",
                group: "date"
            }, {
                name: "DATE.THIS_MONTH",
                ticked: false,
                index: 6,
                aggregation: "date",
                group: "date"
            }, {
                name: "DATE.LAST_QUARTER",
                ticked: false,
                index: 7,
                aggregation: "quarter",
                group: "date"
            }, {
                name: "DATE.CUSTOM_RANGE",
                ticked: false,
                index: 8
            }];
        }

        function getMockedBenchmarkSelectedRangeList() {
            return [{
                name: "DATE.TODAY",
                ticked: false,
                index: 0,
                aggregation: "hour",
                group: "hour"
            }, {
                name: "DATE.YESTERDAY",
                ticked: false,
                index: 1,
                aggregation: "hour",
                group: "hour"
            }, {
                name: "DATE.LAST_7_DAYS",
                ticked: false,
                index: 2,
                aggregation: "date",
                group: "date"
            }, {
                name: "DATE.LAST_30_DAYS",
                ticked: true,
                index: 3,
                aggregation: "date",
                group: "date"
            }, {
                name: "DATE.LAST_WEEK",
                ticked: false,
                index: 4,
                aggregation: "week",
                group: "month"
            }, {
                name: "DATE.LAST_MONTH",
                ticked: false,
                index: 5,
                aggregation: "date",
                group: "month"
            }, {
                name: "DATE.THIS_MONTH",
                ticked: false,
                index: 6,
                aggregation: "month",
                group: "date"
            }, {
                name: "DATE.CUSTOM_RANGE",
                ticked: false,
                index: 7
            }];
        }

        function convertWeekToDate(w) {
            var tempArray = w.split("W");
            var y = tempArray[0];
            w = tempArray[1];

            var d = (1 + (w - 1) * 7);
            var today = new Date(y, 0, d);
            var first = today.getDate() - today.getDay() + 1;

            var firstDay = new Date(today.setDate(first));
            firstDay.setHours(0);
            firstDay.setMinutes(0);
            firstDay.setSeconds(0);

            var last = firstDay.getDate() + 6;
            var lastDay = new Date(today.setDate(last));
            lastDay.setHours(23);
            lastDay.setMinutes(59);
            lastDay.setSeconds(59);


            return {
                startDate: firstDay,
                endDate: lastDay
            };
        }

        function getWeekNumber(d) {
            d = new Date(+d);
            d.setHours(0, 0, 0);
            d.setDate(d.getDate() + 4 - (d.getDay() || 7));

            var yearStart = new Date(d.getFullYear(), 0, 1);

            var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
            weekNo = (weekNo < 10) ? "0" + weekNo.toString() : weekNo.toString();
            return weekNo;
        }

        function convertMonthToDate(m) {
            var year = m.split("-")[0];
            var month = m.split("-")[1];

            var firstDay = new Date(year, month - 1, 1, 0, 0, 0);

            var lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);
            lastDay.setHours(23);
            lastDay.setMinutes(59);
            lastDay.setSeconds(59);

            return {
                startDate: firstDay,
                endDate: lastDay
            };
        }

        function convertQuarterToDate(q) {
            var y = q.split("Q")[0];
            q = q.split("Q")[1];
            var m = q * 3 - 2;
            m = (m < 10) ? "0" + m.toString() : m.toString();
            var firstDay = convertMonthToDate(y + "-" + m).startDate;
            m = q * 3;
            m = (m < 10) ? "0" + m.toString() : m.toString();
            var lastDay = convertMonthToDate(y + "-" + m).endDate;

            return {
                startDate: firstDay,
                endDate: lastDay
            };
        }

        function getQuarterNumber(d) {
            var q = [1,2,3,4];
            return q[Math.floor(d.getMonth() / 3)];
        }

    });

}).call(this);
