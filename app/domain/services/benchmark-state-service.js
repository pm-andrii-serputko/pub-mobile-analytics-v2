/*global angular*/
(function (angular) {
    "use strict";

    var app;

    app = angular.module("pub-ui-analytics.domain");

    app.factory("benchmarkStateService", [
        "$q",
        "$http",
        "middlewareRoutes",
        "pubAnalyticService",

        function ($q, $http, middlewareRoutes, pubAnalyticService) {

            return {

                deferred: $q.defer(),

                /**
                 * Benchmark trial data collection
                 */
                attributes: {},

                /**
                 * Parse and modify response from Middleware
                 * @params response {object}
                 * @returns {object} destination object
                 */
                parse: function (response) {
                    var attr = {};

                    attr.benchmarkPaid = response.benchmarkPaid;
                    attr.trialEndDate = response.trialEndDate;
                    attr.paymentStartDate = response.paymentStartDate;

                    var tempDateArray,tempHourArray;
                    if (attr.paymentStartDate){
                        tempDateArray = response.paymentStartDate.split("T")[0].split("-");
                        tempHourArray = response.paymentStartDate.split("T")[1].split(":");

                        attr.paymentStartDate  = new Date(Date.UTC(tempDateArray[0], tempDateArray[1]-1, tempDateArray[2], tempHourArray[0], tempHourArray[1]));
                    }

                    if (attr.trialEndDate){
                        tempDateArray = response.trialEndDate.split("T")[0].split("-");
                        tempHourArray = response.trialEndDate.split("T")[1].split(":");
                        
                        attr.trialEndDate  = new Date(Date.UTC(tempDateArray[0], tempDateArray[1]-1, tempDateArray[2], tempHourArray[0], tempHourArray[1]));
                    }

                    var today = new Date();
                    if (response.isProcessing || ( attr.benchmarkPaid && ( (!attr.paymentStartDate || (attr.paymentStartDate.getTime() > today.getTime())) || !response.tosAgreed) )) {
                        attr.isProcessing = true;
                    }
                    else {
                        attr.isProcessing = false;
                    }

                    return attr;
                },

                /**
                 * Make GET request to benchmark trial middleware resource.
                 * Set response to benchmark trial data collection.
                 */
                fetch: function () {
                    var request, config;

                    config = {
                        method: "GET",
                        url: middlewareRoutes.benchmarkState + "/" + pubAnalyticService.getUserType() +"/" + pubAnalyticService.getUserId(),
                        cache: false
                    };

                    request = $http(config);
                    request.success(this.fetchSuccess.bind(this));

                    this.deferred.resolve(request);

                    return this.deferred.promise;

                },


                /**
                 * Make GET request to benchmark trial middleware resource.
                 * Set response to benchmark trial data collection.
                 */
                put: function (data) {
                    var request, config;

                    config = {
                        method: "PUT",
                        url: middlewareRoutes.benchmarkState + "/" + pubAnalyticService.getUserType() +"/" + pubAnalyticService.getUserId(),
                        cache: false,
                        data: data
                    };

                    request = $http(config);
                    request.success(this.putSuccess.bind(this));

                    this.deferred.resolve(request);

                    return request;

                },

                putSuccess: function(response){
                    return response;
                },


                fetchSuccess: function (response) {
                    this.attributes = this.parse(response);
                    return response;
                },


                getBenchmarkActivated: function () {
                    var activated = false;
                    var today = new Date();

                    if (this.getBenchmarkPaid()){
                        activated = true;
                    }
                    else if (!this.getBenchmarkPaid() && this.getTrialEndDate() && (this.getTrialEndDate().getTime() > today.getTime())) {
                        activated = true;
                    }

                    return activated;
                },

                isExpired: function() {
                    var today = new Date();

                    if (!this.getBenchmarkPaid() && this.getTrialEndDate() && (today.getTime() > this.getTrialEndDate().getTime())){
                        return true;
                    }
                    return false;
                },


                getBenchmarkPaid: function () {
                    return this.attributes.benchmarkPaid || false;
                },
                setBenchmarkPaid: function (val) {
                    this.attributes.benchmarkPaid = val;
                },

                getPaymentStartDate: function () {
                    return this.attributes.paymentStartDate;
                },

                getTrialEndDate: function () {
                    return this.attributes.trialEndDate;
                },
                setTrialEndDate: function (val) {
                    this.attributes.trialEndDate = val;
                },

                getIsProcessing: function () {
                    return this.attributes.isProcessing || false;
                },

                setIsProcessing: function (val) {
                    this.attributes.isProcessing = val;
                },

                getFirstAccess: function () {
                    return this.attributes.firstAccess || false;
                },

                setFirstAccess: function (val) {
                    this.attributes.firstAccess = val;
                },
                convertFormatedStringToDate: function(str){
                    var tempDateArray = str.split("T")[0].split("-");
                    var tempHourArray = str.split("T")[1].split(":");
                    return new Date(Date.UTC(tempDateArray[0], tempDateArray[1]-1, tempDateArray[2], tempHourArray[0], tempHourArray[1]));
                }
            };
        }
    ]);

}).call(this, angular);