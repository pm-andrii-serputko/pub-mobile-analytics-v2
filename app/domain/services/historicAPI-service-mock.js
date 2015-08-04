(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.dao")
        .run(["$httpBackend",  chartDaoMock]);

    function chartDaoMock ($httpBackend) {
        var lineResponse =  [
            "item1",
            "item2"
        ];


        var barResponse =  {
            data: [
                "item1",
                "item2",
                "item3",
                "item4",
                "item5",
                "item6",
                "item7"
            ]
        };

        var heatResponse =  {
            currency: "USD",
            columns: [1,2,3,4,5,6],
            rows: [
                [1,2,3],
                [1,2,3],
                [1,2,3]
            ]
        };

        //TODO temp mock data for chart, need more for additional different scenarios

        $httpBackend.whenGET(/^api\/v1\/analytics\/data\/line\w*/).respond(lineResponse);
        $httpBackend.whenGET(/^api\/v1\/analytics\/data\/bar\w*/).respond(barResponse);
        $httpBackend.whenGET(/^api\/v1\/analytics\/data\/heatmap\w*/).respond(heatResponse);

    }
}).call(this, angular);