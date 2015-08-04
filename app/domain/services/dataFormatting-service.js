/*global angular*/
(function (angular) {
    "use strict";

    var app;

    app = angular.module("pub-ui-analytics.domain");

    app.factory("dataFormattingService", ["$filter", function ($filter) {

        var hash = {
            totalImpressions: {
                decimalPlaces: 0,
                thousandSeparator: true,
                filter: "pubNumber"
            },
            paidImpressions: {
                decimalPlaces: 0,
                thousandSeparator: true,
                filter: "pubNumber"
            },
            pbImpressionsNet: {
                decimalPlaces: 0,
                thousandSeparator: true,
                filter: "pubNumber"
            },
            pbImpressionsBot: {
                decimalPlaces: 0,
                thousandSeparator: true,
                filter: "pubNumber"
            },
            pbImpressionsNonApproved: {
                decimalPlaces: 0,
                thousandSeparator: true,
                filter: "pubNumber"
            },
            defaults: {
                decimalPlaces: 0,
                thousandSeparator: true,
                filter: "pubNumber"
            },
            clicks: {
                decimalPlaces: 0,
                thousandSeparator: true,
                filter: "pubNumber"
            },
            timeoutRate: {
                decimalPlaces: 2,
                thousandSeparator: true,
                filter: "pubNumber"
            },
            lostBidsTotalAmount: {
                decimalPlaces: 2,
                thousandSeparator: true,
                filter: "pubCurrency"
            },
            lostBidsAmountByFloor: {
                decimalPlaces: 2,
                thousandSeparator: true,
                filter: "pubCurrency"
            },
            lostBidsAmountByAuction: {
                decimalPlaces: 2,
                thousandSeparator: true,
                filter: "pubCurrency"
            },
            lostBidsAmountByBlocklist: {
                decimalPlaces: 2,
                thousandSeparator: true,
                filter: "pubCurrency"
            },
            lostBidsAmountByDWLF: {
                decimalPlaces: 2,
                thousandSeparator: true,
                filter: "pubCurrency"
            },
            lostBidsEcpmByFloor: {
                decimalPlaces: 2,
                thousandSeparator: true,
                filter: "pubCurrency"
            },
            lostBidsEcpmByAuction: {
                decimalPlaces: 2,
                thousandSeparator: true,
                filter: "pubCurrency"
            },
            lostBidsEcpmByBlocklist: {
                decimalPlaces: 2,
                thousandSeparator: true,
                filter: "pubCurrency"
            },
            lostBidsEcpmByDWLF: {
                decimalPlaces: 2,
                thousandSeparator: true,
                filter: "pubCurrency"
            },
            lostBidsEcpmDsp: {
                decimalPlaces: 2,
                thousandSeparator: true,
                filter: "pubCurrency"
            },
            lostBidsEcpmAtd: {
                decimalPlaces: 2,
                thousandSeparator: true,
                filter: "pubCurrency"
            },
            lostBidsEcpmAdv: {
                decimalPlaces: 2,
                thousandSeparator: true,
                filter: "pubCurrency"
            },
            totalBidAmount: {
                decimalPlaces: 2,
                thousandSeparator: true,
                filter: "pubCurrency"
            },
            ecpm: {
                decimalPlaces: 2,
                thousandSeparator: true,
                filter: "pubCurrency"
            },
            floor: {
                decimalPlaces: 2,
                thousandSeparator: true,
                filter: "pubCurrency"
            },
            avgCompEcpm: {
                decimalPlaces: 2,
                thousandSeparator: true,
                filter: "pubCurrency"
            },
            medianCompEcpm: {
                decimalPlaces: 2,
                thousandSeparator: true,
                filter: "pubCurrency"
            },
            spend: {
                decimalPlaces: 0,
                thousandSeparator: true,
                filter: "pubCurrency"
            },
            revenue: {
                decimalPlaces: 0,
                thousandSeparator: true,
                filter: "pubCurrency"
            },
            totalBidRequests: {
                decimalPlaces: 0,
                thousandSeparator: true,
                filter: "pubNumber"
            },
            totalBidResponses: {
                decimalPlaces: 0,
                thousandSeparator: true,
                filter: "pubNumber"
            },
            nonZeroBidResponses: {
                decimalPlaces: 0,
                thousandSeparator: true,
                filter: "pubNumber"
            },
            nonZeroBidReceived: {
                decimalPlaces: 0,
                thousandSeparator: true,
                filter: "pubNumber"
            },
            totalLostBids: {
                decimalPlaces: 0,
                thousandSeparator: true,
                filter: "pubNumber"
            },
            totalBidsRequestsDsp: {
                decimalPlaces: 0,
                thousandSeparator: true,
                filter: "pubNumber"
            },
            totalLostBidsDsp: {
                decimalPlaces: 0,
                thousandSeparator: true,
                filter: "pubNumber"
            },
            totalLostBidsAtd: {
                decimalPlaces: 0,
                thousandSeparator: true,
                filter: "pubNumber"
            },
            totalLostBidsAdv: {
                decimalPlaces: 0,
                thousandSeparator: true,
                filter: "pubNumber"
            },
            fillRate: {
                decimalPlaces: 0,
                thousandSeparator: false,
                filter: "pubPercentage"
            },
            ctr: {
                decimalPlaces: 4,
                thousandSeparator: false,
                filter: "pubPercentage"
            },
            bidPercentage: {
                decimalPlaces: 0,
                thousandSeparator: false,
                filter: "pubPercentage"
            },
            bidPercentageDsp: {
                decimalPlaces: 0,
                thousandSeparator: false,
                filter: "pubPercentage"
            },
            bidWinRateDsp: {
                decimalPlaces: 0,
                thousandSeparator: false,
                filter: "pubPercentage"
            },
            bidWinRateAtd: {
                decimalPlaces: 0,
                thousandSeparator: false,
                filter: "pubPercentage"
            },
            bidWinRateAdv: {
                decimalPlaces: 0,
                thousandSeparator: false,
                filter: "pubPercentage"
            },
            bidLossRate: {
                decimalPlaces: 0,
                thousandSeparator: false,
                filter: "pubPercentage"
            },
            bidWinRate: {
                decimalPlaces: 0,
                thousandSeparator: false,
                filter: "pubPercentage"
            },
            averageBidEcpm: {
                decimalPlaces: 2,
                thousandSeparator: true,
                filter: "pubCurrency"
            },
            averageBidEcpmDsp: {
                decimalPlaces: 2,
                thousandSeparator: true,
                filter: "pubCurrency"
            },
            averageBidEcpmAtd: {
                decimalPlaces: 2,
                thousandSeparator: true,
                filter: "pubCurrency"
            },
            averageBidEcpmAdv: {
                decimalPlaces: 2,
                thousandSeparator: true,
                filter: "pubCurrency"
            },
            lostBidsByFloor: {
                decimalPlaces: 0,
                thousandSeparator: true,
                filter: "pubNumber"
            },
            lostBidsByAuction: {
                decimalPlaces: 0,
                thousandSeparator: true,
                filter: "pubNumber"
            },
            lostBidsByBlockList: {
                decimalPlaces: 0,
                thousandSeparator: true,
                filter: "pubNumber"
            },
            lostBidsByDWLF: {
                decimalPlaces: 0,
                thousandSeparator: true,
                filter: "pubNumber"
            },
            bidMaxEcpm: {
                decimalPlaces: 2,
                thousandSeparator: true,
                filter: "pubCurrency"
            },
            bidEcpm: {
                decimalPlaces: 2,
                thousandSeparator: true,
                filter: "pubCurrency"
            },
            sow: {
                decimalPlaces: 0,
                thousandSeparator: false,
                filter: "pubPercentage"
            },
            avgCompSow: {
                decimalPlaces: 0,
                thousandSeparator: false,
                filter: "pubPercentage"
            },
            medianCompSow: {
                decimalPlaces: 0,
                thousandSeparator: false,
                filter: "pubPercentage"
            },
            sov: {
                decimalPlaces: 0,
                thousandSeparator: false,
                filter: "pubPercentage"
            },
            avgCompSov: {
                decimalPlaces: 0,
                thousandSeparator: false,
                filter: "pubPercentage"
            },
            medianCompSov: {
                decimalPlaces: 0,
                thousandSeparator: false,
                filter: "pubPercentage"
            },
            quarter: {
                filter: "pubQuarterFilter"
            },
            month: {
                filter: "pubMonthFilter"
            },
            week: {
                filter: "pubWeekFilter"
            },
            date: {
                filter: "pubDateFilter"
            },
            hour: {
                filter: "pubHourFilter"
            },
            defaultDataFormat: {
                decimalPlaces: 0,
                thousandSeparator: true,
                filter: "pubText"
            },
            bookedImpressions: {
                decimalPlaces: 0,
                thousandSeparator: true,
                filter: "pubNumber"
            },
            sales: {
                decimalPlaces: 2,
                thousandSeparator: true,
                filter: "pubCurrency"
            },

            // TODO: update if when middleware is ready
            potentialRevenue: {
                decimalPlaces: 0,
                thousandSeparator: true,
                filter: "pubCurrency"
            },
            revenueOpportunity: {
                decimalPlaces: 0,
                thousandSeparator: true,
                filter: "pubCurrency"
            },
            potentialEcpm: {
                decimalPlaces: 2,
                thousandSeparator: true,
                filter: "pubCurrency"
            },
            ecpmOpportunity: {
                decimalPlaces: 2,
                thousandSeparator: true,
                filter: "pubCurrency"
            }
        };

        for (var key in hash) {
            var absoluteValue = key + "_a";
            var absoluteChange = key + "_c";
            var percentage = key + "_p";

            hash[absoluteValue] = hash[key];
            hash[absoluteChange] = hash[key];
            hash[percentage] = { decimalPlaces: 0, thousandSeparator: false, filter: "pubPercentage" };
        }

        return {
            numberFormat: function (id, value, currency) {
                var options = hash[id] || hash.defaultDataFormat;
                options.currency = currency;
                value = $filter(options.filter)(value, options);
                value = value.replace(/[, ]/g, "");
                var regex = /[+-]?\d+\.?\d*/g;
                value = value.match(regex).map(function(v) { return parseFloat(v); });
                return value[0];
            },
            format: function (id, value, currency) {
                var options = hash[id] || hash.defaultDataFormat;
                options.currency = currency;
                value = $filter(options.filter)(value, options);
                return value;
            },

            isCurrency: function (id) {
                var options = hash[id] || hash.defaultDataFormat;
                return options.filter === "pubCurrency";
            }
        };
    }]);


}).call(this, angular);
