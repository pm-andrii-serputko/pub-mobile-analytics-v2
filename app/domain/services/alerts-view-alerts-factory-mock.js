(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.dao")
        .run(["$httpBackend", alertsDaoMock]);

    function alertsDaoMock ($httpBackend) {
            var newResponse = [
                {
                    "id":96011,
                    "ruleId":1,
                    "title":"10% Drop in Revenue",
                    "description":"10% Drop in Revenue (last day over same day last week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T00:10:50",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96012,
                    "ruleId":2,
                    "title":"20% Drop in eCPM",
                    "description":"20% Drop in eCPM (last day over weekly moving average)",
                    "message":"You have recieved this alert as there is 20% Drop in eCPM. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T02:10:50",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96013,
                    "ruleId":3,
                    "title":"10% Drop in Revenue for PMP",
                    "description":"10% Drop in Revenue for PMP (last day over same day last week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue for PMP. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T02:10:50",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96015,
                    "ruleId":5,
                    "title":"10% Drop in Revenue for Web",
                    "description":"10% Drop in Revenue for Web (last day over same day last week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue for Web. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T02:10:50",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96016,
                    "ruleId":6,
                    "title":"20% Drop in eCPM for Web",
                    "description":"20% Drop in eCPM for Web (last day over weekly moving average)",
                    "message":"You have recieved this alert as there is 20% Drop in eCPM for Web. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T02:10:50",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96017,
                    "ruleId":7,
                    "title":"10% Drop in Revenue for Mobile",
                    "description":"10% Drop in Revenue for Mobile (last day over same day last week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue for Mobile. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T02:10:50",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96018,
                    "ruleId":8,
                    "title":"20% Drop in eCPM for Mobile ",
                    "description":"20% Drop in eCPM for Mobile (last day over weekly moving average)",
                    "message":"You have recieved this alert as there is 20% Drop in eCPM for Mobile . Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T01:10:50",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96021,
                    "ruleId":11,
                    "title":"10% Drop in Revenue for any top 10 Advertisers for PMP",
                    "description":"10% Drop in Revenue for any top 10 Advertisers for PMP (last week over previous week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue for any top 10 Advertisers for PMP. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T01:10:50",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96022,
                    "ruleId":12,
                    "title":"10% Drop in Revenue for any top 10 Advertisers for Mobile",
                    "description":"10% Drop in Revenue for any top 10 Advertisers for Mobile (last week over previous week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue for any top 10 Advertisers for Mobile. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T03:10:50",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96023,
                    "ruleId":13,
                    "title":"10% Drop in Revenue for any top 10 Advertisers for Video",
                    "description":"10% Drop in Revenue for any top 10 Advertisers for Video (last week over previous week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue for any top 10 Advertisers for Video. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T04:10:50",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96024,
                    "ruleId":14,
                    "title":"10% Drop in Revenue for any of top 10 Advertisers",
                    "description":"10% Drop in Revenue for any of top 10 Advertisers (last week over previous week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue for any of top 10 Advertisers. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T00:10:50",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96025,
                    "ruleId":15,
                    "title":"10% Drop in Revenue for any of top 10 DSPs",
                    "description":"10% Drop in Revenue for any of top 10 DSPs (last week over previous week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue for any of top 10 DSPs. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T00:10:50",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96026,
                    "ruleId":16,
                    "title":"10% Drop in Revenue for any of top 10 Buyers",
                    "description":"10% Drop in Revenue for any of top 10 Buyers (last week over previous week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue for any of top 10 Buyers. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T06:10:50",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96027,
                    "ruleId":17,
                    "title":"New Entrants in Top 10 Advertisers by revenue",
                    "description":"New Entrants in Top 10 Advertisers by revenue (last day over weekly moving average)",
                    "message":"You have recieved this alert as there is New Entrants in Top 10 Advertisers by revenue. Please get in touch with support@pubmatic.com for further details.",
                    "rank":1,
                    "readFlag":false,
                    "createdAt":"2015-02-02T07:10:50",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96042,
                    "ruleId":1,
                    "title":"10% Drop in Revenue",
                    "description":"10% Drop in Revenue (last day over same day last week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T08:00:22",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96043,
                    "ruleId":2,
                    "title":"20% Drop in eCPM",
                    "description":"20% Drop in eCPM (last day over weekly moving average)",
                    "message":"You have recieved this alert as there is 20% Drop in eCPM. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T08:00:22",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96044,
                    "ruleId":3,
                    "title":"10% Drop in Revenue for PMP",
                    "description":"10% Drop in Revenue for PMP (last day over same day last week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue for PMP. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T00:00:22",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96045,
                    "ruleId":4,
                    "title":"10%  Drop in eCPM for PMP",
                    "description":"10% Drop in eCPM for PMP (last day over weekly moving average)",
                    "message":"You have recieved this alert as there is 10%  Drop in eCPM for PMP. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T00:00:22",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96046,
                    "ruleId":5,
                    "title":"10% Drop in Revenue for Web",
                    "description":"10% Drop in Revenue for Web (last day over same day last week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue for Web. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T00:00:22",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96047,
                    "ruleId":6,
                    "title":"20% Drop in eCPM for Web",
                    "description":"20% Drop in eCPM for Web (last day over weekly moving average)",
                    "message":"You have recieved this alert as there is 20% Drop in eCPM for Web. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T00:00:22",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96048,
                    "ruleId":7,
                    "title":"10% Drop in Revenue for Mobile",
                    "description":"10% Drop in Revenue for Mobile (last day over same day last week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue for Mobile. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T00:00:22",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96049,
                    "ruleId":8,
                    "title":"20% Drop in eCPM for Mobile ",
                    "description":"20% Drop in eCPM for Mobile (last day over weekly moving average)",
                    "message":"You have recieved this alert as there is 20% Drop in eCPM for Mobile . Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T00:00:22",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96050,
                    "ruleId":9,
                    "title":"10% Drop in Revenue for Video ",
                    "description":"10% Drop in Revenue for Video (last day over same day last week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue for Video . Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T00:00:22",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96051,
                    "ruleId":10,
                    "title":"20% Drop in eCPM for Video",
                    "description":"20% Drop in eCPM for Video (last day over weekly moving average)",
                    "message":"You have recieved this alert as there is 20% Drop in eCPM for Video. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T00:00:22",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96052,
                    "ruleId":11,
                    "title":"10% Drop in Revenue for any top 10 Advertisers for PMP",
                    "description":"10% Drop in Revenue for any top 10 Advertisers for PMP (last week over previous week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue for any top 10 Advertisers for PMP. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T00:00:22",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96053,
                    "ruleId":12,
                    "title":"10% Drop in Revenue for any top 10 Advertisers for Mobile",
                    "description":"10% Drop in Revenue for any top 10 Advertisers for Mobile (last week over previous week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue for any top 10 Advertisers for Mobile. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T00:00:22",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96055,
                    "ruleId":14,
                    "title":"10% Drop in Revenue for any of top 10 Advertisers",
                    "description":"10% Drop in Revenue for any of top 10 Advertisers (last week over previous week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue for any of top 10 Advertisers. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T01:00:22",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96056,
                    "ruleId":15,
                    "title":"10% Drop in Revenue for any of top 10 DSPs",
                    "description":"10% Drop in Revenue for any of top 10 DSPs (last week over previous week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue for any of top 10 DSPs. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T02:00:22",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96057,
                    "ruleId":16,
                    "title":"10% Drop in Revenue for any of top 10 Buyers",
                    "description":"10% Drop in Revenue for any of top 10 Buyers (last week over previous week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue for any of top 10 Buyers. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T03:00:22",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96058,
                    "ruleId":17,
                    "title":"New Entrants in Top 10 Advertisers by revenue",
                    "description":"New Entrants in Top 10 Advertisers by revenue (last day over weekly moving average)",
                    "message":"You have recieved this alert as there is New Entrants in Top 10 Advertisers by revenue. Please get in touch with support@pubmatic.com for further details.",
                    "rank":1,
                    "readFlag":false,
                    "createdAt":"2015-02-02T04:00:22",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96059,
                    "ruleId":18,
                    "title":"New Entrants in Top 10 Buyers revenue",
                    "description":"New Entrants in Top 10 Buyers revenue (last day over weekly moving average)",
                    "message":"You have recieved this alert as there is New Entrants in Top 10 Buyers revenue. Please get in touch with support@pubmatic.com for further details.",
                    "rank":1,
                    "readFlag":false,
                    "createdAt":"2015-02-02T05:00:22",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96060,
                    "ruleId":19,
                    "title":"New Entrants in Top 10 DSPs revenue",
                    "description":"New Entrants in Top 10 DSPs revenue (last day over weekly moving average)",
                    "message":"You have recieved this alert as there is New Entrants in Top 10 DSPs revenue. Please get in touch with support@pubmatic.com for further details.",
                    "rank":1,
                    "readFlag":false,
                    "createdAt":"2015-02-02T06:00:22",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96061,
                    "ruleId":21,
                    "title":"New Entrants in Top 10 Advertisers by total lost bids",
                    "description":"New Entrants in Top 10 Advertisers by total lost bids (last week over previous week)",
                    "message":"You have recieved this alert as there is New Entrants in Top 10 Advertisers by total lost bids. Please get in touch with support@pubmatic.com for further details.",
                    "rank":1,
                    "readFlag":false,
                    "createdAt":"2015-02-02T07:00:22",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96073,
                    "ruleId":1,
                    "title":"10% Drop in Revenue",
                    "description":"10% Drop in Revenue (last day over same day last week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T08:00:27",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96074,
                    "ruleId":2,
                    "title":"20% Drop in eCPM",
                    "description":"20% Drop in eCPM (last day over weekly moving average)",
                    "message":"You have recieved this alert as there is 20% Drop in eCPM. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T09:00:27",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96075,
                    "ruleId":3,
                    "title":"10% Drop in Revenue for PMP",
                    "description":"10% Drop in Revenue for PMP (last day over same day last week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue for PMP. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T11:00:27",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96076,
                    "ruleId":4,
                    "title":"10%  Drop in eCPM for PMP",
                    "description":"10% Drop in eCPM for PMP (last day over weekly moving average)",
                    "message":"You have recieved this alert as there is 10%  Drop in eCPM for PMP. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T10:00:27",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96077,
                    "ruleId":5,
                    "title":"10% Drop in Revenue for Web",
                    "description":"10% Drop in Revenue for Web (last day over same day last week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue for Web. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T12:00:27",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96078,
                    "ruleId":6,
                    "title":"20% Drop in eCPM for Web",
                    "description":"20% Drop in eCPM for Web (last day over weekly moving average)",
                    "message":"You have recieved this alert as there is 20% Drop in eCPM for Web. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T13:00:27",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96079,
                    "ruleId":7,
                    "title":"10% Drop in Revenue for Mobile",
                    "description":"10% Drop in Revenue for Mobile (last day over same day last week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue for Mobile. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T14:00:27",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96080,
                    "ruleId":8,
                    "title":"20% Drop in eCPM for Mobile ",
                    "description":"20% Drop in eCPM for Mobile (last day over weekly moving average)",
                    "message":"You have recieved this alert as there is 20% Drop in eCPM for Mobile . Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T12:00:27",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96081,
                    "ruleId":9,
                    "title":"10% Drop in Revenue for Video ",
                    "description":"10% Drop in Revenue for Video (last day over same day last week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue for Video . Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T13:00:27",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96082,
                    "ruleId":10,
                    "title":"20% Drop in eCPM for Video",
                    "description":"20% Drop in eCPM for Video (last day over weekly moving average)",
                    "message":"You have recieved this alert as there is 20% Drop in eCPM for Video. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T15:00:27",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96083,
                    "ruleId":11,
                    "title":"10% Drop in Revenue for any top 10 Advertisers for PMP",
                    "description":"10% Drop in Revenue for any top 10 Advertisers for PMP (last week over previous week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue for any top 10 Advertisers for PMP. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T16:00:27",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96084,
                    "ruleId":12,
                    "title":"10% Drop in Revenue for any top 10 Advertisers for Mobile",
                    "description":"10% Drop in Revenue for any top 10 Advertisers for Mobile (last week over previous week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue for any top 10 Advertisers for Mobile. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T17:00:27",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96085,
                    "ruleId":13,
                    "title":"10% Drop in Revenue for any top 10 Advertisers for Video",
                    "description":"10% Drop in Revenue for any top 10 Advertisers for Video (last week over previous week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue for any top 10 Advertisers for Video. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T18:00:27",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96086,
                    "ruleId":14,
                    "title":"10% Drop in Revenue for any of top 10 Advertisers",
                    "description":"10% Drop in Revenue for any of top 10 Advertisers (last week over previous week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue for any of top 10 Advertisers. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T19:00:27",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96087,
                    "ruleId":15,
                    "title":"10% Drop in Revenue for any of top 10 DSPs",
                    "description":"10% Drop in Revenue for any of top 10 DSPs (last week over previous week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue for any of top 10 DSPs. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T20:00:27",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96088,
                    "ruleId":16,
                    "title":"10% Drop in Revenue for any of top 10 Buyers",
                    "description":"10% Drop in Revenue for any of top 10 Buyers (last week over previous week)",
                    "message":"You have recieved this alert as there is 10% Drop in Revenue for any of top 10 Buyers. Please get in touch with support@pubmatic.com for further details.",
                    "rank":5,
                    "readFlag":false,
                    "createdAt":"2015-02-02T21:00:27",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96089,
                    "ruleId":17,
                    "title":"New Entrants in Top 10 Advertisers by revenue",
                    "description":"New Entrants in Top 10 Advertisers by revenue (last day over weekly moving average)",
                    "message":"You have recieved this alert as there is New Entrants in Top 10 Advertisers by revenue. Please get in touch with support@pubmatic.com for further details.",
                    "rank":1,
                    "readFlag":false,
                    "createdAt":"2015-02-02T22:00:27",
                    "updatedAt":"2015-02-05T13:58:01"
                },
                {
                    "id":96091,
                    "ruleId":19,
                    "title":"New Entrants in Top 10 DSPs revenue",
                    "description":"New Entrants in Top 10 DSPs revenue (last day over weekly moving average)",
                    "message":"You have recieved this alert as there is New Entrants in Top 10 DSPs revenue. Please get in touch with support@pubmatic.com for further details.",
                    "rank":1,
                    "readFlag":false,
                    "createdAt":"2015-02-02T23:00:27",
                    "updatedAt":"2015-02-05T13:58:01"
                }
            ];
            $httpBackend.whenGET(/^api\/v1\/analytics\/alert\/msgs\w*/).respond(newResponse);
        }


}).call(this, angular);