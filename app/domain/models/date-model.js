/*global angular*/
(function (angular) {
    "use strict";

    var app;

    app = angular.module("pub-ui-analytics.domain");

    app.factory("DateModel",["$filter", function ($filter) {

        var DEFAULT_RANGE_ID = 2,
            DEFAULT_RANGE_NAME = "DATE.LAST_7_DAYS",
            DEFAULT_AGGREGATION = "date";

        return {

            attributes: {

                startDate: new Date((new Date()).getTime() - 7*24*60*60*1000), // today - 7 days
                endDate: new Date(), // today
                selectedRangeId: DEFAULT_RANGE_ID,
                selectedRangeName: DEFAULT_RANGE_NAME,
                noEarlierThanInDays: 120,
                //TODO: change this when data became available (in July, 2015)
                noEarlierThanInWeek: new Date(2014, 6, 15),
                 //TODO: change this when data became available (in July, 2016)
                noEarlierThanInMonth: new Date(2014, 6, 15),
                 //TODO: change this when data became available (in July, 2017)
                noEarlierThanInQuarter: new Date(2014, 6, 15),
                aggregation: DEFAULT_AGGREGATION,
                originalAggregation: DEFAULT_AGGREGATION,
                compareFlag: false,
                compareStartDate: new Date((new Date()).getTime() - 7*24*60*60*1000), // today - 7 days
                compareEndDate: new Date(),
                compareValue: "compareAbsoluteValue",

                rangeList: [
                    "DATE.TODAY",
                    "DATE.YESTERDAY",
                    "DATE.LAST_7_DAYS",
                    "DATE.LAST_30_DAYS",
                    "DATE.LAST_WEEK",
                    "DATE.LAST_MONTH",
                    "DATE.THIS_MONTH",
                    "DATE.LAST_QUARTER",
                    "DATE.CUSTOM_RANGE"
                ],

                selectRangeList: [
                    {  name: "DATE.TODAY",           ticked: false , index:0, aggregation:"hour", group: "hour"},
                    {  name: "DATE.YESTERDAY",       ticked: false , index:1, aggregation:"hour", group: "hour"},
                    {  name: "DATE.LAST_7_DAYS",     ticked: false , index:2, aggregation:"date", group: "date"},
                    {  name: "DATE.LAST_30_DAYS",    ticked: true  , index:3, aggregation:"date", group: "date"},
                    {  name: "DATE.LAST_WEEK",       ticked: false , index:4, aggregation:"week", group: "date"},
                    {  name: "DATE.LAST_MONTH",      ticked: false , index:5, aggregation:"month", group: "date"},
                    {  name: "DATE.THIS_MONTH",      ticked: false , index:6, aggregation:"date", group: "date"},
                    {  name: "DATE.LAST_QUARTER",    ticked: false , index:7, aggregation:"quarter", group: "date"},
                    {  name: "DATE.CUSTOM_RANGE",    ticked: false , index:8  }
                ],

                benchmarkSelectRangeList: [
                    {  name: "DATE.TODAY",           ticked: false , index:0, aggregation:"hour", group: "hour"},
                    {  name: "DATE.YESTERDAY",       ticked: false , index:1, aggregation:"hour", group: "hour"},
                    {  name: "DATE.LAST_7_DAYS",     ticked: false , index:2, aggregation:"date", group: "date"},
                    {  name: "DATE.LAST_30_DAYS",    ticked: true  , index:3, aggregation:"date", group: "date"},
                    {  name: "DATE.LAST_WEEK",       ticked: false , index:4, aggregation:"week", group: "month"},
                    {  name: "DATE.LAST_MONTH",      ticked: false , index:5, aggregation:"date", group: "month"},
                    {  name: "DATE.THIS_MONTH",      ticked: false , index:6, aggregation:"month", group: "date"},
                    {  name: "DATE.CUSTOM_RANGE",    ticked: false , index:7  }
                ]
            },

            getRangeList: function () {
                return this.attributes.rangeList;
            },

            getSelectRangeList: function () {
                return this.attributes.selectRangeList;
            },

            getBenchmarkSelectRangeList: function () {
                return this.attributes.benchmarkSelectRangeList;
            },

            getStartDate: function (formatted) {
                if (formatted) {
                    return $filter("date")(this.attributes.startDate, "yyyy-MM-ddTHH:mm");
                }
                return this.attributes.startDate;
            },

            setStartDate: function (value) {
                this.attributes.startDate = value;
            },

            getEndDate: function (formatted) {
                if (formatted) {
                    return $filter("date")(this.attributes.endDate, "yyyy-MM-ddTHH:mm");
                }
                return this.attributes.endDate;
            },

            setEndDate: function (value) {
                this.attributes.endDate = value;
            },

            getCompareStartDate: function (formatted) {
                if (formatted) {
                    return $filter("date")(this.attributes.compareStartDate, "yyyy-MM-ddTHH:mm");
                }
                return this.attributes.compareStartDate;
            },

            setCompareStartDate: function (value) {
                this.attributes.compareStartDate = value;
            },

            getCompareEndDate: function (formatted) {
                if (formatted) {
                    return $filter("date")(this.attributes.compareEndDate, "yyyy-MM-ddTHH:mm");
                }
                return this.attributes.compareEndDate;
            },

            setCompareEndDate: function (value) {
                this.attributes.compareEndDate = value;
            },

            getCompareFlag: function () {
                return this.attributes.compareFlag;
            },

            setCompareFlag: function (value) {
                this.attributes.compareFlag = value;
            },


            getSelectedRangeId: function () {
                return this.attributes.selectedRangeId;
            },

            getDefaultRangeId: function () {
                return DEFAULT_RANGE_ID;
            },

            setSelectedRangeId: function (value) {
                this.attributes.selectedRangeId = value;
            },

            getSelectedRangeName: function () {
                return this.attributes.selectedRangeName;
            },

            setSelectedRangeName: function (value) {
                this.attributes.selectedRangeName = value;
            },

            getDateById: function (id, options) {
                options = options || {};

                var dateMap = {
                    0: this.getToday.bind(this),
                    1: this.getYesterday.bind(this),
                    2: this.getLast7Days.bind(this),
                    3: this.getLast30Days.bind(this),
                    4: this.getLastWeek.bind(this),
                    5: this.getLastMonth.bind(this),
                    6: this.getThisMonth.bind(this),
                    7: this.getLastQuarter.bind(this),
                    8: this.getCustomRange.bind(this)
                };

                return dateMap[id] ? dateMap[id](options) : this.getLast30Days();
            },

            getToday: function () {
                var startDate = new Date();
                startDate.setHours(0);
                startDate.setMinutes(0);
                startDate.setSeconds(0);

                var endDate = new Date();
                endDate.setHours(23);
                endDate.setMinutes(59);
                endDate.setSeconds(59);

                return {
                    startDate: startDate,
                    endDate: endDate
                };
            },

            getYesterday: function () {
                var today = new Date();
                var yesterdayStart = new Date(today);
                yesterdayStart.setDate(today.getDate() - 1);
                yesterdayStart.setHours(0);
                yesterdayStart.setMinutes(0);
                yesterdayStart.setSeconds(0);

                var yesterdayEnd = new Date(yesterdayStart);
                yesterdayEnd.setHours(23);
                yesterdayEnd.setMinutes(59);
                yesterdayEnd.setSeconds(59);

                return {
                    startDate: yesterdayStart,
                    endDate: yesterdayEnd
                };
            },

            getLast7Days: function () {
                var today = new Date();
                var yesterDay= new Date();
                yesterDay.setDate(today.getDate() -1);
                var start = new Date();
                start.setDate(today.getDate() -7 );
                yesterDay.setHours(23);
                yesterDay.setMinutes(59);
                yesterDay.setSeconds(59);
                start.setHours(0);
                start.setMinutes(0);
                start.setSeconds(0);
                

                return {
                    startDate: start,
                    endDate: yesterDay
                };
            },

            getLast30Days: function () {
                var today = new Date();
                var yesterDay= new Date();
                yesterDay.setDate(today.getDate() -1);
                var start = new Date();
                start.setDate(today.getDate()-30);
                yesterDay.setHours(23);
                yesterDay.setMinutes(59);
                yesterDay.setSeconds(59);
                start.setHours(0);
                start.setMinutes(0);
                start.setSeconds(0);

                return {
                    startDate: start,
                    endDate: yesterDay
                };
            },

            getLastWeek: function () {
                var today;
                today = new Date();
                var lastWeek = this.getWeekNumber(today);
                lastWeek--;
                lastWeek = today.getFullYear() + "W"+lastWeek;

                return this.convertWeekToDate(lastWeek);
            },

            getLastMonth: function () {
                var today, firstDay;

                today = new Date();
                firstDay = new Date(today.getFullYear(), today.getMonth() - 3, 1);
                firstDay.setHours(0);
                firstDay.setMinutes(0);
                firstDay.setSeconds(0);

                var lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth()+1, 0);
                lastDay.setHours(23);
                lastDay.setMinutes(59);
                lastDay.setSeconds(59);
                return {
                    startDate: firstDay,
                    endDate: lastDay
                };
            },

            getLastQuarter: function () {
                var today, firstDay;
                today = new Date();
                firstDay = this.convertQuarterToDate(today.getFullYear() +"Q"+ this.getQuarterNumber(today) ).startDate;
                
                firstDay = new Date(firstDay.getFullYear(), firstDay.getMonth() - 3, 1);
                firstDay.setHours(0);
                firstDay.setMinutes(0);
                firstDay.setSeconds(0);

                var lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth()+3, 0);
                lastDay.setHours(23);
                lastDay.setMinutes(59);
                lastDay.setSeconds(59);

                return {
                    startDate: firstDay,
                    endDate: lastDay
                };
            },


            getThisMonth: function () {
                var today, startDate;

                today = new Date();
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                startDate.setHours(0);
                startDate.setMinutes(0);
                startDate.setSeconds(0);

                return {
                    startDate: startDate,
                    endDate: today
                };
            },


            getCustomRange: function (options) {
                if ((this.getAggregation() === "week") || (this.getAggregation() === "month")){
                    return {
                        startDate:  this.getStartDate(),
                        endDate:  this.getEndDate()
                    };
                }

                var tempStart, tempEnd;
                tempStart = options[0] ? this.convertFormattedDateToObject(options[0]) : undefined;
                tempEnd = options[1] ? this.convertFormattedDateToObject(options[1]) : undefined;
                return {
                    startDate: tempStart || new Date(this.getStartDate()),
                    endDate: tempEnd || new Date(this.getEndDate())
                };
            },

            getCompareCustomRange: function (options) {
                var tempStart, tempEnd;
                tempStart = options[0] ? this.convertFormattedDateToObject(options[0]) : undefined;
                tempEnd = options[1] ? this.convertFormattedDateToObject(options[1]) : undefined;

                return {
                    startDate: tempStart || new Date(this.getStartDate()),
                    endDate: tempEnd || new Date(this.getEndDate())
                };
            },

            convertFormattedDateToObject: function (formattedDate){
                var tempArray, dateArray,timeArray, year,month,date,hour,minute;
                tempArray = formattedDate.split("T");
                dateArray = tempArray[0].split("-");
                timeArray = tempArray[1].split(":");

                year = dateArray[0];
                month = dateArray[1]-1;
                date = dateArray[2];
                hour = timeArray[0];
                minute = timeArray[1];

                return new Date(year,month,date,hour,minute);
            },

            getNoEarlierThan: function (aggregation) {
                var result = new Date();

                switch(aggregation) {
                    case "week":
                        result = this.attributes.noEarlierThanInWeek;
                        break;
                    case "month":
                        result = this.attributes.noEarlierThanInMonth;
                        break;
                    case "quarter":
                        result = this.attributes.noEarlierThanInQuarter;
                        break;
                    default:
                        result.setDate(result.getDate() - this.attributes.noEarlierThanInDays);
                }
                return result;
            },

            getAggregation: function (){
                return this.attributes.aggregation;
            },

            setAggregation: function (value){
                this.attributes.aggregation = value;
            },

            getOriginalAggregation: function (){
                return this.attributes.originalAggregation;
            },

            setOriginalAggregation: function (value){
                this.attributes.originalAggregation = value;
            },

            getCompareValue: function () {
                return this.attributes.compareValue;
            },

            getCompareValueObject: function (totalDimension) {
                var compareValueObject = {};
                if (this.getCompareFlag() && this.attributes.compareValue === "compareAbsoluteChange"){
                    compareValueObject.index = (totalDimension === 2)? 5:4;
                    compareValueObject.label = " ("+$filter("translate")("DATE.COMPARE_ABS_CHANGE")+")";
                }
                else if (this.getCompareFlag() && this.attributes.compareValue === "comparePercentage"){
                    compareValueObject.index = (totalDimension === 2)? 4:3;
                    compareValueObject.label = " ("+$filter("translate")("DATE.COMPARE_PERCENTAGE_CHANGE")+")";
                }
                else {
                    compareValueObject.index = (totalDimension === 2)? 2:1;
                    compareValueObject.label = "";
                }

                return compareValueObject;
            },


            setCompareValue: function (value) {
                this.attributes.compareValue = value;
            },

            convertDateToHour: function(d) {
                var onlyDate = $filter("date")(d, "yyyy-MM-dd");
                var hour = d.getHours();
                hour = (hour < 10) ? "0" + hour.toString() : hour.toString();
                return onlyDate+ "T" + hour;
            },

            convertDateToWeek: function(d) {
                d = new Date(+d);
                d.setHours(0,0,0);
                d.setDate(d.getDate() + 4 - (d.getDay()||7));
                var yearStart = new Date(d.getFullYear(),0,1);
                var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
                weekNo = (weekNo < 10) ? "0" + weekNo.toString() : weekNo.toString();
                return d.getFullYear()+ "W" + weekNo;
            },

            convertDateToMonth: function(d) {
                var month = d.getMonth() + 1;
                month = (month < 10) ? "0" + month.toString() : month.toString();
                return d.getFullYear()+ "-" + month;
            },

            convertDateToMonthString: function(d) {
                var format = "MMMM";
                return $filter("date")(d, format);
            },


            convertDateToQuarter: function(d) {
                var quarter = this.getQuarterNumber(d);
                quarter = (quarter < 10) ? "0" + quarter.toString() : quarter.toString();
                return d.getFullYear()+ "Q" + quarter;
            },

            getWeekNumber: function(d) {
                d = new Date(+d);
                d.setHours(0,0,0);
                d.setDate(d.getDate() + 4 - (d.getDay()||7));

                var yearStart = new Date(d.getFullYear(),0,1);

                var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
                weekNo = (weekNo < 10) ? "0" + weekNo.toString() : weekNo.toString();
                return weekNo;
            },

            getQuarterNumber: function(d) {
                var q = [1,2,3,4];
                return q[Math.floor(d.getMonth() / 3)];
            },

            convertHourToDate: function(h){
                var tempDateArray = h.split("T");
                var d = new Date(tempDateArray[0]);
                d.setHours(tempDateArray[1]);
                return d;
            },

            convertWeekToDate: function(w) {
                var tempArray = w.split("W");
                var y = tempArray[0];
                w = tempArray[1];

                var d = (1 + (w - 1) * 7);
                var today= new Date(y, 0, d);
                var first = today.getDate() - today.getDay()+1;
                     
                var  firstDay = new Date(today.setDate(first));
                firstDay.setHours(0);
                firstDay.setMinutes(0);
                firstDay.setSeconds(0);

                var last = firstDay.getDate() + 6;
                var  lastDay = new Date(today.setDate(last));
                lastDay.setHours(23);
                lastDay.setMinutes(59);
                lastDay.setSeconds(59);


                return {
                    startDate: firstDay,
                    endDate: lastDay
                };
            },

            convertMonthToDate: function(m) {
                var year = m.split("-")[0];
                var month = m.split("-")[1];

                var firstDay = new Date(year,month-1,1,0,0,0);

                var lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);
                lastDay.setHours(23);
                lastDay.setMinutes(59);
                lastDay.setSeconds(59);


                return {
                    startDate: firstDay,
                    endDate: lastDay
                };
            },

            convertQuarterToDate: function(q) {
                var y = q.split("Q")[0];
                q = q.split("Q")[1];
                var m = q * 3-2;
                m = (m < 10) ? "0" + m.toString() : m.toString();
                var firstDay = this.convertMonthToDate(y+"-"+m).startDate;
                m = q * 3;
                m = (m < 10) ? "0" + m.toString() : m.toString();
                var lastDay = this.convertMonthToDate(y+"-"+m).endDate;

                return {
                    startDate: firstDay,
                    endDate: lastDay
                };
            },
            

            setEverythingById: function(id) {
                this.setSelectedRangeId(id);
                this.setSelectedRangeName(this.attributes.selectRangeList[id].name);
                this.setAggregation(this.attributes.selectRangeList[id].aggregation);
            },

            universalConvert: function(id, fromType, toType){
                var dateObj;
                if (fromType === "week" && toType === "date" ){
                    return this.convertWeekToDate(id);
                }
                else if (fromType === "month" && toType === "week" ){
                    dateObj =this.convertMonthToDate(id);
                    return {startDate: this.convertDateToWeek(dateObj.startDate), endDate: this.convertDateToWeek(dateObj.endDate)};
                }
                else if (fromType === "month" && toType === "date" ){
                    return this.convertMonthToDate(id);
                }
                else if (fromType === "quarter" && toType === "month" ){
                    dateObj =this.convertQuarterToDate(id);
                    return {startDate: this.convertDateToMonth(dateObj.startDate), endDate: this.convertDateToMonth(dateObj.endDate)};
                }
                else if (fromType === "quarter" && toType === "week" ){
                    dateObj =this.convertQuarterToDate(id);
                    return {startDate: this.convertDateToWeek(dateObj.startDate), endDate: this.convertDateToWeek(dateObj.endDate)};
                }
                else if (fromType === "quarter" && toType === "date" ){
                    return this.convertQuarterToDate(id);
                }
            },

            tweakDate: function(d){
                if (this.getAggregation() === "week"){
                    return this.convertWeekToDate(this.convertDateToWeek(d));
                }
                else if (this.getAggregation() === "month"){
                    return this.convertMonthToDate(this.convertDateToMonth(d));
                }
                else if (this.getAggregation() === "quarter"){
                    return this.convertQuarterToDate(this.convertDateToQuarter(d));
                }
                else  if (this.getAggregation() === "date"){
                    var startDate = new Date(d);
                    var endDate = new Date(d);

                    startDate.setHours(0);
                    startDate.setMinutes(0);
                    startDate.setSeconds(0);

                    endDate.setHours(23);
                    endDate.setMinutes(59);
                    endDate.setSeconds(59);
                    return {
                        startDate: startDate,
                        endDate: endDate
                    };
                }
                else {
                    return {
                        startDate: d,
                        endDate: d
                    };
                }
            }
        };
    }]);
}).call(this, angular);


