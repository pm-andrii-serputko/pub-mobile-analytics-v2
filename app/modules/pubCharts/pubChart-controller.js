/*global d3*/
(function (angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");

    app.controller("pubChartCtrl", [
        "$scope",
        "historicApiService",
        "$filter",
        "pubAnalyticService",
        "dataFormattingService",
        "DateModel",
        "mediator",
        "chartModel",

        function ($scope, historicApiService,$filter, pubAnalyticService,dataFormattingService, DateModel, mediator, chartModel) {
            function linearRegression(data) {
                if (!data){
                    return false;
                }

                var sum = [0, 0, 0, 0, 0],  results = [];
                var size = 0;
                for (var n=0; n < data.length; n++) {
                    if (data[n][1]) {
                        size++;
                        sum[0] += data[n][0];
                        sum[1] += data[n][1];
                        sum[2] += data[n][0] * data[n][0];
                        sum[3] += data[n][0] * data[n][1];
                        sum[4] += data[n][1] * data[n][1];
                    }
                }

                var slope = (size * sum[3] - sum[0] * sum[1]) / (size * sum[2] - sum[0] * sum[0]);
                var intercept = (sum[1] / size) - (slope * sum[0]) / size;

                if (isNaN(slope) || isNaN(intercept)){
                    return false;
                }

                for (var i = 0, len = data.length; i < len; i++) {
                    var coordinate = [data[i][0], data[i][0] * slope + intercept];
                    results.push(coordinate);
                }

                return results;
            }

            function checkDuplicate(name) {
                var id, found;
                id = $scope.dataObject.length + 1;
                found = $scope.dataObject.some(function (el) {
                    return el.key === name;
                });
                return found;
            }

            function getDimension(index) {
                var dimensions, dimension;
                dimensions = pubAnalyticService.getHistoricDimensions();
                dimensions = dimensions.getVisibleDimensions();
                dimension = dimensions[index];
                return dimension;
            }

            function removeRegressionLine(){
                if ($scope.dataObject){
                    $scope.dataObject = $scope.dataObject.filter(function(each){
                        return !each.regression;
                    });
                }
            }

            function heatmapDataParse(chartType, response){
                if (angular.isUndefined(response.rows) || (response.rows.length === 0 )){
                    return undefined;
                }

                var yDimensionIndex = response.columns.indexOf(getDimension(0).getId());
                var id = response.id;
                if (typeof(id) !== "object"){
                    id = [id];
                }

                var xDimensionIndex = response.columns.indexOf(getDimension(1).getId());
                var valueIndex;

                if ($scope.isCompare){
                    valueIndex = DateModel.getCompareValueObject(2).index;
                }
                else {
                    valueIndex = response.columns.indexOf(chartModel.getMetric());
                }

                var newObject = {};

                newObject.value = [];
                newObject.yDataList = [];
                newObject.xDataList = [];

                var yDimensionList = {};

                angular.forEach(id,function(each, index){
                    newObject.yDataList.push(response.displayValue[getDimension(0).getId()][each.id]);
                    yDimensionList[response.displayValue[getDimension(0).getId()][each.id]] = index;
                });

                var xDimensionList = {};
                var yLength = 0;

                angular.forEach(response.rows,function(each){
                    if (angular.isUndefined(xDimensionList[each[xDimensionIndex]])){
                        if (yLength < $scope.heatmapColumnsLimit){
                            newObject.xDataList.push(each[xDimensionIndex]);
                            xDimensionList[each[xDimensionIndex]] = yLength++;
                        }
                    }
                });

                var dataObject = [];
                for (var i=0;i< id.length;i++){
                    dataObject[i] = [];
                    for (var j=0;j<yLength;j++){
                        dataObject[i][j] = 0;
                    }
                }
                newObject.totalRow = yLength;

                angular.forEach(response.rows,function(each){
                    var yIndex = yDimensionList[each[yDimensionIndex]];
                    var xIndex = xDimensionList[each[xDimensionIndex]];

                    if (angular.isUndefined(dataObject[yIndex])) {
                        dataObject[yIndex]= [];
                    }

                    dataObject[yIndex][xIndex]  = each[valueIndex];
                });


                angular.forEach(dataObject,function(rowList,rowIndex){
                    angular.forEach(rowList,function(each,columnIndex){
                        var heatmapDisplayValue;

                        if (angular.isUndefined(each)){
                            heatmapDisplayValue = 0;
                        }
                        else {
                            heatmapDisplayValue = each;
                            heatmapDisplayValue = dataFormattingService.numberFormat(chartModel.getMetric(), heatmapDisplayValue, $scope.chartCurrency);
                        }
                        newObject.value.push({ "yIndex": rowIndex+1, "xIndex": columnIndex+1, "amount": heatmapDisplayValue});
                    });
                });
                var tempDimensions = pubAnalyticService.getHistoricDimensions();
                tempDimensions = tempDimensions.getVisibleDimensions();

                newObject.firstDimensionLabel = tempDimensions[0].getName();
                newObject.secondDimensionLabel = tempDimensions[1].getName();
                return newObject;
            }

            function pubChartInit(){
                $scope.showTrendLine = false;
                $scope.selectedData = [];
                $scope.metricNames = [];
                $scope.colorArray = ["#8bcb5d", "#e36a29", "#565ca2", "#a06119", "#5cbcc1", "#9fd4f3", "#c5c6ca"];
                $scope.compareLineColorArray = ["#8bcb5d","rgba(139,203,93,0.3)", "#e36a29","rgba(227,106,47,0.3)", "#565ca2","rgba(86,92,162,0.3)", "#a06119", "rgba(160,97,169,0.3)","#5cbcc1", "rgba(92,188,193,0.3)"];
                $scope.barCompareColorArray = ["#8bcb5d", "#e36a29"];
                $scope.metricsCollection = pubAnalyticService.getHistoricMetrics();
                $scope.chartDimensionName = getDimension(0) ? getDimension(0).getName() : "";
                $scope.heatmapColumnsLimit = 30;
                $scope.isCompare = DateModel.getCompareFlag();
                $scope.chartMetricName = $scope.metricsCollection.findMetricById(chartModel.getMetric()).getName()+DateModel.getCompareValueObject(1).label;


                $scope.scatterBubbleFinalColorArray = [];

                chartModel.setIsDualScale(false);
                $scope.timeseriesBy = chartModel.getAggregation();
                $scope.updateDefaultChart();

                mediator.subscribe("update-chart", function () {
                    $scope.updateChart();
                });

                var tempDimensions = pubAnalyticService.getHistoricDimensions();
                tempDimensions = tempDimensions.getVisibleDimensions();
                var opacity = 1.0,
                    limit =5,
                    //Color array is not complete since the last parameter(opacity) will be added later in the code.
                    scatterBubbleInitialColorArray = ["rgba(139,203,93,", "rgba(230,110,37,", "rgba(86,92,162,","rgba(160,97,169,", "rgba(92,188,193,"];


                if ($scope.slicerData.displayValue && tempDimensions[0]){
                    for (var index = 0; index < $scope.slicerData.rows.length; index ++){
                        var mod = index % limit;
                        if(index % 5===0){
                            if(opacity< 0.1){
                                // reset opacity
                                opacity = 1.0;
                            }else{
                                opacity = 1 - Math.floor(index/limit)/10;
                            }
                        }
                        $scope.scatterBubbleFinalColorArray[index] = scatterBubbleInitialColorArray[mod]+ opacity + ")";
                    }
                }

                $scope.$on("updateChart", function(e,selected) {
                    $scope.updateChart(selected);
                });
            }


            $scope.lineXfunction = function(){
                return function(d) {
                    return d[0];
                };
            };

            $scope.lineYfunction = function () {
                return function (d) {
                    return d[1];
                };
            };


            $scope.lineXaxisFunction = function(){
                return function (d) {
                    var hour;
                    var timeList = chartModel.getTimeList();

                    if ($scope.timeseriesBy === "hour"){
                        if (angular.isUndefined(timeList[d])) {
                            hour = "";
                        }
                        else {
                            hour = parseInt(d3.time.format("%I")(new Date(timeList[d]))) + d3.time.format("%p")(new Date(timeList[d]));
                        }
                        return hour;
                    }
                    else if ($scope.timeseriesBy === "date"){
                        return (d % 1 === 0) ? d3.time.format("%m/%d/%Y")(new Date(timeList[d])) : "";
                    }
                    else {
                        return (d % 1 === 0) ? timeList[d] : "";
                    }


                };
            };

            $scope.compareLineXaxisFunction = function(){
                return function (d) {
                    if (d % 1 === 0){
                        if ($scope.timeseriesBy === "hour"){
                            return "Hour "+ d;
                        }
                        else if ($scope.timeseriesBy === "date"){
                            return "Day "+ d;
                        }
                        else if ($scope.timeseriesBy === "week"){
                            return "Week "+ d;
                        }
                        else if ($scope.timeseriesBy === "month"){
                            return "Month "+ d;
                        }
                        else {
                            return "Quarter "+ d;
                        }
                    }
                    else {
                        return "";
                    }
                };
            };

            function formatAxisValuesBasedOnLength(d){

                var postfix = "";
                var str = d.toString();
                if (d % 1 === 0){
                    if ((str.length >= 7) && (str.length < 10)){
                        postfix = "k";
                        str = str.substring(0, str.length - 3);
                    }
                    else if ((str.length >= 10) && (str.length < 13)){
                        postfix = "m";
                        str = str.substring(0, str.length - 6);
                    }
                    else if (str.length >= 13){
                        postfix = "b";
                        str = str.substring(0, str.length - 9);
                    }
                    d = str;
                }
                var returnObj = {
                    d: d,
                    postfix: postfix
                };
                return returnObj;
            }

            $scope.yAxisTickFormatFunction = function (currency, isDualScale) {
                return function (d) {
                    if (d === null){
                        return $filter("translate")("CHART.NO_DATA");
                    }

                    var compareOption = "";
                    if ($scope.isCompare && $scope.compareValue === "comparePercentage"){
                        compareOption = "_p";
                    }

                    var retObj = formatAxisValuesBasedOnLength(d);
                    if (isDualScale){
                        return dataFormattingService.format(chartModel.getDualScaleMetric() +compareOption, retObj.d, currency)+retObj.postfix;
                    }
                    return dataFormattingService.format(chartModel.getMetric()+compareOption, retObj.d, currency)+retObj.postfix;
                };
            };

            $scope.lineBarColorFunction = function() {
                return function(d, i) {
                    return $scope.colorArray[i];
                };
            };

            $scope.compareLineColorFunction = function() {
                return function(d, i) {
                    return $scope.compareLineColorArray[i];
                };
            };

            $scope.barCompareColorFunction = function() {
                return function(d, i) {
                    return $scope.barCompareColorArray[i];
                };
            };

            $scope.scatterBubbleColorArrayFunction = function() {
                return function(d, i) {
                    return $scope.scatterBubbleFinalColorArray[i];
                };
            };


            $scope.lineToolTipContentFunction = function(){
                return function (key, x, y, e) {
                    var timeList = chartModel.getTimeList();
                    var metric = $scope.metricsCollection.findMetricById(chartModel.getMetric()).getName();

                    if ($scope.isDualScale){
                        metric = e.series.leftScale ? $scope.metricsCollection.findMetricById(chartModel.getMetric()).getName(): $scope.dualMetricName;
                    }

                    if ($scope.timseriesBy === "hour"){
                        var date =d3.time.format("%m/%d")(new Date(timeList[e.pointIndex]));
                        return "<p>"+date+" "+ x+"<br/>"+metric+": " + y + "</p>";
                    }
                    else if ($scope.timeseriesBy === "date"){
                        var xDate = new Date(x);
                        var formattedDate = d3.time.format("%A, %b %d, %Y")(xDate);
                        return "<p>"+ formattedDate+"<br/>"+metric+": " + y + "</p>";
                    }
                    else {
                        return "<p>"+ x+"<br/>"+metric+": " + y + "</p>";
                    }
                };
            };


            $scope.compareLineToolTipContentFunction = function(){
                return function (key, x, y, e) {
                    if (angular.isUndefined(key)){
                        key ="";
                    }
                    else {
                        key += " <br/>";
                    }
                    var metric = $scope.metricsCollection.findMetricById(chartModel.getMetric()).getName();
                    if ($scope.isDualScale){
                        metric = e.series.leftScale ? $scope.metricsCollection.findMetricById(chartModel.getMetric()).getName(): $scope.dualMetricName;
                    }
                    return "<p>"+key + x +"<br/>"+metric+DateModel.getCompareValueObject(1).label+": " + y + "</p>";
                };
            };

            $scope.barXaxisFunction = function(){
                return function (d) {
                    d = d.replace(/ *\([\d+)]*\) */g, "");
                    var trimedStr;
                    if (d.length > 15){
                        trimedStr= d.slice(0,15);
                        return trimedStr+"...";
                    }
                    else {
                        return d;
                    }
                };
            };


            $scope.barToolTipContentFunction = function () {
                return function (key, x, y, e) {
                    var metric = $scope.metricsCollection.findMetricById(chartModel.getMetric()).getName();
                    return "<p>"+ e.point[0].replace(/ *\([\d+)]*\) */g, "") + "<br/>"+metric+DateModel.getCompareValueObject(1).label+": " + y + "</p>";
                };
            };

            $scope.barCompareToolTipContentFunction = function () {
                return function (key, x, y, e) {
                    var metric = $scope.metricsCollection.findMetricById(chartModel.getMetric()).getName();
                    return "<p>"+key + "<br/>" + e.point[0].replace(/ *\([\d+)]*\) */g, "") + "<br/>"+metric+": " + y + "</p>";
                };
            };

            $scope.barColorFunction = function() {
                return function() {
                    return $scope.colorArray[0];
                };
            };

            $scope.pieToolTipContentFunction = function (currency) {
                return function (key, x, y) {
                    var metric = $scope.metricsCollection.findMetricById(chartModel.getMetric()).getName();

                    return "<p>"+ key + "<br/>"+metric+": " + dataFormattingService.format(chartModel.getMetric(), y.value, currency) + "</p>";
                };
            };

            $scope.pieXfunction = function(){
                return function(d) {
                    return d.key.replace(/ *\([\d+)]*\) */g, "");
                };
            };

            $scope.pieYfunction = function(){
                return function(d) {
                    return d.value;
                };
            };

            $scope.scatterBubbleTooltip = function(currency){
                return function(key, x, y, objWhole) {
                    var tooltipContent;
                    if(objWhole && objWhole.point && (objWhole.point.size || objWhole.point.size===0)){
                        tooltipContent = "<p>" + "<b>"+ key + "</b>" + "<br/>" +
                               "<b>"+ $scope.xAxis + "</b>"+" : "+ "<strong>" + x+ "</strong>" + "<br/>" +
                               "<b>"+ $scope.yAxis + "</b>"+" : "+ "<strong>" + y+ "</strong>" + "<br/>" +
                               "<b>"+ $scope.zAxis + "</b>"+" : "+ "<strong>" + dataFormattingService.format($scope.zMetricValue, objWhole.point.size, currency) + "</strong>" + "</p>";
                    }else{
                        tooltipContent = "<p>" + "<b>"+ key + "</b>" + "<br/>" +
                               "<b>"+ $scope.xAxis + "</b>"+" : "+ "<strong>" + x + "</strong>" + "<br/>" +
                               "<b>"+ $scope.yAxis + "</b>"+" : "+ "<strong>" + y + "</strong>" + "</p>";
                    }
                    return tooltipContent;
                };
            };

            $scope.getShapeCircle = function(){
                return function(){
                    return "circle";
                };
            };



            $scope.chartDateSortOrder = function(byIndex, data, descending){
                var orderBy = $filter("orderBy");
                var sortBy = function (array){
                    return array[byIndex];
                };
                return orderBy(data, sortBy, descending);
            };


            $scope.legendclick = function(d, i, notFromClick){

                if (!$scope.dataObject[i]){
                    return;
                }
                else if ($scope.dataObject[i].regressionActivated && !notFromClick){
                    $scope.dataObject[i].regressionActivated = false;
                    removeRegressionLine();
                }
                else {
                    var result = linearRegression($scope.dataObject[i].values);
                    removeRegressionLine();
                    var currentColorArray =  (($scope.isCompare && $scope.compareValue === "compareAbsoluteValue") || $scope.isDualScale) ? $scope.compareLineColorArray : $scope.colorArray;

                    if (result !== false){
                        var regressionLine = {key:"regression", regression: true, trendColor: currentColorArray[i], values:result , leftScale:$scope.dataObject[i].leftScale};
                        angular.forEach($scope.dataObject, function (each){
                            each.regressionActivated = false;
                        });
                        $scope.dataObject[i].regressionActivated = true;
                        $scope.dataObject.push(regressionLine);
                    }
                }
                if (!notFromClick){
                    $scope.$apply();
                }
            };

            $scope.scatterBubbleXAxisTick =  function(chartCurrency){
                return function(d) {
                    var retObj = formatAxisValuesBasedOnLength(d);
                    return dataFormattingService.format($scope.xMetricValue , retObj.d, chartCurrency) + retObj.postfix;
                };
            };




            $scope.scatterBubbleYAxisTick = function(chartCurrency){
                return function(d) {
                    var retObj = formatAxisValuesBasedOnLength(d);
                    return dataFormattingService.format($scope.yMetricValue, retObj.d, chartCurrency) + retObj.postfix;
                };
            };

            $scope.updateChart = function(selectedList){
                $scope.chartMetricName = $scope.metricsCollection.findMetricById(chartModel.getMetric()).getName()+DateModel.getCompareValueObject(1).label;
                if (selectedList && selectedList.length !== 0) {
                    $scope.dataObject = [];
                    $scope.defaultChart = false;
                    removeRegressionLine();
                    chartModel.setIsDefaultChart(false);
                    var tempDimensions = pubAnalyticService.getHistoricDimensions();
                    tempDimensions = tempDimensions.getVisibleDimensions();

                    angular.forEach(selectedList,function(dimension){
                        $scope.addChart(selectedList, dimension,$scope.selectedChart, false);
                    });
                }
                else {
                    $scope.defaultChart = true;
                    $scope.updateDefaultChart();
                }
            };


            $scope.updateDefaultChart = function(){
                $scope.defaultChart = true;
                historicApiService.abortChart();
                $scope.loadingChart = true;
                $scope.dataObject = [];
                var type = $scope.selectedChart;
                chartModel.setIsDefaultChart(true);
                if (type === "linechart") {
                    historicApiService.fetchRealChartData("",type,$scope.timeseriesBy).success(function (data) {
                        if (data){
                            $scope.chartCurrency = data.currency;
                            //Default line chart for compare absolute value
                            if ($scope.isCompare && $scope.compareValue === "compareAbsoluteValue"){
                                data[0].key = $filter("translate")("SLICER.CURRENT_PERIOD");
                                data[1].key = $filter("translate")("SLICER.PAST_PERIOD");
                                if ($scope.isDualScale){
                                    data[1].key = $filter("translate")("SLICER.CURRENT_PERIOD");
                                    data[2].key = data[3].key = $filter("translate")("SLICER.PAST_PERIOD");
                                }
                                $scope.dataObject = data;
                            }
                            //Default line chart for regular time or compare absolute change/percentage
                            else {
                                if ($scope.isDualScale){
                                    data[0].key = "Total by " + $scope.chartMetricName;
                                    data[1].key = "Total by " + $scope.dualMetricName;
                                    $scope.dataObject = data;
                                }
                                else {
                                    data.key = "All Dimensions (Total)";
                                    $scope.dataObject.push(data);
                                }
                            }
                        }
                        else {
                            $scope.dataObject = [{"key":"Empty Line Chart","values":[]}];
                        }

                        $scope.legendclick(null, 0, true);
                    })
                    .finally(function(){
                        $scope.loadingChart = false;
                    });
                }

                else if (type === "barchart"){
                    historicApiService.fetchRealChartData("",type).success(function (response) {
                        $scope.chartCurrency = response.currency;
                        var data = response.data;

                        //Default bar chart for compare absolute value
                        if ($scope.isCompare && $scope.compareValue === "compareAbsoluteValue"){

                            data = $scope.chartDateSortOrder(1,data, true);
                            if (data.length > 30){
                                data = data.slice(0, 30);
                            }
                            $scope.loadingChart = false;
                            $scope.dataObject[0] = {};
                            $scope.dataObject[1] = {};
                            $scope.dataObject[0].values = [];
                            $scope.dataObject[1].values = [];
                            $scope.dataObject[0].key = $filter("translate")("SLICER.CURRENT_PERIOD");
                            $scope.dataObject[1].key = $filter("translate")("SLICER.PAST_PERIOD");

                            angular.forEach(data,function(each){
                                $scope.dataObject[0].values.push([each[0],each[1]]);
                            });

                            angular.forEach(data,function(each){
                                $scope.dataObject[1].values.push([each[0],each[2]]);
                            });
                        }
                        //Default bar chart for regular time or compare absolute change/percentage
                        else {
                            angular.forEach(data,function(each){
                                each[1] = each[DateModel.getCompareValueObject(1).index];
                                if (typeof(each[1]) === "string"){
                                    each[1] = (each[1] === "Infinity")? 100 : Number(each[1]);
                                }
                            });

                            data = $scope.chartDateSortOrder(1,data, true);
                            data = (data.length > 30)? data.slice(0, 30) : data;
                            $scope.dataObject = [{"key":"Bar Chart","values":data}];
                        }
                    })
                    .finally(function(){
                        $scope.loadingChart = false;
                    });
                }

                else if (type === "piechart") {
                    historicApiService.fetchRealChartData("",type).success(function (response) {
                        $scope.chartCurrency = response.currency;
                        var data = response.data;
                        var other = 0;

                        if (!data || data.length === 0){
                            $scope.dataObject = [];
                        }
                        else {
                            angular.forEach(data,function(each,$index){
                                if ($index < 5){
                                    $scope.dataObject.push({"key":each[0],"value":each[1]});
                                }
                                else {
                                    other+=each[1];
                                }
                            });

                            if (data.length > 5){
                                $scope.dataObject.push({"key":"Others","value":other});
                            }
                        }
                    })
                    .finally(function(){
                        $scope.loadingChart = false;
                    });
                }
                else if(type === "scatterchart" || type === "bubblechart"){
                    var scatterBubbleSelectedMetrics = $scope.metricsCollection.getSelectedMetrics();

                    var metricOrder = chartModel.getScatterBubbleMetricOrder();

                    historicApiService.fetchRealChartData("", "scatterchart",null,null,metricOrder).success(function (response) {
                        $scope.chartCurrency = response.currency;
                        var scatterBubbleRows = response.rows, tempChartData = [];
                        if(scatterBubbleSelectedMetrics.length>0){
                            $scope.xMetricValue = response.columns[1];
                            $scope.xAxis = $scope.metricsCollection.findMetricById(response.columns[1]).getName();
                        }
                        if(scatterBubbleSelectedMetrics.length>1){
                            $scope.yMetricValue = response.columns[2];
                            $scope.yAxis = $scope.metricsCollection.findMetricById(response.columns[2]).getName();
                        }
                        if(scatterBubbleSelectedMetrics.length>2){
                            $scope.zMetricValue = response.columns[3];
                            $scope.zAxis = $scope.metricsCollection.findMetricById(response.columns[3]).getName();
                        }

                        angular.forEach(scatterBubbleRows,function(chartRow){
                            tempChartData.push({
                                key: chartRow[0],
                                values: []
                            });
                        });

                        if(type === "scatterchart"){
                            angular.forEach(scatterBubbleRows, function(chartRow, index){
                                tempChartData[index].values.push({
                                    x: chartRow[1],
                                    y: chartRow[2]
                                });
                            });
                        }else if(type === "bubblechart" ){
                            angular.forEach(scatterBubbleRows, function(chartRow, index){
                                tempChartData[index].values.push({
                                    x: chartRow[1],
                                    y: chartRow[2],
                                    size: chartRow[3]
                                });
                            });
                        }

                        $scope.dataObject = tempChartData;
                        angular.forEach(scatterBubbleSelectedMetrics, function(metricModel,index){
                            $scope.metricNames[index] = metricModel.getName();
                        });
                    })
                    .finally(function(){
                        $scope.loadingChart = false;
                    });
                }

                //heatmap default chart
                else {
                    if (angular.isUndefined($scope.slicerData.rows) || ($scope.slicerData.rows.length ===0) ){
                        $scope.heatdataObject = undefined;
                        $scope.loadingChart = false;
                    }

                    var dimensionList = [];
                    angular.forEach($scope.slicerData.rows,function(row,index){
                        if (index < 10) {
                            dimensionList.push(row[0]);
                        }
                    });
                    $scope.addChart(dimensionList, dimensionList,type,false);
                }
            };

            $scope.addChart = function (selectedList, dimension, chartType) {

                if (!$scope.dataObject || $scope.dataObject.length === 0){
                    $scope.loadingChart = true;
                }
                $scope.heatdataObject = {};

                if (angular.isUndefined($scope.dataObject)){
                    $scope.dataObject = [];
                }

                if (chartType === "linechart") {
                    var totalLineSize = selectedList.length;
                    historicApiService.fetchRealChartData(dimension.id, chartType,$scope.timeseriesBy).success(function (data) {

                        $scope.loadingChart = false;
                        $scope.chartCurrency = data.currency;
                        var duplicate = [];
                        //line chart for compare absolute value
                        if ($scope.isCompare && $scope.compareValue === "compareAbsoluteValue"){
                            totalLineSize = totalLineSize * 2;
                            if (!$scope.isDualScale){
                                data[0].id = dimension.id;
                                data[1].id = dimension.id;
                                data[0].key = dimension.value + " ("+$filter("translate")("SLICER.CURRENT_PERIOD")+")";
                                data[1].key = dimension.value + " ("+$filter("translate")("SLICER.PAST_PERIOD")+")";
                                data[0].compare = true;
                                data[1].compare = true;

                                //check duplicate dimension names
                                duplicate = $scope.dataObject.filter(function (el) {
                                    return el.key === data[0].key;
                                });
                                if (duplicate.length !== 0){
                                    data[0].key += " ("+dimension.id+")";
                                    data[1].key += " ("+dimension.id+")";
                                }
                            }
                            else {
                                totalLineSize = totalLineSize * 2;
                                data[0].id = dimension.id;
                                data[1].id = dimension.id;
                                data[2].id = dimension.id;
                                data[3].id = dimension.id;

                                data[0].key = dimension.value + " ("+$filter("translate")("SLICER.CURRENT_PERIOD")+")";
                                data[1].key = dimension.value + " ("+$filter("translate")("SLICER.CURRENT_PERIOD")+")";
                                data[2].key = dimension.value + " ("+$filter("translate")("SLICER.PAST_PERIOD")+")";
                                data[3].key = dimension.value + " ("+$filter("translate")("SLICER.PAST_PERIOD")+")";

                                data[0].compare = true;
                                data[1].compare = true;
                                data[2].compare = true;
                                data[3].compare = true;

                                //check duplicate dimension names
                                duplicate = $scope.dataObject.filter(function (el) {
                                    return el.key === data[0].key;
                                });
                                if (duplicate.length !== 0){
                                    data[0].key += " ("+dimension.id+")";
                                    data[1].key += " ("+dimension.id+")";
                                    data[2].key += " ("+dimension.id+")";
                                    data[3].key += " ("+dimension.id+")";
                                }
                            }

                            $scope.dataObject = $scope.dataObject.concat(data);
                        }

                        //line chart for regular time or compare absolute change/percentage
                        else {

                            if ($scope.isDualScale){
                                totalLineSize = totalLineSize * 2;
                                data[0].id = data[1].id = dimension.id;
                                data[0].key = data[1].key = dimension.value;

                                //check duplicate dimension names
                                duplicate = $scope.dataObject.filter(function (el) {
                                    return el.key === data[0].key;
                                });
                                if (duplicate.length !== 0){
                                    data[0].key += " ("+dimension.id+")";
                                    data[1].key += " ("+dimension.id+")";
                                }

                                $scope.dataObject = $scope.dataObject.concat(data);
                            }
                            else {
                                data.id = dimension.id;
                                data.key = dimension.value;

                                //check duplicate dimension names
                                duplicate = $scope.dataObject.filter(function (el) {
                                    return el.key === data.key;
                                });
                                if (duplicate.length !== 0){
                                    data.key += " ("+dimension.id+")";
                                }

                                $scope.dataObject.push(data);
                            }
                        }

                    })
                    .finally(function(){
                        $scope.dataObject[0].regressionActivated = true;

                        //always add the trend line to the end of the object list
                        if ($scope.dataObject.length === totalLineSize){
                            $scope.legendclick(null, 0, true);
                        }
                        $scope.loadingChart = false;
                    });
                }
                else if (chartType === "heatmap"){
                    $scope.loadingChart = true;

                    var tempDim = dimension;
                    if (!$scope.defaultChart){
                        tempDim = selectedList;
                    }

                    historicApiService.fetchRealChartData(tempDim, chartType).success(function (data) {
                        $scope.chartCurrency = data.currency;
                        for (var i=0;i<data.rows.length;i++){
                            var tempPercentage = data.rows[i][DateModel.getCompareValueObject(2).index];
                            if (typeof(tempPercentage) === "string"){
                                if (tempPercentage === "Infinity"){
                                    data.rows[i][DateModel.getCompareValueObject(2).index] = 100;
                                }
                                else {
                                    data.rows[i][DateModel.getCompareValueObject(2).index] = Number(tempPercentage);
                                }
                            }
                        }

                        if ($scope.isCompare){
                            data.rows = $scope.chartDateSortOrder(DateModel.getCompareValueObject(2).index,data.rows, true);
                        }

                        $scope.heatdataObject = heatmapDataParse(chartType,data);
                        $scope.newHeatMap = true;
                        $scope.loadingChart = false;
                    })
                    .error(function() {
                        $scope.heatdataObject = undefined;
                    })
                    .finally(function(){
                        $scope.loadingChart = false;

                    });

                }
                else if (chartType === "piechart") {
                    historicApiService.fetchRealChartData(dimension.id).success(function (response) {
                        $scope.chartCurrency = response.currency;
                        var data = response.data;


                        if (data[1] !== 0){
                            $scope.dataObject.push({"key":data[0],"value":data[1],"id":data[2]});
                        }
                    })
                    .error(function() {

                    })
                    .finally(function(){
                        $scope.loadingChart = false;
                    });
                }
                else if (chartType === "barchart"){
                    historicApiService.fetchRealChartData(dimension.id).success(function (response) {
                        $scope.chartCurrency = response.currency;
                        var data = response.data;
                        var barChartValueList,duplicate=[];
                        $scope.loadingChart = false;


                        //Compare Abosulte value bar chart
                        if ($scope.isCompare && $scope.compareValue === "compareAbsoluteValue"){
                            $scope.loadingChart = false;
                            //Adding the first bar
                            if (angular.isUndefined($scope.dataObject[0])){
                                $scope.dataObject  = [];
                                $scope.dataObject[0] = {};
                                $scope.dataObject[1] = {};
                                $scope.dataObject[0].values = [];
                                $scope.dataObject[1].values = [];
                                $scope.dataObject[0].key = $filter("translate")("SLICER.CURRENT_PERIOD");
                                $scope.dataObject[1].key = $filter("translate")("SLICER.PAST_PERIOD");
                                $scope.dataObject[0].values.push([data[0],data[1],dimension.id]);
                                $scope.dataObject[1].values.push([data[0],data[2],dimension.id]);

                            }
                            //Adding not the first bar
                            else {
                                //check duplicate dimension names
                                duplicate = $scope.dataObject[0].values.filter(function (el) {
                                    return el[0] === data[0];
                                });


                                if (duplicate.length !== 0){
                                    data[0] += "("+dimension.id+")";
                                }

                                $scope.dataObject[0].values.push([data[0],data[1],data[5]]);
                                $scope.dataObject[1].values.push([data[0],data[2],data[5]]);

                                $scope.dataObject[0].values = $scope.chartDateSortOrder(1,$scope.dataObject[0].values, true);
                            }
                        }
                        //Regular or Compare Abosulte change/percentage bar chart
                        else {
                            data[1] = data[DateModel.getCompareValueObject(1).index];

                            if (typeof(data[1]) === "string"){
                                data[1] = (data[1] === "Infinity")? 100 : Number(data[1]);
                            }

                            if (angular.isUndefined($scope.dataObject[0])){
                                $scope.dataObject = [{"key":"Bar Chart","values":[data]}];
                            }
                            else{
                                //check duplicate dimension names
                                duplicate = $scope.dataObject[0].values.filter(function (el) {
                                    return el[0] === data[0];
                                });

                                if (duplicate.length !== 0){
                                    data[0] += "("+dimension.id+")";
                                }

                                barChartValueList = $scope.dataObject[0].values;
                                barChartValueList.push(data);
                                barChartValueList = $scope.chartDateSortOrder(1,barChartValueList, true);

                                $scope.dataObject = [{"key":"Bar Chart","values":barChartValueList}];
                            }
                        }
                    })
                    .finally(function(){
                        $scope.loadingChart = false;
                    });
                }
                else if(chartType === "scatterchart" || chartType === "bubblechart" ){
                    var scatterBubbleSelectedMetrics = $scope.metricsCollection.getSelectedMetrics();
                    historicApiService.fetchRealChartData(dimension.id, "scatterchart").success(function (response) {
                        $scope.chartCurrency = response.currency;
                        var scatterBubbleData = response.data;
                        var tempChartObject = {};
                        tempChartObject = {
                            key: scatterBubbleData[0],
                            values: []
                        };

                        var isDuplicate = checkDuplicate(tempChartObject.key);
                        if (isDuplicate){
                            tempChartObject.key += "("+dimension.id+")";
                        }

                        if(chartType === "bubblechart"){
                            tempChartObject.values.push({
                                x: scatterBubbleData[1],
                                y: scatterBubbleData[2],
                                size: scatterBubbleData[3]
                            });
                        }
                        else if(chartType === "scatterchart"){
                            tempChartObject.values.push({
                                x: scatterBubbleData[1],
                                y: scatterBubbleData[2]
                            });
                        }

                        $scope.dataObject.push(tempChartObject);

                        angular.forEach(scatterBubbleSelectedMetrics, function(metricModel,index){
                            $scope.metricNames[index] = metricModel.getName();
                        });
                        $scope.loadingChart = false;
                    })
                    .finally(function(){
                        $scope.loadingChart = false;
                    });
                }
            };

            $scope.selectedChart = chartModel.getType();
            pubChartInit();
        }
    ]);

}).call(this, angular);
