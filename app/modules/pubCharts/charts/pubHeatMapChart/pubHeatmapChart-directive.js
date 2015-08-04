/* global d3*/
/*jshint unused:false*/
/*jslint evil:true*/
"use strict";
var app =  angular.module("pubSlicerApp");

app.directive("pubHeatmapChart", ["$location","dataFormattingService", "DateModel","chartModel", function ($location, dataFormattingService, DateModel, chartModel) {
    return {
        restrict: "E",
        $scope:  {
            width: "@",
            data: "@"
        },
        controller: ["$scope", function($scope) {

            /* Temporarily put the data object here (instead of REST call).  This should be changed when we switch to back end node servers Lingan is building */
            
            $scope.getWidth = function() {
                if ($scope.element[0].parentElement !== null){
                    return $scope.element[0].parentElement.parentElement.offsetWidth;
                }
            };
            $scope.$watch($scope.getWidth, function(newValue, oldValue) {
                $scope.chartContainerWidth = newValue;
            });
            window.onresize = function(){
                $scope.$apply();
            };
        }],
        //get the data attribute from pub-heatmap-chart tag
        link: function($scope, iElement, $Attrs) {
            $scope.element=iElement;
            
            var action = function() {
                
                var margin = { top: 20, right: 0, bottom: 120, left: 160 },
                    width = $Attrs.width - margin.left - margin.right,
                    height = 570 - margin.top - margin.bottom,
                    buckets = 8,

                // Colors defined in _pubChart.scss (sass)
                colors = ["pubHeatMapColors2",
                    "pubHeatMapColors3","pubHeatMapColors4",
                    "pubHeatMapColors5","pubHeatMapColors6",
                    "pubHeatMapColors7","pubHeatMapColors8",
                    "pubHeatMapColors9"];



                var compareColors = [ "heatColor9","heatColor8","heatColor7","heatColor6","heatColor5","heatColor4","heatColor3","heatColor2",
                        "pubHeatMapColors2","pubHeatMapColors3","pubHeatMapColors4","pubHeatMapColors5","pubHeatMapColors6","pubHeatMapColors7","pubHeatMapColors8","pubHeatMapColors9"
                ];


                var data = $scope.heatdataObject;
                var gridSize, xLabels, yLabels, heatMap, firstDimensionLabel, secondDimensionLabel;

                if ( (iElement[0].innerHTML!=="") && ($scope.newHeatMap !== true) ){
                    if (angular.isUndefined(data)){
                        return;
                    }
                    gridSize = Math.floor(width / data.totalRow);

                    yLabels = d3.selectAll(".yLabel")
                        .transition().duration(500).attr("y", function (d, i) { return i * gridSize; });

                    xLabels = d3.selectAll(".xLabel")
                        .transition().duration(500).attr("x", function (d, i) { return i * gridSize; });

                    heatMap = d3.selectAll(".bucket")
                        .attr("x", function(d) { return (d.xIndex - 1) * gridSize + gridSize/2; })
                        .attr("y", function(d) { return (d.yIndex - 1) * gridSize + gridSize/2; })
                        .attr("rx", 0)
                        .attr("ry", 0)
                        .attr("width", 10)
                        .attr("height", 10)
                        .transition().duration(500).attr("x", function(d) { return (d.xIndex - 1) * gridSize; }).attr("y", function(d) { return (d.yIndex - 1) * gridSize; }).attr("width", gridSize).attr("height", gridSize);
                } else {
                    if (angular.isUndefined(data)){
                        return;
                    }

                    iElement[0].innerHTML="";
                    gridSize = Math.floor(width / data.totalRow);

                    var legendElementWidth = gridSize*3;
                    var num = gridSize*(data.yDataList.length);
                    
                    while (num > (height-margin.top-margin.bottom)){
                        gridSize = gridSize-5;
                        num = gridSize*(data.yDataList.length);
                    }

                    height = gridSize * data.yDataList.length;
                  
                    var min = d3.min(data.value, function (d) {
                        return d.amount === undefined?0:d.amount;
                    });
                    var max = d3.max(data.value, function (d) {
                        return d.amount === undefined?0:d.amount;
                    });
                    var hasNegativeNumber = (min < 0 )? true : false;
                    var colorScale;
                    if (DateModel.getCompareFlag() && ($scope.compareValue !== "compareAbsoluteValue") && hasNegativeNumber ) {
                        colorScale = d3.scale.quantile()
                            .domain([min, 0, max])
                            .range(compareColors);
                    }
                    else {
                        var mean = d3.sum(data) / data.length;
                        colorScale = d3.scale.quantile()
                            .domain([min, mean, max])
                            .range(colors);
                    }


                    var svg = d3.select(iElement[0]).append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    var maxYLabel = false;

                    yLabels = svg.selectAll(".yLabel")
                        .data(data.yDataList)
                        .enter().append("text")
                        .text(function(d) {
                            if (!d){
                                d = "undefined";
                            }
                            if (d.length > 20){
                                maxYLabel = true;
                                return d.slice(0,20)+"...";
                            }
                            return d;
                        })
                        .attr("x", 10)
                        .attr("y", function (d, i) { return i * gridSize; })
                        .style("text-anchor", "end")
                        .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
                        .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "yLabel mono axis axis-workweek" : "yLabel mono axis"); });

                    xLabels = svg.selectAll(".xLabel")
                        .data(data.xDataList)
                        .enter().append("text")
                        .text(function(d) {
                            if (!d){
                                d = "undefined";
                            }
                            if (d.length > 8){
                                return d.slice(0,8)+"..";
                            }
                            return d;
                        })
                        .style("text-anchor", "end")
                        .attr("x", function(d, i) { return (i * gridSize*0.71); })
                        .attr("y", function(d, i) { return (i * gridSize*0.71); })
                      
                        .attr("transform", "translate(" + (gridSize / 2) +","+(height+10)+") rotate(-45)" )
                        .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "xLabel mono axis axis-worktime" : "xLabel mono axis"); });


                    firstDimensionLabel = svg.selectAll(".first-dimension-label").data([data.firstDimensionLabel])
                        .enter().append("text")
                        .text(data.firstDimensionLabel)
                        .attr("text-anchor", "middle")
                        .attr("style","font-size:14px")
                        .attr("transform","rotate(-90)")
                        .attr("y", maxYLabel? -150 : -120 )
                        .attr("x", -gridSize * data.yDataList.length / 2);


                    secondDimensionLabel = svg.selectAll(".second-dimension-label").data([data.secondDimensionLabel])
                        .enter().append("text")
                        .text(function(d){return d;})
                        .attr("text-anchor", "middle")
                        .attr("style","font-size:14px")
                        .attr("y", height+70)
                        .attr("x", gridSize * data.xDataList.length / 2);


                    var compareOption = "";
                    if (DateModel.getCompareFlag() && ($scope.compareValue === "comparePercentage")  ) {
                        compareOption="_p";
                    }


                    var tip = d3.tip()
                        .attr("class", "nvtooltip")
                        .offset([-10, 0])
                        .html(function(d) {
                            return "<p>"+ data.xDataList[d.xIndex-1] + "<br/>"+
                            $scope.$parent.metricsCollection.findMetricById(chartModel.getMetric()).getName()+ DateModel.getCompareValueObject(2).label +": " +
                            dataFormattingService.format(chartModel.getMetric() + compareOption, d.amount, $Attrs.chartCurrency) + "</p>";
                        });
                    svg.call(tip);

                    heatMap = svg.selectAll(".bucket")
                        .data(data.value)
                        .enter().append("rect")
                        .attr("x", function(d) { return (d.xIndex - 1) * gridSize + gridSize/2; })
                        .attr("y", function(d) { return (d.yIndex - 1) * gridSize + gridSize/2; })
                        .attr("rx", 0)
                        .attr("ry", 0)

                        .on("mouseover", function(d){
                            tip.show(d);
                            //TODO add a proper class for the highlighted bucket
                            //d3.select(this).classed("cell-hover",true);
                            d3.selectAll(".yLabel").classed("text-highlight",function(c,ci){ return ci === (d.yIndex-1);});
                            d3.selectAll(".xLabel").classed("text-highlight",function(c,ci){ return ci === (d.xIndex-1);});
                        })
                     
                        .on("mouseout", tip.hide,function(d){
                            //TODO add a proper class for the highlighted bucket
                            //d3.select(this).classed("cell-hover",false);
                            d3.selectAll(".text-highlight").classed("text-highlight",false);
                        })
                       
                        .attr("class", function(d) {
                            if (dataFormattingService.numberFormat(chartModel.getMetric()+compareOption, d.amount, $Attrs.chartCurrency) === 0){
                                return "middleColor bucket bordered";
                            }

                            return colorScale(d.amount)+" bucket bordered";
                        })
                        .attr("width", 10)
                        .attr("height", 10)
                        .transition().duration(500).attr("width", gridSize).attr("height", gridSize).attr("x", function(d) { return (d.xIndex - 1) * gridSize + 10; }).attr("y", function(d) { return (d.yIndex - 1) * gridSize; });

                    heatMap.attr("title",function(d) { return d.amount; });

                    //heatmap chart legend
                    var legendBucketWidth,legendColor,legendRange;
                    if (DateModel.getCompareFlag() && ($scope.compareValue !== "compareAbsoluteValue") && hasNegativeNumber) {
                        legendBucketWidth = 45;
                        legendColor = compareColors;
                        legendRange = colorScale.quantiles();
                        legendRange.splice(8,0,0.001);
                    }
                    else {
                        legendBucketWidth = 60;
                        legendColor = colors;
                        legendRange  = [0].concat(colorScale.quantiles());
                    }
                    

                    var legend = svg.selectAll(".legend")
                        .data(legendRange, function(d) {  return d; })
                        .enter().append("g")
                        .attr("class", "legend");

                    legend.append("rect")
                        .attr("x", function(d, i) { return legendBucketWidth * i; })
                        .attr("y", height+90)
                        .attr("width", legendBucketWidth)
                        .attr("height", 18)
                        .attr("class", function(d, i) { return legendColor[i]; });

                    legend.append("text")
                        .attr("class", "mono")
                        .attr("style","fill: #888888;font-size:10px")
                        .text(function(d) {
                            var operation = ">";
                            if (DateModel.getCompareFlag()){
                                operation = (d>0 )? ">":"<";
                            }
                            return operation+dataFormattingService.format(chartModel.getMetric()+compareOption, d, $Attrs.chartCurrency);
                        })
                        .attr("x", function(d, i) { return legendBucketWidth * i; })
                        .attr("y", height+120);
                }
            };

            $scope.$watch(function () {
                return [$Attrs.data, $Attrs.width];
            }, action, true);

        }
    };
}]);