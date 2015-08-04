(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.dao")
        .factory("benchmarkAdvertiserMock", benchmarkAdvertiserMock)
        .factory("benchmarkAdvertiserByPublisherMock", benchmarkAdvertiserByPublisherMock)
        .factory("benchmarkAdvertiserCategoryMock", benchmarkAdvertiserCategoryMock)
        .run(["$httpBackend", "endpoints", "benchmarkAdvertiserMock", "benchmarkAdvertiserByPublisherMock", "benchmarkAdvertiserCategoryMock", runBlock]);

    function runBlock ($httpBackend, endpoints, benchmarkAdvertiserMock, benchmarkAdvertiserByPublisherMock, benchmarkAdvertiserCategoryMock) {
        $httpBackend.whenGET(/^api\/v1\/analytics\/benchmark\/publisher\/31445\?dateUnit=date&dimensions=advertiserId&\w*/).respond(benchmarkAdvertiserMock);
        $httpBackend.whenGET(/^api\/v1\/analytics\/benchmark\/publisher\/31445\?dateUnit=date&dimensions=advertiserId,pubId&\w*/).respond(benchmarkAdvertiserByPublisherMock);
        $httpBackend.whenGET(/^api\/v1\/analytics\/benchmark\/publisher\/31445\?dateUnit=date&dimensions=advertiserCategoryId&\w*/).respond(benchmarkAdvertiserCategoryMock);
        $httpBackend.whenGET(/^api\/v1\/analytics\/benchmark\w*/).respond(benchmarkAdvertiserMock);
    }

    function benchmarkAdvertiserMock () {
        return {
            "columns": [
                "advertiserId",
                "ecpm",
                "avgCompEcpm",
                "maxCompEcpm",
                "minCompEcpm",
                "sow",
                "avgCompSow",
                "maxCompSow",
                "minCompSow",
                "sov",
                "avgCompSov",
                "maxCompSov",
                "minCompSov"
            ],
            "rows": [
                [
                    "36167",
                    1.780805,
                    0.535945857,
                    1.248967,
                    0,
                    99.845343156,
                    0.022093835,
                    0.115930798,
                    0,
                    99.53936164,
                    0.06580548,
                    0.2957775,
                    0
                ],
                [
                    "1575",
                    1.883248,
                    0.617755,
                    1.137605,
                    0,
                    99.904461992,
                    0.015923001,
                    0.08790806,
                    0,
                    99.759499029,
                    0.040083495,
                    0.217753714,
                    0
                ],
                [
                    "7921",
                    1.847614,
                    0.8121395,
                    1.169598,
                    0.482705,
                    99.99115043,
                    0.001474928,
                    0.007936213,
                    0.00002414,
                    99.981968703,
                    0.003005216,
                    0.014926471,
                    0.000038837
                ],
                [
                    "1170",
                    2.108521,
                    1.068507833,
                    1.577466,
                    0.623384,
                    99.99350971,
                    0.001081715,
                    0.006159702,
                    0.000004248,
                    99.991013903,
                    0.001497683,
                    0.008233163,
                    0.000009821
                ],
                [
                    "3349",
                    2.15092,
                    0.673384667,
                    0.99861,
                    0.189771,
                    99.971484851,
                    0.004752525,
                    0.026327101,
                    0.000071654,
                    99.929412432,
                    0.011764595,
                    0.056682469,
                    0.000168249
                ],
                [
                    "1675",
                    2.295439,
                    0.782919,
                    1.956352,
                    0,
                    99.998098837,
                    0.00031686,
                    0.001365644,
                    0,
                    99.992274201,
                    0.001287633,
                    0.004641527,
                    0
                ],
                [
                    "3395",
                    2.522685,
                    0.733137833,
                    1.241724,
                    0.350308,
                    99.979414054,
                    0.003430991,
                    0.018006035,
                    0.000157716,
                    99.948491479,
                    0.008584754,
                    0.036569737,
                    0.000444733
                ],
                [
                    "42473",
                    3.339132,
                    0.662540833,
                    2.71163,
                    0.196991,
                    99.995958249,
                    0.000673625,
                    0.003429226,
                    9.27e-7,
                    99.989641357,
                    0.001726441,
                    0.004646493,
                    0.000011459
                ],
                [
                    "64093",
                    2.835953,
                    0.526969333,
                    0.91756,
                    0.305615,
                    99.978633524,
                    0.003561079,
                    0.01515966,
                    0.000181199,
                    99.82384352,
                    0.029359413,
                    0.137060646,
                    0.000559178
                ],
                [
                    "1931",
                    2.333406,
                    0.750881,
                    1.586004,
                    0,
                    97.298926215,
                    0.385867684,
                    2.54152029,
                    0,
                    95.506893715,
                    0.641872326,
                    3.670340558,
                    0
                ]
            ],
            "displayValue": {
                "advertiserId": {
                    "1170": "GEICO Insurance",
                    "1575": "AT&T",
                    "1675": "Capital One",
                    "1931": "google",
                    "3349": "Verizon",
                    "3395": "staples",
                    "7921": "Allstate Insurance Company",
                    "36167": "Comcast Corporation",
                    "42473": "Kelloggs",
                    "64093": "American Express Travel Related Services Company Inc"
                }
            },
            "currency": "USD",
            "alert": "Currency rate for EUR is not available, report is using USD",
            "dataFreshness": {
                "dataFreshnessHour": "2014-11-26T07",
                "timeZone": "PST"
            }
        };
    }

    function benchmarkAdvertiserByPublisherMock () {
        return {
            "columns": [
                "advertiserId",
                "pubId",
                "ecpm",
                "sow",
                "sov"
            ],
            "rows": [
                [
                    "36167",
                    "31445",
                    1.780805,
                    99.845343156,
                    99.53936164
                ],
                [
                    "36167",
                    "39741",
                    null,
                    null,
                    null
                ],
                [
                    "36167",
                    "41597",
                    0.408498,
                    0.03313961,
                    0.144026076
                ],
                [
                    "36167",
                    "43042",
                    0.264883,
                    0.001181937,
                    0.007921788
                ],
                [
                    "36167",
                    "43044",
                    0.456238,
                    0.001888112,
                    0.007347165
                ],
                [
                    "36167",
                    "40989",
                    0.677182,
                    0.001657119,
                    0.004344422
                ],
                [
                    "36167",
                    "40966",
                    0.695853,
                    0.115930798,
                    0.2957775
                ],
                [
                    "36167",
                    "49353",
                    1.248967,
                    0.000859268,
                    0.001221409
                ],
                [
                    "36167",
                    "51107",
                    0,
                    0,
                    0
                ],
                [
                    "1170",
                    "31445",
                    2.108521,
                    99.99350971,
                    99.991013903
                ],
                [
                    "1170",
                    "39741",
                    null,
                    null,
                    null
                ],
                [
                    "1170",
                    "41597",
                    1.115598,
                    0.000180137,
                    0.000340457
                ],
                [
                    "1170",
                    "43042",
                    0.826605,
                    0.000041068,
                    0.000104756
                ],
                [
                    "1170",
                    "43044",
                    0.623384,
                    0.000073558,
                    0.000248795
                ],
                [
                    "1170",
                    "40989",
                    1.355881,
                    0.000031577,
                    0.000049104
                ],
                [
                    "1170",
                    "40966",
                    1.577466,
                    0.006159702,
                    0.008233163
                ],
                [
                    "1170",
                    "49353",
                    0.912113,
                    0.000004248,
                    0.000009821
                ],
                [
                    "1170",
                    "51107",
                    null,
                    null,
                    null
                ]
            ],
            "displayValue": {
                "pubId": {
                    "31445": "eBay, Inc.",
                    "39741": "eBay Ltd UK",
                    "40966": "eBay Classifieds",
                    "40989": "eBay Belgium",
                    "41597": "eBay Advertising Group Deutschland",
                    "43042": "eBay UK Limited",
                    "43044": "eBay UK Limited",
                    "49353": "eBay India Private Limited",
                    "51107": "eBay UK Limited"
                },
                "advertiserId": {
                    "1170": "GEICO Insurance",
                    "36167": "Comcast Corporation"
                }
            },
            "currency": "USD",
            "alert": "Currency rate for EUR is not available, report is using USD",
            "dataFreshness": {
                "dataFreshnessHour": "2014-11-26T07",
                "timeZone": "PST"
            }
        };
    }

    function benchmarkAdvertiserCategoryMock () {
        return {
            "columns": [
                "advertiserCategoryId",
                "ecpm",
                "avgCompEcpm",
                "maxCompEcpm",
                "minCompEcpm",
                "sow",
                "avgCompSow",
                "maxCompSow",
                "minCompSow",
                "sov",
                "avgCompSov",
                "maxCompSov",
                "minCompSov"
            ],
            "rows": [
                [
                    "2",
                    2.219272,
                    0.377299286,
                    0.866719,
                    0.174228,
                    99.164853667,
                    0.119306619,
                    0.420534242,
                    0.000014235,
                    94.323469557,
                    0.81093292,
                    2.501395558,
                    0.00017247
                ],
                [
                    "18",
                    1.990795,
                    0.415866143,
                    0.775366,
                    0.146459,
                    97.584037559,
                    0.345137492,
                    2.054513267,
                    0.000004646,
                    88.142408702,
                    1.693941614,
                    8.504806095,
                    0.000043974
                ],
                [
                    "3",
                    2.08767,
                    0.345507857,
                    0.703437,
                    0.137009,
                    98.252694403,
                    0.249615085,
                    1.354214954,
                    0.00000422,
                    90.840051647,
                    1.30856405,
                    6.386632938,
                    0.000059446
                ],
                [
                    "10",
                    2.10114,
                    0.429992571,
                    0.820327,
                    0.102799,
                    98.403472037,
                    0.228075423,
                    0.769111035,
                    0.000001473,
                    90.448803757,
                    1.364456606,
                    4.373088989,
                    0.000027673
                ],
                [
                    "27",
                    1.80433,
                    0.326606143,
                    0.590341,
                    0.079727,
                    97.192263943,
                    0.401105151,
                    1.318850039,
                    7e-8,
                    74.495860789,
                    3.643448459,
                    20.416702903,
                    0.000001208
                ],
                [
                    "40",
                    1.836108,
                    0.377182429,
                    0.809896,
                    0.090509,
                    99.85678139,
                    0.020459801,
                    0.049712969,
                    0.000001566,
                    99.194927792,
                    0.115010315,
                    0.296813469,
                    0.000031564
                ],
                [
                    "22",
                    1.875371,
                    0.361749286,
                    0.756023,
                    0.151873,
                    94.586277177,
                    0.773388975,
                    3.029452292,
                    0.000005288,
                    71.332968042,
                    4.09529028,
                    14.75234404,
                    0.000049245
                ],
                [
                    "21",
                    2.108038,
                    0.341473286,
                    0.680468,
                    0.087904,
                    97.716003514,
                    0.326285212,
                    1.310250971,
                    2.33e-7,
                    86.014003055,
                    1.997999564,
                    7.153719221,
                    0.00000491
                ],
                [
                    "24",
                    1.821233,
                    0.388471,
                    0.831364,
                    0.112884,
                    91.081295249,
                    1.274100679,
                    7.740896714,
                    0.000002235,
                    72.117399277,
                    3.983228675,
                    19.805453895,
                    0.000028549
                ],
                [
                    "9",
                    2.36005,
                    0.417623286,
                    0.820354,
                    0.08186,
                    93.292657232,
                    0.958191824,
                    6.370327034,
                    0.000002957,
                    70.486010097,
                    4.216284272,
                    26.081545426,
                    0.00006441
                ]
            ],
            "displayValue": {
                "advertiserCategoryId": {
                    "2": "Auto",
                    "3": "Consumer Products & Goods",
                    "9": "Fashion",
                    "10": "Finance",
                    "18": "Shopping",
                    "21": "Technology",
                    "22": "Telecommunications",
                    "24": "Travel",
                    "27": "Consumer Services",
                    "40": "Insurance"
                }
            },
            "currency": "USD",
            "alert": "Currency rate for EUR is not available, report is using USD",
            "dataFreshness": {
                "dataFreshnessHour": "2014-11-26T07",
                "timeZone": "PST"
            }
        };
    }

}).call(this, angular);