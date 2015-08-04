(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.dao")
        .run(["$httpBackend", "endpoints", analyticDaoMock]);

    function analyticDaoMock ($httpBackend, endpoints) {
        var response = {
            "publisherList": [
                31445
            ],
            "subTypes": [],
            "dspList": [],
            "buyerList": [],
            "userType": "publisher",
            "userAccessory": "internal",
            "locale": null,
            "timezone": "PST",
            "currency": "EUR",

            "email": "chris.schmidt@pubmatic.com",
            "firstName": "Jojy",
            "lastName": "Devasia",
            "realtimeConfiguration": {
                "dimensions": [
                    {
                        "apiName": "pubId",
                        "displayValue": "Publisher",
                        "apiGroupName": "buyer",
                        "groupDisplayValue": "Buyer"
                    },
                    {
                        "apiName": "siteId",
                        "displayValue": "Site",
                        "apiGroupName": "inventory",
                        "groupDisplayValue": "Inventory"
                    },
                    {
                        "apiName": "atdId",
                        "displayValue": "Buyer",
                        "apiGroupName": "buyer",
                        "groupDisplayValue": "Buyer"
                    },
                    {
                        "apiName": "dspId",
                        "displayValue": "DSP",
                        "apiGroupName": "buyer",
                        "groupDisplayValue": "Buyer"
                    },
                    {
                        "apiName": "channelId",
                        "displayValue": "Channel",
                        "apiGroupName": "general",
                        "groupDisplayValue": "General"
                    },
                    {
                        "apiName": "dealMetaId",
                        "displayValue": "Deal",
                        "apiGroupName": "buyer",
                        "groupDisplayValue": "Buyer"
                    },
                    {
                        "apiName": "platformId",
                        "displayValue": "Platform",
                        "apiGroupName": "general",
                        "groupDisplayValue": "General"
                    },
                    {
                        "apiName": "timeUnit",
                        "displayValue": "TimeUnit",
                        "apiGroupName": "realTime",
                        "groupDisplayValue": "RealTime"
                    },
                    {
                        "apiName": "timestamp",
                        "displayValue": "Timestamp",
                        "apiGroupName": "realTime",
                        "groupDisplayValue": "RealTime"
                    }
                ],
                "metrics": [
                    {
                        "apiName": "paidImpressions",
                        "displayValue": "Paid Impressions",
                        "apiGroupName": "standardMetrics",
                        "groupDisplayValue": "Standard Metrics"
                    },
                    {
                        "apiName": "ecpm",
                        "displayValue": "eCPM",
                        "apiGroupName": "standardMetrics",
                        "groupDisplayValue": "Standard Metrics"
                    },
                    {
                        "apiName": "revenue",
                        "displayValue": "Revenue",
                        "apiGroupName": "standardMetrics",
                        "groupDisplayValue": "Standard Metrics"
                    }
                ]
            },
            "historicConfiguration": {
                "dimensions": [
                    {
                        "apiName": "date",
                        "displayValue": "Date",
                        "apiGroupName": "timeUnits",
                        "groupDisplayValue": "Time Units"
                    },
                    {
                        "apiName": "siteId",
                        "displayValue": "Site",
                        "apiGroupName": "inventory",
                        "groupDisplayValue": "Inventory"
                    },
                    {
                        "apiName": "categoryId",
                        "displayValue": "Vertical",
                        "apiGroupName": "inventory",
                        "groupDisplayValue": "Inventory"
                    },
                    {
                        "apiName": "platformId",
                        "displayValue": "Platform",
                        "apiGroupName": "general",
                        "groupDisplayValue": "General"
                    },
                    {
                        "apiName": "dspId",
                        "displayValue": "DSP",
                        "apiGroupName": "buyer",
                        "groupDisplayValue": "Buyer"
                    },
                    {
                        "apiName": "atdId",
                        "displayValue": "Buyer",
                        "apiGroupName": "buyer",
                        "groupDisplayValue": "Buyer"
                    },
                    {
                        "apiName": "advertiserId",
                        "displayValue": "Advertiser",
                        "apiGroupName": "buyer",
                        "groupDisplayValue": "Buyer"
                    },
                    {
                        "apiName": "advertiserCategoryId",
                        "displayValue": "Category",
                        "apiGroupName": "buyer",
                        "groupDisplayValue": "Buyer"
                    },
                    {
                        "apiName": "channelId",
                        "displayValue": "Channel",
                        "apiGroupName": "general",
                        "groupDisplayValue": "General"
                    },
                    {
                        "apiName": "dealMetaId",
                        "displayValue": "Deal",
                        "apiGroupName": "buyer",
                        "groupDisplayValue": "Buyer"
                    },
                    {
                        "apiName": "countryId",
                        "displayValue": "Country",
                        "apiGroupName": "geography",
                        "groupDisplayValue": "Geography"
                    },
                    {
                        "apiName": "adFormatId",
                        "displayValue": "Ad Format",
                        "apiGroupName": "adAttributes",
                        "groupDisplayValue": "Ad Attributes"
                    },
                    {
                        "apiName": "adSizeId",
                        "displayValue": "Ad Size",
                        "apiGroupName": "adAttributes",
                        "groupDisplayValue": "Ad Attributes"
                    },
                    {
                        "apiName": "hour",
                        "displayValue": "Hour",
                        "apiGroupName": "timeUnits",
                        "groupDisplayValue": "Time Units"
                    },
                    {
                        "apiName": "adTagId",
                        "displayValue": "Ad Tag",
                        "apiGroupName": "inventory",
                        "groupDisplayValue": "Inventory"
                    },
                    {
                        "apiName": "sectionId",
                        "displayValue": "Section",
                        "apiGroupName": "inventory",
                        "groupDisplayValue": "Inventory"
                    },
                    {
                        "apiName": "adNetworkGroupId",
                        "displayValue": "Ad Network (Group)",
                        "apiGroupName": "buyer",
                        "groupDisplayValue": "Buyer"
                    },
                    {
                        "apiName": "adNetworkVariantId",
                        "displayValue": "Ad Network (Variant)",
                        "apiGroupName": "buyer",
                        "groupDisplayValue": "Buyer"
                    },
                    {
                        "apiName": "secureStatus",
                        "displayValue": "Secure Status",
                        "apiGroupName": "inventory",
                        "groupDisplayValue": "Inventory"
                    },
                    {
                        "apiName": "foldPositionId",
                        "displayValue": "Fold Position (Placement)",
                        "apiGroupName": "inventory",
                        "groupDisplayValue": "Inventory"
                    },
                    {
                        "apiName": "cookied",
                        "displayValue": "Cookied Bid",
                        "apiGroupName": "inventory",
                        "groupDisplayValue": "Inventory"
                    },
                    {
                        "apiName": "mobLatLongFlag",
                        "displayValue": "Mobile - Lat/Long",
                        "apiGroupName": "mobile",
                        "groupDisplayValue": "Mobile"
                    },
                    {
                        "apiName": "mobDeviceIdFlag",
                        "displayValue": "Mobile - Device ID Present",
                        "apiGroupName": "mobile",
                        "groupDisplayValue": "Mobile"
                    },
                    {
                        "apiName": "mobGeoSourceFlag",
                        "displayValue": "Mobile - Geo Source",
                        "apiGroupName": "mobile",
                        "groupDisplayValue": "Mobile"
                    },
                    {
                        "apiName": "mobDeviceTypeId",
                        "displayValue": "Mobile - Device Type",
                        "apiGroupName": "mobile",
                        "groupDisplayValue": "Mobile"
                    },
                    {
                        "apiName": "mobDeviceIdTypeId",
                        "displayValue": "Mobile - Device ID Type",
                        "apiGroupName": "mobile",
                        "groupDisplayValue": "Mobile"
                    },
                    {
                        "apiName": "productId",
                        "displayValue": "Product",
                        "apiGroupName": "ag",
                        "groupDisplayValue": "Automated Guaranteed"
                    },
                    {
                        "apiName": "offerId",
                        "displayValue": "Offer",
                        "apiGroupName": "ag",
                        "groupDisplayValue": "Automated Guaranteed"
                    },
                    {
                        "apiName": "demandPlatformId",
                        "displayValue": "Demand Platform",
                        "apiGroupName": "ag",
                        "groupDisplayValue": "Automated Guaranteed"
                    }
                ],
                "metrics": [
                    {
                        "apiName": "paidImpressions",
                        "displayValue": "Paid Impressions",
                        "apiGroupName": "standardMetrics",
                        "groupDisplayValue": "Standard Metrics"
                    },
                    {
                        "apiName": "totalImpressions",
                        "displayValue": "Total Impressions",
                        "apiGroupName": "standardMetrics",
                        "groupDisplayValue": "Standard Metrics"
                    },
                    {
                        "apiName": "pbImpressionsNet",
                        "displayValue": "Net Passback Impressions",
                        "apiGroupName": "standardMetrics",
                        "groupDisplayValue": "Standard Metrics"
                    },
                    {
                        "apiName": "pbImpressionsBot",
                        "displayValue": "Bot Passback Impressions",
                        "apiGroupName": "standardMetrics",
                        "groupDisplayValue": "Standard Metrics"
                    },
                    {
                        "apiName": "pbImpressionsNonApproved",
                        "displayValue": "Non Approved Passback Impressions",
                        "apiGroupName": "standardMetrics",
                        "groupDisplayValue": "Standard Metrics"
                    },
                    {
                        "apiName": "ecpm",
                        "displayValue": "eCPM",
                        "apiGroupName": "standardMetrics",
                        "groupDisplayValue": "Standard Metrics"
                    },
                    {
                        "apiName": "revenue",
                        "displayValue": "Revenue",
                        "apiGroupName": "standardMetrics",
                        "groupDisplayValue": "Standard Metrics"
                    },
                    {
                        "apiName": "defaults",
                        "displayValue": "Defaults",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "fillRate",
                        "displayValue": "Fill Rate",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "clicks",
                        "displayValue": "Clicks",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "ctr",
                        "displayValue": "Click Through Rate",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "totalBidsRequestsDsp",
                        "displayValue": "Total bids requests for DSP",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "totalBidAmount",
                        "displayValue": "Total Bid Amount",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "nonZeroBidResponses",
                        "displayValue": "Non-zero bid responses",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "nonZeroBidReceived",
                        "displayValue": "Non-zero bids received",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "totalLostBidsDsp",
                        "displayValue": "Total lost bids for DSP",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "totalLostBidsAtd",
                        "displayValue": "Total lost bids for Buyer",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "totalLostBidsAdv",
                        "displayValue": "Total lost bids for Advertiser",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "lostBidsEcpmDsp",
                        "displayValue": "Lost Bids eCPM for DSP",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "lostBidsEcpmAtd",
                        "displayValue": "Lost Bids eCPM for Buyer",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "lostBidsEcpmAdv",
                        "displayValue": "Lost Bids eCPM for Advertiser",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "bidPercentageDsp",
                        "displayValue": "Bid Rate (%) for DSP",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "bidWinRateDsp",
                        "displayValue": "Bid win rate for DSP",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "bidWinRateAtd",
                        "displayValue": "Bid win rate for Buyer",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "bidWinRateAdv",
                        "displayValue": "Bid win rate for Advertiser",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "averageBidEcpmDsp",
                        "displayValue": "Avg. bid eCPM for DSP",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "averageBidEcpmAtd",
                        "displayValue": "Avg. bid eCPM for Buyer",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "averageBidEcpmAdv",
                        "displayValue": "Avg. bid eCPM for Advertiser",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "lostBidsTotalAmount",
                        "displayValue": "Lost Bids Total Amount",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "lostBidsByFloor",
                        "displayValue": "Lost Bids (Floor)",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "lostBidsAmountByFloor",
                        "displayValue": "Lost Bids Amount (Floor)",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "lostBidsEcpmByFloor",
                        "displayValue": "Lost Bids eCPM (Floor)",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "lostBidsByAuction",
                        "displayValue": "Lost Bids (Auction)",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "lostBidsAmountByAuction",
                        "displayValue": "Lost Bids Amount (Auction)",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "lostBidsEcpmByAuction",
                        "displayValue": "Lost Bids eCPM (Auction)",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "lostBidsByBlockList",
                        "displayValue": "Lost Bids (Block-list)",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "lostBidsAmountByBlockList",
                        "displayValue": "Lost Bids Amount (Block-list)",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "lostBidsEcpmByBlockList",
                        "displayValue": "Lost Bids eCPM (Block-list)",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "lostBidsByDWLF",
                        "displayValue": "Lost Bids (Deal White Listed Flag)",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "lostBidsAmountByDWLF",
                        "displayValue": "Lost Bids Amount (Deal White Listed Flag)",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "lostBidsEcpmByDWLF",
                        "displayValue": "Lost Bids eCPM (Deal White Listed Flag)",
                        "apiGroupName": "bidMetrics",
                        "groupDisplayValue": "Bid Metrics"
                    },
                    {
                        "apiName": "bookedImpressions",
                        "displayValue": "Booked Impressions",
                        "apiGroupName": "agMetrics",
                        "groupDisplayValue": "Automated Guaranteed Metrics"
                    },
                    {
                        "apiName": "sales",
                        "displayValue": "Sales",
                        "apiGroupName": "agMetrics",
                        "groupDisplayValue": "Automated Guaranteed Metrics"
                    }
                ]
            },
            "benchmarkConfiguration": {
                "dimensions": [
                    {
                        "apiName": "pubId",
                        "displayValue": "Publisher",
                        "apiGroupName": "buyer",
                        "groupDisplayValue": "Buyer"
                    },
                    {
                        "apiName": "advertiserId",
                        "displayValue": "Advertiser",
                        "apiGroupName": "buyer",
                        "groupDisplayValue": "Buyer"
                    },
                    {
                        "apiName": "advertiserCategoryId",
                        "displayValue": "Category",
                        "apiGroupName": "buyer",
                        "groupDisplayValue": "Buyer"
                    },
                    {
                        "apiName": "adSizeId",
                        "displayValue": "Ad Size",
                        "apiGroupName": "adAttributes",
                        "groupDisplayValue": "Ad Attributes"
                    }
                ],
                "metrics": [
                    {
                        "apiName": "ecpm",
                        "displayValue": "eCPM",
                        "apiGroupName": "standardMetrics",
                        "groupDisplayValue": "Standard Metrics"
                    },
                    {
                        "apiName": "avgCompEcpm",
                        "displayValue": "Avg. Comp. eCPM",
                        "apiGroupName": null,
                        "groupDisplayValue": null
                    },
                    {
                        "apiName": "maxCompEcpm",
                        "displayValue": "Max. Comp. eCPM",
                        "apiGroupName": null,
                        "groupDisplayValue": null
                    },
                    {
                        "apiName": "minCompEcpm",
                        "displayValue": "Min. Comp. eCPM",
                        "apiGroupName": null,
                        "groupDisplayValue": null
                    },
                    {
                        "apiName": "sow",
                        "displayValue": "Share of Wallet (SOW)",
                        "apiGroupName": null,
                        "groupDisplayValue": null
                    },
                    {
                        "apiName": "avgCompSow",
                        "displayValue": "Avg. Comp. SOW",
                        "apiGroupName": null,
                        "groupDisplayValue": null
                    },
                    {
                        "apiName": "maxCompSow",
                        "displayValue": "Max. Comp. SOW",
                        "apiGroupName": null,
                        "groupDisplayValue": null
                    },
                    {
                        "apiName": "minCompSow",
                        "displayValue": "Min. Comp. SOW",
                        "apiGroupName": null,
                        "groupDisplayValue": null
                    },
                    {
                        "apiName": "sov",
                        "displayValue": "Share of Voice (SOV)",
                        "apiGroupName": null,
                        "groupDisplayValue": null
                    },
                    {
                        "apiName": "avgCompSov",
                        "displayValue": "Avg. Comp. SOV",
                        "apiGroupName": null,
                        "groupDisplayValue": null
                    },
                    {
                        "apiName": "maxCompSov",
                        "displayValue": "Max. Comp. SOV",
                        "apiGroupName": null,
                        "groupDisplayValue": null
                    },
                    {
                        "apiName": "minCompSov",
                        "displayValue": "Min. Comp. SOV",
                        "apiGroupName": null,
                        "groupDisplayValue": null
                    },
                    {
                        "apiName": "floor",
                        "displayValue": "Floor",
                        "apiGroupName": null,
                        "groupDisplayValue": null
                    }
                ]
            },
            "dimensionDependencyMap": {
                "demandPlatformId": [
                    "date",
                    "offerId",
                    "productId",
                    "bookedImpressions",
                    "sales"
                ],
                "sectionId": [
                    "siteId",
                    "platformId",
                    "channelId",
                    "adTagId",
                    "date",
                    "hour",
                    "month",
                    "week",
                    "date",
                    "dspId",
                    "advertiserId",
                    "sectionId",
                    "dealMetaId"
                ],
                "bookedImpressions": [
                    "date",
                    "offerId",
                    "demandPlatformId",
                    "productId",
                    "sales"
                ],
                "sales": [
                    "date",
                    "offerId",
                    "demandPlatformId",
                    "bookedImpressions",
                    "productId"
                ],
                "dealMetaId": [
                    "siteId",
                    "dspId",
                    "atdId",
                    "advertiserId",
                    "advertiserCategoryId",
                    "platformId",
                    "channelId",
                    "adFormatId",
                    "adSizeId",
                    "hour",
                    "date",
                    "month",
                    "week",
                    "dealMetaId",
                    "sectionId"
                ],
                "month": [
                    "siteId",
                    "categoryId",
                    "platformId",
                    "dspId",
                    "atdId",
                    "advertiserId",
                    "advertiserCategoryId",
                    "channelId",
                    "dealMetaId",
                    "countryId",
                    "adFormatId",
                    "adSizeId",
                    "adTagId",
                    "sectionId",
                    "pubId",
                    "adNetworkGroupId",
                    "adNetworkVariantId",
                    "month"
                ],
                "adNetworkGroupId": [
                    "adNetworkGroupId",
                    "adNetworkVariantId",
                    "date",
                    "month",
                    "week",
                    "pubId",
                    "siteId",
                    "categoryId",
                    "adFormatId",
                    "adSizeId",
                    "adTagId",
                    "secureStatus",
                    "foldPositionId"
                ],
                "hour": [
                    "siteId",
                    "categoryId",
                    "platformId",
                    "dspId",
                    "atdId",
                    "advertiserId",
                    "advertiserCategoryId",
                    "channelId",
                    "dealMetaId",
                    "countryId",
                    "adFormatId",
                    "adSizeId",
                    "adTagId",
                    "sectionId",
                    "pubId",
                    "secureStatus",
                    "foldPositionId",
                    "cookied",
                    "mobLatLongFlag",
                    "mobDeviceIdFlag",
                    "mobGeoSourceFlag",
                    "mobDeviceTypeId",
                    "mobDeviceIdTypeId",
                    "hour"
                ],
                "date": [
                    "siteId",
                    "categoryId",
                    "platformId",
                    "dspId",
                    "atdId",
                    "advertiserId",
                    "advertiserCategoryId",
                    "channelId",
                    "dealMetaId",
                    "countryId",
                    "adFormatId",
                    "adSizeId",
                    "adTagId",
                    "sectionId",
                    "pubId",
                    "adNetworkGroupId",
                    "adNetworkVariantId",
                    "secureStatus",
                    "foldPositionId",
                    "cookied",
                    "mobLatLongFlag",
                    "mobDeviceIdFlag",
                    "mobGeoSourceFlag",
                    "mobDeviceTypeId",
                    "mobDeviceIdTypeId",
                    "date"
                ],
                "offerId": [
                    "date",
                    "productId",
                    "demandPlatformId",
                    "bookedImpressions",
                    "sales"
                ],
                "productId": [
                    "date",
                    "offerId",
                    "demandPlatformId",
                    "bookedImpressions",
                    "sales"
                ],
                "adNetworkVariantId": [
                    "adNetworkVariantId",
                    "adNetworkGroupId",
                    "date",
                    "month",
                    "week",
                    "pubId",
                    "siteId",
                    "categoryId",
                    "adFormatId",
                    "adSizeId",
                    "adTagId",
                    "secureStatus",
                    "foldPositionId"
                ],
                "week": [
                    "siteId",
                    "categoryId",
                    "platformId",
                    "dspId",
                    "atdId",
                    "advertiserId",
                    "advertiserCategoryId",
                    "channelId",
                    "dealMetaId",
                    "countryId",
                    "adFormatId",
                    "adSizeId",
                    "adTagId",
                    "sectionId",
                    "pubId",
                    "adNetworkGroupId",
                    "adNetworkVariantId",
                    "week"
                ]
            }
        };
        
        $httpBackend.whenGET(endpoints.analytic).respond(response);
    }


}).call(this, angular);