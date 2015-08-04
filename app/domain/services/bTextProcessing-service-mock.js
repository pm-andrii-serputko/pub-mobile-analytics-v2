(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.dao")
        .run(["$httpBackend", "endpoints", barzerDaoMock]);

    function barzerDaoMock ($httpBackend, endpoints) {
        var response =  {
            d:
            [
                "siteId"
            ],
            
            m:
            [
                "revenue",
                "ecpm",
                "paidImpressions"
            ],
            f:
            [
                [
                    "t",
                    "revenue",
                    "t",
                    "10",
                    null,
                    null,
                    null
                ]
            ]
        };
        $httpBackend.whenGET(endpoints.bTextProcessing+"\/user?nlpString=site").respond(response);
    }
}).call(this, angular);