/*global angular*/
(function (angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");

    app.controller("benchmarkDateDialogCtrl", [
        "$scope",
        "$rootScope",
        "pubAnalyticService",
        "DateModel",
        "$filter",

        function ($scope, $rootScope, pubAnalyticService,DateModel, $filter) {
            $scope.selectDateOption = function(id, options, init) {
                $scope.dateError = false;

                var date = DateModel.getDateById(id, options);

                $scope.selectedOption = id;
                $scope.startDate = date.startDate;
                $scope.endDate = date.endDate;
                $scope.validateDate($scope.startDate, $scope.endDate);

                if ((id !== 7) && (!init)){
                    if (id === 4) {
                        DateModel.setAggregation("week");
                    }
                    else {
                        DateModel.setAggregation("month");
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



            $scope.pickerClick = function(){
                $scope.validateDate($scope.startDate, $scope.endDate);
                var timeDiff;

                if ($scope.datepickerAggregation === "week"){
                    $rootScope.pickerStartLimit  = new Date(DateModel.tweakDate($scope.startDate).startDate);
                    $rootScope.pickerEndLimit = new Date(DateModel.tweakDate($scope.endDate).endDate);
                    timeDiff = Math.abs($rootScope.pickerStartLimit.getTime() - $rootScope.pickerEndLimit.getTime());
                }
                else {
                    $rootScope.pickerStartLimit = $scope.startDate;
                    $rootScope.pickerEndLimit = $scope.endDate;
                    timeDiff = Math.abs($scope.startDate .getTime() - $scope.endDate.getTime());
                }

                $scope.diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                $scope.startDate = new Date($scope.startDate.getTime()+1);
                $scope.endDate = new Date($scope.endDate.getTime()+1);

                
                timeDiff = Math.abs($scope.startDate .getTime() - $scope.endDate.getTime());
            };


            $scope.weekFormat = function(d){
                return DateModel.getWeekNumber(d);
            };

            $scope.monthFormat = function(d){
                return DateModel.convertDateToMonthString(d);
            };

            $scope.yearFormat = function(d){
                return d.getFullYear();
            };

            $scope.validateDate = function(start, end){

                if ($scope.datepickerAggregation === "week"){
                    if ( DateModel.convertDateToWeek(start) > DateModel.convertDateToWeek(end) ){
                        $scope.dateError=true;
                        $scope.errorMessage = $filter("translate")("ERROR.INVALID_END_WEEK");
                    }
                    else if (DateModel.convertDateToWeek(end) > DateModel.convertDateToWeek(new Date())) {
                        $scope.dateError=true;
                        $scope.errorMessage = $filter("translate")("ERROR.INVALID_WEEK_FUTURE");
                    }
                    else if (DateModel.convertDateToWeek(start) <  DateModel.convertDateToWeek(DateModel.getNoEarlierThan())){
                        $scope.dateError=true;
                        $scope.errorMessage = $filter("translate")("ERROR.INVALID_WEEK_TOOEARLY") +" "+$filter("date")(DateModel.getNoEarlierThan(), "MMM d, y")+".";
                    }
                    else {
                        $scope.dateError=false;
                    }
                }
                else if ($scope.datepickerAggregation === "month"){
                    if ( DateModel.convertDateToMonth(start) > DateModel.convertDateToMonth(end) ){
                        $scope.dateError=true;
                        $scope.errorMessage = $filter("translate")("ERROR.INVALID_END_MONTH");
                    }
                    else if (DateModel.convertDateToMonth(end) > DateModel.convertDateToMonth(new Date())) {
                        $scope.dateError=true;
                        $scope.errorMessage = $filter("translate")("ERROR.INVALID_MONTH_FUTURE");
                    }
                    else if (DateModel.convertDateToMonth(start) <  DateModel.convertDateToMonth(DateModel.getNoEarlierThan())){
                        $scope.dateError=true;
                        $scope.errorMessage = $filter("translate")("ERROR.INVALID_MONTH_TOOEARLY") +" "+$filter("date")(DateModel.getNoEarlierThan(), "MMM, y")+".";
                    }
                    else {
                        $scope.dateError=false;
                    }
                }


            };

            $scope.setDatepickerAggregation = function (aggregation){
                $scope.datepickerAggregation = aggregation;
                DateModel.setAggregation(aggregation);
                $scope.pickerClick();
            };
            
            $scope.getOptionGroup = function (){
                if ($scope.datepickerAggregation === "quarter"){
                    return "quarter";
                }
                else {
                    return "month";
                }
            };

            $scope.dateRangeList = DateModel.getBenchmarkSelectRangeList();
            $scope.selectedClass = "date-option-link-selected";
            $scope.unselectedClass = "date-option-link";
            $scope.disabledClass = "disabled-date-option";
            $scope.accountTimezone = pubAnalyticService.getTimezone();
            $scope.billingTimezone = "PT";
            $scope.selectedTimezone = $scope.accountTimezone;
            $scope.datepickerAggregation = DateModel.getAggregation();

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

            angular.forEach($scope.dateRangeList, function(dateRange){
                if (dateRange.index === 4 || dateRange.index === 5 || dateRange.index === 7) {
                    dateRange.class= "date-option-link";
                } else {
                    dateRange.class= "date-option-link disabled-date-option";
                }
            });


            $rootScope.pickerStartLimit = $scope.startDate;
            $rootScope.pickerEndLimit = $scope.endDate;

           
        }
    ]);
}).call(this, angular);
