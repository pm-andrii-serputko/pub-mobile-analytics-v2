(function(angular) {
    "use strict";

    var app;

    app = angular.module("pubSlicerApp");


    app.controller("pubLoginLinksScreenCtrl", [
        "$scope",
        "pubAnalyticService",
        "commonReportsService",
        "savedReportsService",
        "scheduleReportsService",
        "dimensionValuesService",
        "aggregatorRules",
        "alertRules",
        "toggleRoute",
        "$location",
        "pubNLPService",
        "$q",
        "mediator",
        "pmTokenStorageService",
        "pubmaticLoginService",
        "$http",
        "$rootScope",


        function($scope, pubAnalyticService, commonReportsService, savedReportsService, scheduleReportsService, dimensionValuesService, aggregatorRules, alertRules, toggleRoute, $location, pubNLPService, $q, mediator, tokenStorageService, pubmaticLoginService, $http, $rootScope) {
            tokenStorageService.setAuthToken("");
            $http.defaults.headers.common.PubToken = "";
            $rootScope.signedIn = false;
            if ($rootScope.snapper) {
                $rootScope.snapper.disable();
            }


            $scope.username = pubmaticLoginService.getLoginUsername();
            $scope.password = pubmaticLoginService.getLoginPassword();


            $scope.login = function() {
                tokenStorageService.setAuthToken("");
                $http.defaults.headers.common.PubToken = "";


                var data = {
                    username: $scope.username,
                    password: $scope.password
                };
                $scope.loginLoading = true;
                $scope.loginError = false;

                pubmaticLoginService.login(data).then(function(response) {

                    if (response && response.data && response.data.success) {

                        pubmaticLoginService.setLoginUsername(data.username);
                        pubmaticLoginService.setLoginPassword(data.password);


                        $rootScope.snapper = new window.Snap({
                            element: document.getElementById("content"),
                            disable: "right"
                        });



                        tokenStorageService.setAuthToken(response.data.success.apiAuthValue);
                        $http.defaults.headers.common.PubToken = tokenStorageService.getAuthToken() || "";


                        pubAnalyticService.fetch().then(function() {
                                $rootScope.signedIn = true;
                                $scope.loginLoading = false;


                                $location.url("dashboard");

                                mediator.publish("update:topHeaderUserLinks", pubAnalyticService.getUserType());

                                $q.all([
                                    commonReportsService.fetch(),
                                    savedReportsService.fetch()
                                ]).then(dimensionValuesService.getAllDimensionValues.bind(dimensionValuesService));

                                scheduleReportsService.fetch();
                                pubNLPService.setAlertCommand();
                                toggleRoute.enable(alertRules.restrictedPageList);
                                toggleRoute.enable(aggregatorRules.restrictedPageList);


                                mediator.publish("nlp.updateAlert");


                            })
                            .catch(function() {
                                $scope.loginError = true;
                                $scope.loginLoading = false;
                                $scope.errorMessage = "Invalid pubToken for this username.";
                            });
                    } else {

                        $scope.loginError = true;
                        $scope.loginLoading = false;
                        $scope.errorMessage = "Invalid username or password.";
                    }



                });


            };
        }
    ]);

}).call(this, angular);
