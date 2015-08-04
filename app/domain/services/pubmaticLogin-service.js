/*global angular*/
(function(angular) {
    "use strict";



    var app;

    app = angular.module("pub-ui-analytics.domain");

    app.factory("pubmaticLoginService", [
        "$q",
        "$http",


        function($q, $http) {

            return {

                deferred: $q.defer(),

                /**
                 * Analytic data collection
                 */
                attributes: {},

                parse: function(response) {
                    var attr = {};
                    console.log(response);

                    return attr;
                },

                /**
                 * Make GET request to analytic middleware resource.
                 * Set response to analytic data collection.
                 */
                login: function(data) {
                    var request, config;

                    // data.username = "envision@pubmatic.com";

                    // data.password = "!EnDorSE4lift!";


                    var url = "http://demo.pubmatic.com/AdGainMgmt/Login?operId=5&email=" + data.username + "&password=" + data.password;

                    config = {
                        method: "POST",
                        url: url,
                        cache: false
                    };


                    request = $http(config);
                    request.success(this.fetchSuccess.bind(this));

                    this.deferred.resolve(request);

                    return request;

                },


                fetchSuccess: function(response) {

                    this.attributes = this.parse(response);
                    return response;
                },


                getLoginUsername: function() {
                    return this.attributes.loginUsername || "";
                },
                setLoginUsername: function(val) {
                    this.attributes.loginUsername = val;
                },

                getLoginPassword: function() {
                    return this.attributes.loginPassword || "";
                },
                setLoginPassword: function(val) {
                    this.attributes.loginPassword = val;
                }

            };
        }
    ]);

}).call(this, angular);
