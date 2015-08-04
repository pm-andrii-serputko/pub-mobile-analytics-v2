(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.dao")
        .factory("channelValuesMock", channelValuesMock)
        .factory("platformValuesMock", platformValuesMock)
        .factory("adFormatValuesMock", adFormatValuesMock)
        .factory("adSizeValuesMock", adSizeValuesMock)
        .factory("advertiserCategoryValuesMock", advertiserCategoryValuesMock)
        .factory("advertiserValuesFilteredByAlcoholMock", advertiserValuesFilteredByAlcoholMock)
        .run(["$httpBackend", "endpoints", "channelValuesMock", "platformValuesMock", "adFormatValuesMock", "adSizeValuesMock", "advertiserCategoryValuesMock", "advertiserValuesFilteredByAlcoholMock", measureValuesMockE2E]);

    /**
     * Set up fake Backend.
     */
    function measureValuesMockE2E ($httpBackend, endpoints, channelValuesMock, platformValuesMock, adFormatValuesMock, adSizeValuesMock, advertiserCategoryValuesMock, advertiserValuesFilteredByAlcoholMock) {
        $httpBackend.whenGET(endpoints.measureValues + "?dimensions=channelId").respond(channelValuesMock);
        $httpBackend.whenGET(endpoints.measureValues + "?dimensions=channelId&filters=").respond(channelValuesMock);

        $httpBackend.whenGET(endpoints.measureValues + "?dimensions=platformId").respond(platformValuesMock);
        $httpBackend.whenGET(endpoints.measureValues + "?dimensions=platformId&filters=").respond(platformValuesMock);

        $httpBackend.whenGET(endpoints.measureValues + "?dimensions=adFormatId").respond(adFormatValuesMock);
        $httpBackend.whenGET(endpoints.measureValues + "?dimensions=adFormatId&filters=").respond(adFormatValuesMock);

        $httpBackend.whenGET(endpoints.measureValues + "?dimensions=adSizeId").respond(adSizeValuesMock);
        $httpBackend.whenGET(endpoints.measureValues + "?dimensions=adSizeId&filters=").respond(adSizeValuesMock);

        $httpBackend.whenGET(endpoints.measureValues + "?dimensions=advertiserCategoryId").respond(advertiserCategoryValuesMock);
        $httpBackend.whenGET(endpoints.measureValues + "?dimensions=advertiserCategoryId&filters=").respond(advertiserCategoryValuesMock);

        $httpBackend.whenGET(endpoints.measureValues + "?dimensions=advertiserId&filters=advertiserCategoryId%2520eq%25201").respond(advertiserValuesFilteredByAlcoholMock);
        
    }

    /** Mocked data of channel values */
    function channelValuesMock () {
        return [
            {
                "0": "ALL"
            },
            {
                "1": "PMP"
            },
            {
                "2": "Spot Buys"
            },
            {
                "3": "Open Exchange"
            },
            {
                "4": "Ad Network"
            }
        ];
    }

    /** Mocked data of platform values */
    function platformValuesMock () {
        return [
            {
                "1": "Web"
            },
            {
                "2": "Mobile Web"
            },
            {
                "3": "NotDefined"
            },
            {
                "4": "Mobile App IOS"
            },
            {
                "5": "Mobile App Android"
            }
        ];
    }

    /** Mocked data of ad format values */
    function adFormatValuesMock () {
        return [
            {
                "1": "Display"
            },
            {
                "2": "Video"
            }
        ];
    }

    /** Mocked data of ad size values */
    function adSizeValuesMock () {
        return [
            {
                "1": "336x280 (Large Rectangle)"
            },
            {
                "2": "250x250 (Square)"
            },
            {
                "3": "234x60 (Half Banner)"
            },
            {
                "4": "180x150 (Small Rectangle)"
            },
            {
                "5": "125x125 (Button)"
            },
            {
                "6": "120x240 (Vertical Banner)"
            },
            {
                "7": "728x90 (Leaderboard)"
            },
            {
                "8": "468x60 (Banner)"
            },
            {
                "9": "300x250 (Sidekick)"
            },
            {
                "10": "160x600 (Wide Skyscraper)"
            },
            {
                "11": "120x600 (Skyscraper)"
            },
            {
                "12": "200x200 (Small Square)"
            },
            {
                "13": "428x90 (Unsupported 1)"
            },
            {
                "14": "160x125 (Unsupported 2)"
            },
            {
                "15": "0x0 (UNSUPPORTED AD SIZE)"
            },
            {
                "16": "300x100"
            },
            {
                "17": "616x70"
            },
            {
                "18": "0x0 (Inline size[0x0])"
            },
            {
                "19": "1x1 (Pop-Under [1x1])"
            },
            {
                "20": "600x800 (800x600)"
            },
            {
                "21": "980x120"
            },
            {
                "22": "440x220"
            },
            {
                "23": "440x250"
            },
            {
                "24": "460x200"
            },
            {
                "25": "120x60"
            },
            {
                "26": "300x600 (Filmstrip)"
            },
            {
                "27": "750x200"
            },
            {
                "28": "120x120"
            },
            {
                "29": "425x600"
            },
            {
                "30": "300x50 (Mobile - 300x50)"
            },
            {
                "31": "320x50 (Mobile - 320x50)"
            },
            {
                "32": "970x250 (Billboard)"
            },
            {
                "33": "970x90 (Pushdown)"
            },
            {
                "35": "160x150"
            },
            {
                "36": "221x90"
            },
            {
                "37": "300x75 (Mobile - 300x75)"
            },
            {
                "38": "216x54 (Mobile - 216x54)"
            },
            {
                "39": "216x36 (Mobile - 216x36)"
            },
            {
                "40": "168x42 (Mobile - 168x42)"
            },
            {
                "41": "168x28 (Mobile - 168x28)"
            },
            {
                "42": "120x30 (Mobile - 120x30)"
            },
            {
                "43": "120x20 (Mobile - 120x20)"
            },
            {
                "46": "756x260 (Pre-Roll Video - 756x260)"
            },
            {
                "47": "800x480 (Pre-Roll Video - 800x480)"
            },
            {
                "48": "480x32 (Mobile - 480x32)"
            },
            {
                "54": "320x48 (Mobile - 320x48)"
            },
            {
                "55": "320x53 (Mobile - 320x53)"
            },
            {
                "57": "480x80 (Mobile - 480x80)"
            },
            {
                "58": "80x12 (Mobile - 80x12)"
            },
            {
                "59": "80x15 (Mobile - 80x15)"
            },
            {
                "61": "1024x90 (Mobile - 1024x90)"
            },
            {
                "62": "200x600"
            },
            {
                "63": "60x425 (60x425 overlay/interstitial)"
            },
            {
                "64": "640x480 (640x480 VAST/VPAID Preroll)"
            },
            {
                "65": "990x100 (Leaderboard)"
            },
            {
                "66": "990x210 (Double Leaderboard)"
            },
            {
                "67": "480x300 (Wallpaper)"
            },
            {
                "68": "970x310 (Megaboard)"
            },
            {
                "69": "150x150"
            },
            {
                "70": "100x100"
            },
            {
                "71": "180x150 (Mobile - 180x150)"
            },
            {
                "72": "480x60 (Mobile - 480x60)"
            },
            {
                "73": "480x50 (Mobile - 480x50)"
            },
            {
                "74": "320x480 (Mobile - 320x480)"
            },
            {
                "75": "1024x768 (Mobile - 1024x768)"
            },
            {
                "76": "768x90 (Mobile - 768x90)"
            },
            {
                "77": "768x1024 (Mobile - 768x1024)"
            },
            {
                "78": "800x1280 (Mobile - 800x1280)"
            },
            {
                "79": "300x48 (Mobile - 300x48)"
            },
            {
                "80": "240x320 (240x320 - Mobile)"
            },
            {
                "81": "480x800 (480x800 - Mobile)"
            },
            {
                "82": "480x854 (480x854 - Mobile)"
            },
            {
                "83": "1536x256 (1536x256 - Mobile)"
            },
            {
                "84": "2560x256 (2560x256 - Mobile)"
            },
            {
                "85": "1280x800 (1280x800 - Mobile)"
            },
            {
                "86": "320x351 (320x351 - Mobile)"
            },
            {
                "87": "320x460 (320x460 - Mobile)"
            },
            {
                "88": "640x90 (640x90 - Mobile)"
            },
            {
                "89": "300x1050 (Portrait - 300x1050)"
            },
            {
                "90": "640x107 (640x107 - Mobile)"
            },
            {
                "91": "640x960 (640x960 - Mobile)"
            },
            {
                "92": "960x640 (960x640 - Mobile)"
            },
            {
                "93": "930x180"
            },
            {
                "94": "950x300"
            },
            {
                "95": "750x100"
            },
            {
                "96": "480x320 (480x320 - Mobile)"
            },
            {
                "97": "0x0 (Video N/A)"
            },
            {
                "98": "950x200 (950x200-Header Banner)"
            },
            {
                "99": "800x250 (Billboard)"
            },
            {
                "100": "346x60"
            },
            {
                "101": "290x456 (Double Page Spread)"
            },
            {
                "102": "970x30 (970 x 30 Sliding Billboard)"
            },
            {
                "103": "728x1024 (Mobile - 728x1024)"
            },
            {
                "104": "1024x728 (Mobile - 1024x728)"
            },
            {
                "105": "1800x1000 (Arch Ad Format)"
            },
            {
                "106": "230x600"
            },
            {
                "107": "975x300"
            },
            {
                "108": "480x250"
            },
            {
                "109": "250x360"
            },
            {
                "110": "980x240"
            },
            {
                "111": "980x150 (Super Leaderboard)"
            },
            {
                "112": "300x300 (Banner-300x300)"
            },
            {
                "113": "88x31 (Micro Bar-88x31)"
            },
            {
                "114": "745x100"
            },
            {
                "115": "970x210"
            },
            {
                "116": "600X120"
            },
            {
                "117": "975x100"
            },
            {
                "118": "750x300"
            },
            {
                "119": "640x100"
            },
            {
                "120": "900x300 (Billboard - 900x300)"
            },
            {
                "121": "467x120"
            },
            {
                "122": "970x100"
            },
            {
                "123": "550x480"
            },
            {
                "124": "320x80 (Mobile - 320x80)"
            },
            {
                "125": "320x160 (Mobile - 320x160)"
            },
            {
                "126": "320x320 (Mobile - 320x320)"
            },
            {
                "127": "250X800"
            },
            {
                "128": "988x320"
            },
            {
                "129": "468x240"
            },
            {
                "130": "620x249"
            },
            {
                "131": "370x370"
            },
            {
                "132": "930x600"
            },
            {
                "133": "970x66"
            },
            {
                "134": "1140x250"
            },
            {
                "135": "640x960"
            },
            {
                "136": "640x480"
            },
            {
                "137": "970x125"
            }
        ];
    }

    /** Mocked data of advertiser category values */
    function advertiserCategoryValuesMock () {
        return [
            {
                "1": "Alcohol"
            },
            {
                "2": "Auto"
            },
            {
                "31": "Consumer Packaged Goods"
            },
            {
                "3": "Consumer Products & Goods"
            },
            {
                "27": "Consumer Services"
            },
            {
                "4": "Cosmetic Procedures"
            },
            {
                "36": "Coupons & Deals"
            },
            {
                "5": "Dating/Personals"
            },
            {
                "6": "Drugs & Supplements"
            },
            {
                "7": "Education"
            },
            {
                "8": "Entertainment"
            },
            {
                "9": "Fashion"
            },
            {
                "10": "Finance"
            },
            {
                "28": "Gambling"
            },
            {
                "35": "Hospitals"
            },
            {
                "40": "Insurance"
            },
            {
                "38": "Job portals"
            },
            {
                "41": "Legal Services"
            },
            {
                "32": "Manufacturing"
            },
            {
                "11": "Military"
            },
            {
                "12": "News"
            },
            {
                "29": "Online Media Services"
            },
            {
                "39": "Personal Care Toiletries and Cosmetics"
            },
            {
                "37": "Pets"
            },
            {
                "13": "Politics"
            },
            {
                "14": "Public service announcements"
            },
            {
                "33": "Real Estate"
            },
            {
                "15": "Religion"
            },
            {
                "34": "Restaurants/ Fast food"
            },
            {
                "16": "Ringtones & Downloadable"
            },
            {
                "17": "Sexual & Reproductive Health"
            },
            {
                "18": "Shopping"
            },
            {
                "19": "Sports"
            },
            {
                "20": "Survey (includes IQ tests)"
            },
            {
                "21": "Technology"
            },
            {
                "22": "Telecommunications"
            },
            {
                "23": "Tobacco"
            },
            {
                "30": "Toys/Games"
            },
            {
                "24": "Travel"
            },
            {
                "43": "Uncategorized"
            },
            {
                "25": "Video Games (Casual & Online)"
            },
            {
                "26": "Weight Loss"
            }
        ];
    }

    /** Mocked data of advertiser values filtered by alcohol */
    function advertiserValuesFilteredByAlcoholMock () {
        return [
            {
                "2955": "Glenfiddich"
            },
            {
                "1495": "Heineken"
            },
            {
                "31": "Grants whiskey"
            },
            {
                "2613": "Oskar Blues Brewery"
            },
            {
                "172": "Flemings"
            }
        ];
    }

}).call(this, angular);