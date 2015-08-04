/*global angular*/
(function (angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");
    //Use for calculate difference of days between daylight saving time and normal time. 
    var MIDDLE_OF_DAY_HOUR = 12;
    app.controller("PubDateDialogCtrl", [
        "$scope",
        "$rootScope",
        "pubAnalyticService",
        "DateModel",
        "$filter",

        function ($scope, $rootScope, pubAnalyticService,DateModel, $filter) {
            $scope.selectDateOption = function(id, options, init) {
                $scope.dateError = false;
                $scope.compareChanged = false;
                var date = DateModel.getDateById(id, options);

                $scope.selectedOption = id;
                $scope.startDate = date.startDate;
                $scope.endDate = date.endDate;
                $scope.validateDate($scope.startDate, $scope.endDate);

                if (id < 8 && !init){
                    DateModel.setAggregation(DateModel.getSelectRangeList()[id].aggregation);
                    if (id === 1){
                        var timeUnitDimension = pubAnalyticService.getHistoricDimensions().getSelectedDimensions().filter(function (el) {
                            return el.getGroupId() === "timeUnits";
                        });
                        if (timeUnitDimension[0] && timeUnitDimension[0].getId() === "hour"){
                            DateModel.setAggregation("hour");
                        }
                        else {
                            DateModel.setAggregation("date");
                        }
                    }

                    $scope.confirm({"startDate":$scope.startDate, "endDate":$scope.endDate,"optionIndex":id,"optionName":$scope.dateRangeList[id]});
                }
                else {
                    $rootScope.pickerStartLimit = $scope.startDate;
                    $rootScope.pickerEndLimit = $scope.endDate;

                    $scope.startDate = new Date($scope.startDate.getTime()+1);
                    $scope.endDate = new Date($scope.endDate.getTime()+1);
                }
            };


            $scope.compareSwitch = function(){
                if ($scope.dateError === false){
                    $scope.currentCompareView = "compare";
                    $scope.comparePickerClick();
                }
                else {
                    $scope.currentCompareView = "report";
                }
            };

            $scope.toggleCompareView = function(value){
                $scope.currentCompareView = value;
                if (value === "compare"){
                    $scope.comparePickerClick();
                }
                else {
                    $scope.validateDate($scope.startDate, $scope.endDate);
                }
            };

            $scope.pickerClick = function(){

                if ($scope.datepickerAggregation === "week"){
                    $rootScope.pickerStartLimit  = new Date(DateModel.tweakDate($scope.startDate).startDate);
                    $rootScope.pickerEndLimit = new Date(DateModel.tweakDate($scope.endDate).endDate);
                    $scope.diffDays = $scope.calculateDiffDays($scope.pickerStartLimit, $scope.pickerEndLimit);
                }
                else {
                    $rootScope.pickerStartLimit = $scope.startDate;
                    $rootScope.pickerEndLimit = $scope.endDate;
                    $scope.diffDays = $scope.calculateDiffDays($scope.startDate, $scope.endDate);
                }

                $scope.diffMonths = $scope.endDate.getMonth() - $scope.startDate.getMonth();
                $scope.startDate = new Date($scope.startDate.getTime()+1);
                $scope.endDate = new Date($scope.endDate.getTime()+1);

                if ($scope.compare){
                    $scope.compareEndDate = new Date($scope.compareStartDate);
                    $scope.compareEndDate.setDate($scope.compareStartDate.getDate()+$scope.diffDays-1);
                    if ($scope.datepickerAggregation === "month"){
                        $scope.compareEndDate.setMonth($scope.compareStartDate.getMonth()+$scope.diffMonths);
                    }
                }
                
                $scope.validateDate($scope.startDate, $scope.endDate);
            };

            $scope.comparePickerClick = function(){
                if (!$scope.compareStartDate){
                    $scope.compareStartDate = new Date($scope.startDate);
                }

                if ($scope.datepickerAggregation === "week"){
                    $scope.compareStartDate  = DateModel.tweakDate($scope.compareStartDate).startDate;
                }

                $scope.compareStartDate = new Date($scope.compareStartDate.getTime()+1);

                $rootScope.pickerStartLimit = $scope.compareStartDate;
                $scope.compareEndDate = new Date($scope.compareStartDate);

                if ($scope.datepickerAggregation === "month"){
                    $scope.compareEndDate.setMonth($scope.compareStartDate.getMonth()+$scope.diffMonths);
                }
                else {
                    $scope.compareEndDate.setDate($scope.compareStartDate.getDate()+$scope.diffDays-1);
                }

                $rootScope.pickerEndLimit = new Date($scope.compareEndDate.getTime()+1);
                $scope.compareEndDate = new Date($scope.compareEndDate.getTime()+1);
                $scope.validateDate($scope.compareStartDate, $scope.compareEndDate);
            };

            $scope.weekFormat = function(d){
                return DateModel.getWeekNumber(d);
            };

            $scope.monthFormat = function(d){
                return DateModel.convertDateToMonthString(d);
            };

            $scope.quarterFormat = function(d){
                return DateModel.getQuarterNumber(d);
            };

            $scope.yearFormat = function(d){
                return d.getFullYear();
            };

            $scope.validateDate = function(start, end){
                var today = new Date();
                today.setHours(23);
                today.setMinutes(59);
                if ($scope.datepickerAggregation === "date"){
                    if (end < start){
                        $scope.dateError=true;
                        $scope.errorMessage = $filter("translate")("ERROR.INVALID_END_DATE");
                    }
                    else if (start < DateModel.getNoEarlierThan()) {
                        $scope.dateError=true;
                        $scope.errorMessage = $filter("translate")("ERROR.INVALID_DATE_TOOEARLY") + " " + $filter("date")(DateModel.getNoEarlierThan(), "MMM d, y")+".";
                    }
                    else if (end > today){
                        $scope.dateError=true;
                        $scope.errorMessage = $filter("translate")("ERROR.INVALID_DATE_FUTURE");
                    }
                    else if (($scope.compare === true  && $scope.currentCompareView === "compare") && (end > $scope.endDate) ){
                        $scope.dateError=true;
                        $scope.errorMessage = $filter("translate")("ERROR.INVALID_DATE_COMPARE_FUTURE");
                    }
                    else if (($scope.compare === true  && $scope.currentCompareView === "report") && (end < $scope.compareEndDate) ){
                        $scope.dateError=true;
                        $scope.errorMessage = $filter("translate")("ERROR.INVALID_DATE_COMPARE_FUTURE");
                    }
                    else{
                        $scope.dateError=false;
                    }
                }

                else if ($scope.datepickerAggregation === "hour"){
                    validateHour(start,end);
                }

                else if ($scope.datepickerAggregation === "week"){
                    validateWeek(start,end);
                }

                else {
                    validateMonth(start,end);
                }
            };

            $scope.setDatepickerAggregation = function (aggregation){
                $scope.datepickerAggregation = aggregation;
                DateModel.setAggregation(aggregation);
                $scope.pickerClick();
            };
            
            $scope.getOptionGroup = function (){
                if ($scope.datepickerAggregation === "hour"){
                    return "hour";
                }
                else {
                    return "date";
                }
            };

            $scope.calculateDiffDays = function(start, end){
                var tempMiddleStartDay = new Date(start);
                var tempMiddleEndDay = new Date(end);
                tempMiddleStartDay.setHours(MIDDLE_OF_DAY_HOUR);
                tempMiddleEndDay.setHours(MIDDLE_OF_DAY_HOUR);
                var timeDiff = Math.abs(tempMiddleStartDay.getTime() - tempMiddleEndDay.getTime());

                return Math.ceil(timeDiff / (1000 * 3600 * 24));
            };



            $scope.hourpickerInit = function(){
                $scope.periodArray = [
                    { id: "AM", name: "AM" },
                    { id: "PM", name: "PM" }
                ];

                $scope.hourDayArray = [
                    { id: $filter("date")(DateModel.getYesterday().startDate, "yyyy/MM/dd"), name: "Yesterday" },
                    { id: $filter("date")(DateModel.getToday().startDate, "yyyy/MM/dd"), name: "Today" }
                ];

                $scope.hourArray = [];
                for(var i=0; i<12; i++){
                    $scope.hourArray.push({ id: i+1, name: i+1 });
                }
                $scope.hourArray.sort(function(a, b){return a.id - b.id;});

                
                var today = new Date();

                var tempStartPeriod, tempStartHour, tempStartDisplayDate;
                var tempEndPeriod, tempEndHour, tempEndDisplayDate;


                if ($scope.datepickerAggregation === "hour" && DateModel.getStartDate()){
                    tempStartPeriod =  (DateModel.getStartDate().getHours() > 11 )? "PM": "AM";
                    tempStartHour = (DateModel.getStartDate().getHours() > 12 )? DateModel.getStartDate().getHours()-12: DateModel.getStartDate().getHours();
                    if (tempStartHour === 0){
                        tempStartHour = 12;
                    }
                    tempStartDisplayDate = $filter("date")(DateModel.getStartDate(), "yyyy/MM/dd");

                    tempEndPeriod =  (DateModel.getEndDate().getHours() > 11 )? "PM": "AM";
                    tempEndHour = (DateModel.getEndDate().getHours() > 12 )? DateModel.getEndDate().getHours()-12: DateModel.getEndDate().getHours();
                    if (tempEndHour === 0){
                        tempEndHour = 12;
                    }
                    tempEndDisplayDate = $filter("date")(DateModel.getEndDate(), "yyyy/MM/dd");
                }
                else {
                    tempStartPeriod = "PM";
                    tempStartHour = 3;
                    tempStartDisplayDate = $scope.hourDayArray[0].id;

                    tempEndPeriod = $filter("date")(today, "a");
                    tempEndHour = $scope.hourArray[parseInt($filter("date")(today, "h"))-1].id;
                    tempEndDisplayDate =$scope.hourDayArray[1].id;
                }
                
                $scope.hourObject= {
                    startHour : tempStartHour,
                    startPeriod : tempStartPeriod,
                    displayStartday : tempStartDisplayDate,

                    endHour : tempEndHour,
                    endPeriod: tempEndPeriod,
                    displayEndday: tempEndDisplayDate
                };

                $scope.hourCompareObject= {
                    startHour : $scope.hourArray[2].id,
                    startPeriod : "PM",
                    displayStartday : $scope.hourDayArray[0].id,

                    endHour : $scope.hourArray[parseInt($filter("date")(today, "h"))-1].id,
                    endPeriod: $filter("date")(today, "a"),
                    displayEndday: $scope.hourDayArray[1].id
                };
            };



            $scope.datepickerInit = function(){
                $scope.datepickerAggregation = DateModel.getAggregation();
                $scope.timeUnitDimension = pubAnalyticService.getHistoricDimensions().getSelectedDimensions().filter(function (el) {
                    return el.getGroupId() === "timeUnits";
                });

                var firstTimeDimension = $scope.timeUnitDimension[0] ? $scope.timeUnitDimension[0].getId()  : null;

                $scope.hourSelectionEnable = (!firstTimeDimension || firstTimeDimension === "hour") ? true : false;
                $scope.dateSelectionEnable = (!firstTimeDimension || firstTimeDimension === "date") ? true : false;

                $scope.weekSelectionEnable = (!firstTimeDimension || firstTimeDimension === "date" || firstTimeDimension === "week")  ? true : false;
                $scope.monthSelectionEnable = (!firstTimeDimension || firstTimeDimension === "date" || firstTimeDimension === "week" || firstTimeDimension === "month") ? true : false;
                $scope.quarterSelectionEnable = (!firstTimeDimension || firstTimeDimension === "date" || firstTimeDimension === "week" || firstTimeDimension === "month"  || firstTimeDimension === "quarter") ? true : false;


                $scope.dateRangeList = DateModel.getSelectRangeList();
                $scope.hourpickerInit();
                

                //Dynamically change the group of yesterday to hour/date
                DateModel.attributes.selectRangeList[1].group = ($scope.timeUnitDimension[0] && $scope.timeUnitDimension[0].getId() === "hour")?"hour":"date";
                

                if ($scope.timeUnitDimension.length !== 0){
                    angular.forEach($scope.dateRangeList, function(dateRange){
                        if ($scope.timeUnitDimension[0].getId() === "hour" && (dateRange.index === 0 || dateRange.index === 1|| dateRange.index === 8) ){
                            dateRange.class= "date-option-link";
                        }
                        else if ($scope.timeUnitDimension[0].getId() === "date" && dateRange.index >= 1){
                            dateRange.class= "date-option-link";
                        }
                        else if ($scope.timeUnitDimension[0].getId() === "week" && dateRange.index >=4  && dateRange.index !== 6 ){
                            dateRange.class= "date-option-link";
                        }
                        else if ($scope.timeUnitDimension[0].getId() === "month" && (dateRange.index === 5 ||dateRange.index === 7 || dateRange.index === 8) ){
                            dateRange.class= "date-option-link";
                        }
                        else if ($scope.timeUnitDimension[0].getId() === "quarter" && dateRange.index >=7 ){
                            dateRange.class= "date-option-link";
                        }
                        else {
                            dateRange.class= "date-option-link disabled-date-option";
                        }
                    });
                }
                else {
                    angular.forEach($scope.dateRangeList, function(dateRange){
                        dateRange.class= "date-option-link";
                    });
                }

                $rootScope.pickerStartLimit = $scope.startDate;
                $rootScope.pickerEndLimit = $scope.endDate;
                $scope.compare= DateModel.getCompareFlag();

                if ($scope.compare){
                    $scope.compareStartDate = DateModel.getCompareStartDate();
                    $scope.compareEndDate = DateModel.getCompareEndDate();
                    $scope.startDate = DateModel.getStartDate();
                    $scope.endDate = DateModel.getEndDate();
                    $scope.diffDays = $scope.calculateDiffDays($scope.startDate, $scope.endDate);
                    $scope.diffMonths = $scope.endDate.getMonth() - $scope.startDate.getMonth();
                    $scope.toggleCompareView("compare");
                }
            };


            var validateHour = function(start,end){
                var hour,year,month,date,period;
                if ($scope.compare === true  && $scope.currentCompareView === "compare"){
                    period = ( ($scope.hourCompareObject.startPeriod === "PM") &&  ($scope.hourCompareObject.startHour !== 12))? 12: 0;
                    period = ( ($scope.hourCompareObject.startPeriod === "AM") &&  ($scope.hourCompareObject.startHour === 12))? -12: period;
                    hour =  $scope.hourCompareObject.startHour + period;
                    year = $scope.hourCompareObject.displayStartday.split("/")[0];
                    month = $scope.hourCompareObject.displayStartday.split("/")[1]-1;
                    date = $scope.hourCompareObject.displayStartday.split("/")[2];
                    start = new Date(year,month,date, hour);
                    $scope.compareStartDate = start;
                }
                else {
                    period = ( ($scope.hourObject.startPeriod === "PM") &&  ($scope.hourObject.startHour !== 12))? 12: 0;
                    period = ( ($scope.hourObject.startPeriod === "AM") &&  ($scope.hourObject.startHour === 12))? -12: period;

                    hour =  $scope.hourObject.startHour + period;
                    year = $scope.hourObject.displayStartday.split("/")[0];
                    month = $scope.hourObject.displayStartday.split("/")[1]-1;
                    date = $scope.hourObject.displayStartday.split("/")[2];
                    start = new Date(year,month,date, hour);
                    $scope.startDate = start;
                }
                


                if ($scope.compare === true  && $scope.currentCompareView === "compare"){
                    var diff = ($scope.endDate.getTime()-$scope.startDate.getTime());

                    var newEndDate = new Date(start.getTime() + diff);
                    year = newEndDate.getFullYear();
                    month = newEndDate.getMonth();
                    date = newEndDate.getDate();
                    hour = newEndDate.getHours();
                    end = new Date(year,month,date, hour);
                    if (hour >= 12){
                        $scope.hourCompareObject.endPeriod = "PM";
                        hour = (hour === 12)? hour: hour-12;
                    }
                    else {
                        $scope.hourCompareObject.endPeriod = "AM";
                        hour = (hour === 0)? 12: hour;
                    }
                    $scope.hourCompareObject.endHour = hour;

                    if (new Date().getDate() === newEndDate.getDate()) {
                        $scope.hourCompareObject.displayEndday = $scope.hourDayArray[1].id;
                    }
                    else {
                        if (newEndDate.getDate() > new Date().getDate() ){
                            $scope.hourCompareObject.displayEndday = "---";
                        }
                        else {
                            $scope.hourCompareObject.displayEndday = $scope.hourDayArray[0].id;
                        }
                    }
                    
                    $scope.compareEndDate = end;

                }
                else {
                    period = ( ($scope.hourObject.endPeriod === "PM") &&  ($scope.hourObject.endHour !== 12))? 12: 0;
                    period = ( ($scope.hourObject.endPeriod === "AM") &&  ($scope.hourObject.endHour === 12))? -12: period;
                    hour =  $scope.hourObject.endHour + period;
                    year = $scope.hourObject.displayEndday.split("/")[0];
                    month = $scope.hourObject.displayEndday.split("/")[1]-1;
                    date = $scope.hourObject.displayEndday.split("/")[2];
                    end = new Date(year,month,date, hour);

                    $scope.endDate = end;
                }


                if (start > end ){
                    $scope.dateError=true;
                    $scope.errorMessage = $filter("translate")("ERROR.INVALID_END_DATE");
                }
                else if (end > new Date()){
                    $scope.dateError=true;
                    $scope.errorMessage = $filter("translate")("ERROR.INVALID_DATE_FUTURE");
                }
                else if (($scope.compare === true  && $scope.currentCompareView === "compare") && (end > $scope.endDate) ){
                    $scope.dateError=true;
                    $scope.errorMessage = $filter("translate")("ERROR.INVALID_DATE_COMPARE_FUTURE");
                }
                else if (($scope.compare === true  && $scope.currentCompareView === "report") && (end < $scope.compareEndDate) ){
                    $scope.dateError=true;
                    $scope.errorMessage = $filter("translate")("ERROR.INVALID_DATE_COMPARE_FUTURE");
                }
                else {
                    $scope.dateError=false;
                }
            };

            var validateWeek = function(start,end){
                if ( DateModel.convertDateToWeek(start) > DateModel.convertDateToWeek(end) ){
                    $scope.dateError=true;
                    $scope.errorMessage = $filter("translate")("ERROR.INVALID_END_WEEK");
                }
                else if (DateModel.convertDateToWeek(end) > DateModel.convertDateToWeek(new Date())) {
                    $scope.dateError=true;
                    $scope.errorMessage = $filter("translate")("ERROR.INVALID_WEEK_FUTURE");
                }
                else if (DateModel.convertDateToWeek(start) <  DateModel.convertDateToWeek(DateModel.getNoEarlierThan("week"))){
                    $scope.dateError=true;
                    $scope.errorMessage = $filter("translate")("ERROR.INVALID_WEEK_TOOEARLY") +" "+$filter("date")(DateModel.getNoEarlierThan("week"), "MMM d, y")+".";
                }
                else if (($scope.compare === true  && $scope.currentCompareView === "compare") && (DateModel.convertDateToWeek(end) > DateModel.convertDateToWeek($scope.endDate)) ){
                    $scope.dateError=true;
                    $scope.errorMessage = $filter("translate")("ERROR.INVALID_DATE_COMPARE_FUTURE");
                }
                else if (($scope.compare === true  && $scope.currentCompareView === "report") && (DateModel.convertDateToWeek(end) < DateModel.convertDateToWeek($scope.compareEndDate)) ){
                    $scope.dateError=true;
                    $scope.errorMessage = $filter("translate")("ERROR.INVALID_DATE_COMPARE_FUTURE");
                }
                else {
                    $scope.dateError=false;
                }
            };

            var validateMonth = function (start,end){
                if ( DateModel.convertDateToMonth(start) > DateModel.convertDateToMonth(end) ){
                    $scope.dateError=true;
                    $scope.errorMessage = $filter("translate")("ERROR.INVALID_END_MONTH");
                }
                else if (DateModel.convertDateToMonth(end) > DateModel.convertDateToMonth(new Date())) {
                    $scope.dateError=true;
                    $scope.errorMessage = $filter("translate")("ERROR.INVALID_MONTH_FUTURE");
                }
                else if (DateModel.convertDateToMonth(start) <  DateModel.convertDateToMonth(DateModel.getNoEarlierThan("month"))){
                    $scope.dateError=true;
                    $scope.errorMessage = $filter("translate")("ERROR.INVALID_MONTH_TOOEARLY") +" "+$filter("date")(DateModel.getNoEarlierThan("month"), "MMM, y")+".";
                }
                else if (($scope.compare === true  && $scope.currentCompareView === "compare") && (DateModel.convertDateToMonth(end) > DateModel.convertDateToMonth($scope.endDate)) ){
                    $scope.dateError=true;
                    $scope.errorMessage = $filter("translate")("ERROR.INVALID_DATE_COMPARE_FUTURE");
                }
                else if (($scope.compare === true  && $scope.currentCompareView === "report") && (DateModel.convertDateToMonth(end) < DateModel.convertDateToMonth($scope.compareEndDate)) ){

                    $scope.dateError=true;
                    $scope.errorMessage = $filter("translate")("ERROR.INVALID_DATE_COMPARE_FUTURE");
                }
                else {
                    $scope.dateError=false;
                }
            };
            $scope.datepickerInit();
        }
    ]);
}).call(this, angular);
