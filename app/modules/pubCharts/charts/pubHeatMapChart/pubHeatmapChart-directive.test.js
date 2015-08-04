/*global describe, beforeEach,inject */
"use strict";

describe("Directive: pubHeatmapChartDirective", function () {
    var element;
    var $compile,
        $rootScope;

  // load the directive"s module
    beforeEach(module("pubSlicerApp"));

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_.$new();
        $rootScope.heatdataObject = {
                "totalRow": 8,
                "yDataList": ["Turn", "MM"],
                "xDataList": ["Vivaki", "Xaxis", "Cadreon", "Accuen", "Affiperfr", "Kepler", "Merkle", "Amnet"],
                "value" :  [
                    { "yIndex": 1, "xIndex": 1, "amount": 9},
                    { "yIndex": 1, "xIndex": 2, "amount": 3},
                    { "yIndex": 1, "xIndex": 3, "amount": 1},
                    { "yIndex": 1, "xIndex": 4, "amount": 2},
                    { "yIndex": 1, "xIndex": 5, "amount": 0},
                    { "yIndex": 1, "xIndex": 6, "amount": 1},
                    { "yIndex": 1, "xIndex": 7, "amount": 2},
                    { "yIndex": 1, "xIndex": 8, "amount": 1},

                    { "yIndex": 2, "xIndex": 1, "amount": 0},
                    { "yIndex": 2, "xIndex": 2, "amount": 0},
                    { "yIndex": 2, "xIndex": 3, "amount": 1},
                    { "yIndex": 2, "xIndex": 4, "amount": 0},
                    { "yIndex": 2, "xIndex": 5, "amount": 2},
                    { "yIndex": 2, "xIndex": 6, "amount": 0},
                    { "yIndex": 2, "xIndex": 7, "amount": 1},
                    { "yIndex": 2, "xIndex": 8, "amount": 1}
                ]
            };

        element = angular.element("<pub-heatmap-chart id='heatmap' width='800' ></pub-heatmap-chart>");
     
        $compile(element)($rootScope);
        $rootScope.$digest();
    }));

    // it("Should have 800px width", inject(function () {
    //     expect(element.attr("width")).to.equal("800");
    // }));

    // it("Should has the same ID of the directive", inject(function () {
    //     expect(element.attr("id")).to.equal("heatmap");
    // }));

    // it("Should made a main svg inside of pub-heatmap from D3", inject(function () {
    //     expect(element.children()[0].tagName).to.equal("svg");
    // }));

    // it("SVG should has correct number of xLabel", inject(function () {
    //     expect(calculateTotalLabels("xLabel mono axis")).to.equal($rootScope.heatdataObject.xDataList.length);
    // }));

    // it("SVG should has correct number of yLabel", inject(function () {
    //     expect(calculateTotalLabels("yLabel mono axis")).to.equal($rootScope.heatdataObject.yDataList.length);
    // }));

    // it("SVG should has correct number of Rects", inject(function () {
    //     expect(element.find("rect").length).to.equal($rootScope.heatdataObject.value.length);
    // }));

    // function calculateTotalLabels(name){
    //     var graphList = element.find("text");
    //     var totalGraphs = 0;
    //     angular.forEach(graphList, function(graph) {
    //         if (graph.className.baseVal.indexOf(name) >= 0) {
    //             totalGraphs++;
    //         }
    //     });
    //     return totalGraphs;
    // }
});
