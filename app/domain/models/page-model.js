/*global angular*/
(function (angular) {
    "use strict";

    var app;

    app = angular.module("pub-ui-analytics.domain");

    app.factory("pageModel", [ "$location", "mediator",

        function ($location, mediator) {

             
            return {
                /**
                 * The default attributes of model
                 */
                attributes: {
                    isModifyingExistingReport: false
                },

                getIsModifyingExistingReport: function () {
                    return this.attributes.isModifyingExistingReport;
                },

                setIsModifyingExistingReport: function (value) {
                    this.attributes.isModifyingExistingReport = value;
                },


                updateIndicator: function(){
                    if ($location.search().customReportId) {
                        mediator.publish("nlp.currentPageIndicator","custom" );
                    }
                    else {
                        mediator.publish("nlp.currentPageIndicator","dimensions" );
                    }
                },

                updateReportBasicInfo: function() {
                    if ($location.search().standardReportId){
                        $location.search("standardReportId", null);
                        this.setIsModifyingExistingReport(true);
                    }
                    else {
                        this.setIsModifyingExistingReport(false);
                    }
                }
            };
        
        }
    ]);

}).call(this, angular);