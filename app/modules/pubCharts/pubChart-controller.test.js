/*global describe, it, beforeEach, expect, inject*/
/*jshint expr: true */
(function () {
    "use strict";

    describe("Controller: pubChart", function () {

        beforeEach(module("pubSlicerApp"));
        beforeEach(module("modules/pubCharts/pubChart-directive.html"));
        beforeEach(module("modules/pubNotifications/toast.html"));
        var service, http;

        beforeEach(inject(function (DateModel, $compile, $rootScope, $httpBackend, pubAnalyticService, historicApiService ,$http) {
            this.DateModel = DateModel;
            this.$http = $http;
            http= $http;

            pubAnalyticService.fetch();
            service = historicApiService;

            //Fake fetch chart data function to replace the same function in historic api service
            //detour to fetch mock data without restrictions and validations .
            service.fetchRealChartData = function (id,chartType) {
                var params, config, url;

                if (chartType=== "linechart"){
                    url ="api/v1/analytics/data/line/publisher/31445";
                }
                else if (chartType === "heatmap"){
                    url ="api/v1/analytics/data/heatmap/publisher/31445";
                }
                else {
                    url ="api/v1/analytics/data/bar/publisher/31445";
                }

                params = {
                        fromDate: "2344",
                        toDate: "2434",
                        dateUnit: 534,
                        metrics: 55,
                        dimensions: 123,
                        pageNumber: 2555 ,
                        sort: 123,
                        pageSize: 133 ,
                        filters:"faksjf=sakdjksdj"
                    };

                config = {
                    method: "GET",
                    url: url,
                    cache: false,
                    params: params
                };

                return http(config);

            };
            $httpBackend.whenPOST("api/v1/analytics/displayvalue").respond([]);
            this.$httpBackend = $httpBackend;
            $httpBackend.flush();
        }));

        beforeEach(inject(function ($compile, $rootScope, $controller, chartModel) {
            this.$compile = $compile;
            this.chartModel = chartModel;
            this.$scope = $rootScope.$new();

            this.chartModel.setMetric("revenue");


            this.$rootScope = $rootScope;

            this.$scope.slicerData = {};
            this.$scope.slicerData.rows = [];
            this.DateModel.setCompareFlag(false);
            this.controller = $controller("pubChartCtrl", {
                $scope: this.$scope
            });

            this.element = angular.element("<pub-chart></pub-chart>");
            $compile(this.element)(this.$scope);
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

        it("testing default line chart with compare", function () {
            this.$scope.slicerData.rows = [];

            this.$scope.compareValue = "compareAbsoluteValue";
            this.DateModel.setCompareFlag(true);
            this.$scope.selectedChart = "linechart";
            this.$scope.updateDefaultChart();

            this.$httpBackend.flush();
            expect(this.$scope.dataObject.length).to.equal(2);
        });



        it("testing default line chart without compare", function () {
            this.$scope.selectedChart = "linechart";

            this.$scope.updateDefaultChart();
            this.$httpBackend.flush();
            expect(this.$scope.dataObject.length).to.equal(3);
        });
        it("testing default bar chart with compare", function () {


            this.$scope.compareValue = "compareAbsoluteValue";
            this.DateModel.setCompareFlag(true);
            this.$scope.selectedChart = "barchart";
            this.$scope.updateDefaultChart();

            this.$httpBackend.flush();
            expect(this.$scope.dataObject.length).to.equal(2);
        });


        it("testing default bar chart without compare", function () {

            this.$scope.selectedChart = "barchart";

            this.$scope.updateDefaultChart();
            this.$httpBackend.flush();
            expect(this.$scope.dataObject.length).to.equal(2);
        });


        it("testing default pie chart", function () {

            this.$scope.selectedChart = "piechart";

            this.$scope.updateDefaultChart();
            this.$httpBackend.flush();
            expect(this.$scope.dataObject.length).to.equal(8);
        });

        it("testing single line chart with compare", function () {
            this.$scope.compareValue = "compareAbsoluteValue";
            this.DateModel.setCompareFlag(true);
            var dimension = {};
            this.$scope.chartDimensionIdCollection =[];
            dimension.id =12345;
            dimension.value = 54321;
            this.$scope.dataObject = [{key:54321}];

            
            this.$scope.addChart(dimension, "linechart",true);

            this.$httpBackend.flush();
            expect(this.$scope.dataObject.length).to.equal(2);
             
        });

        it("testing single line chart without compare", function () {
            var dimension = {};
            this.$scope.chartDimensionIdCollection =[];
            dimension.id =12345;
            dimension.value = 54321;
            this.$scope.dataObject = [{key:54321}];

            
            this.$scope.addChart(dimension, "linechart",true);

            this.$httpBackend.flush();
            expect(this.$scope.dataObject.length).to.equal(2);

        });

        it("testing single bar chart with compareAbsoluteValue ", function () {
            this.$scope.compareValue = "compareAbsoluteValue";
            this.DateModel.setCompareFlag(true);
            var dimension = {};
            this.$scope.chartDimensionIdCollection =[];
            dimension.id =12345;
            dimension.value = 54321;
            this.$scope.dataObject = [{key:54321, values: [0 ,1]}];

            this.$scope.addChart(dimension, "barchart",true);
            expect(this.$scope.dataObject.length).to.equal(1);
             
        });

        it("testing single bar chart with other compare option ", function () {
            this.$scope.compareValue = "percentage";
            this.DateModel.setCompareFlag(true);
            var dimension = {};
            this.$scope.chartDimensionIdCollection =[];
            dimension.id =12345;
            dimension.value = 54321;
            this.$scope.dataObject = [{key:54321, values: [0 ,1]}];

            
            this.$scope.addChart(dimension, "barchart",true);

            expect(this.$scope.dataObject.length).to.equal(1);
             
        });

        it("testing single bar chart without compare", function () {
            var dimension = {};
            this.$scope.chartDimensionIdCollection =[];
            dimension.id =12345;
            dimension.value = 54321;
            this.$scope.dataObject = [{key:54321, values: [0 ,1] }];

            
            this.$scope.addChart(dimension, "barchart",true);

            //this.$httpBackend.flush();
            expect(this.$scope.dataObject.length).to.equal(1);

        });

        it("testing single piechart chart without compare", function () {
            var dimension = {};
            this.$scope.chartDimensionIdCollection =[];
            dimension.id =12345;
            dimension.value = 54321;
            this.$scope.dataObject = [{key:54321}];

            
            this.$scope.addChart(dimension, "piechart",true);

            this.$httpBackend.flush();
            expect(this.$scope.dataObject.length).to.equal(2);

        });



        it("small chart config function testing", function () {
            this.$scope.compareValue = "comparePercentage";
            this.DateModel.setCompareFlag(true);
            var tempList = [1,2,3,4,5];
            //test lineXfunction
            var tempFunc = this.$scope.lineXfunction();
            expect(tempFunc(tempList)).to.equal(1);

            //test lineYfunction
            tempFunc = this.$scope.lineYfunction();
            expect(tempFunc(tempList)).to.equal(2);


            //test lineXaxisFunction


            tempFunc = this.$scope.lineXaxisFunction();


            //TODO add these back later
            // this.$scope.timseriesBy = "hour";
            // expect(tempFunc(1)).to.equal("");


            // this.chartModel.setTimeList([new Date(2014,10,5,13)]);
            // expect(tempFunc(0)).to.equal("1PM");


            // this.$scope.timseriesBy = "date";
            // expect(tempFunc(0)).to.equal("11/05/2014");
            // expect(tempFunc(1.2)).to.equal("");


            // //test compareLineXaxisFunction
            // tempFunc = this.$scope.compareLineXaxisFunction();
            // this.$scope.timseriesBy = "date";
            // expect(tempFunc(1)).to.equal("Day 1");

            // this.$scope.timseriesBy = "hour";
            // expect(tempFunc(2)).to.equal("Hour 2");
            // expect(tempFunc(2.4)).to.equal("");
            

            // //test yAxisTickFormatFunction
            // tempFunc = this.$scope.yAxisTickFormatFunction("USD");
            // expect(tempFunc(null)).to.equal("CHART.NO_DATA");
            // expect(tempFunc(10000)).to.equal("$10,000");
            // expect(tempFunc(1000000)).to.equal("$1,000k");
            // expect(tempFunc(100000000000)).to.equal("$100,000m");
            // expect(tempFunc(10000000000000)).to.equal("$10,000b");
            // this.$scope.isCompare = true;
            // this.$scope.compareValue === "comparePercentage";
            // expect(tempFunc(53)).to.equal("53%");


            // //test lineBarColorFunction
            // tempFunc = this.$scope.lineBarColorFunction();
            // expect(tempFunc(12,0)).to.equal("#8bcb5d");

            // //test compareLineColorFunction
            // tempFunc = this.$scope.compareLineColorFunction();
            // expect(tempFunc(12,0)).to.equal("#8bcb5d");

            // //test barCompareColorFunction
            // tempFunc = this.$scope.barCompareColorFunction();
            // expect(tempFunc(12,0)).to.equal("#8bcb5d");

            // tempFunc = this.$scope.lineToolTipContentFunction();
            // var tempDate = new Date("11/4/2015");
            // this.$scope.timseriesBy = "date";
            // expect(tempFunc(12,tempDate,"revenue")).to.equal("<p>Wednesday, Nov 04, 2015<br/>Revenue: revenue</p>");
            
        });
    });
}).call(this);
