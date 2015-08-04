/*jshint unused:false*/
"use strict";

/**
 *
 * @ngdoc directive
 * @name pmApiTable
 * @restrict E
 *
 * @description Call any PubMatic API and display the results in a UX compliant HTML table.
 * @param {string} apiEndpoint PubMatic API Endpoint (REST) called to populate the data table.
 * @param {string} method API CRUD method used for call (GET, POST, PUT, PATCH)
 * @param {string} columnHeaderList Comma delimited column headers for each corresponding list field. If nothing is specified or if the number of column names do not match the number of fields, the default field names are chosen.Also no duplicates allowed.
 * @param {string} fieldList Comma delimited list fields returned by the API that will display in the data table.
 * @param {string} rowclick Name of callback scope function in controller \called when a table row is clicked.
 * @param {string} rowbuttons Scope object reference.  A JSON array of row level buttons/callbacks to pass into the directive.
 *
 * @example Call <a href='www.google.com'>Inventory API</a> and display XYZ in the data table.
 <pre>
      <pm-api-table
         endpoint="inventory"
         method="GET"
         columnheaders="ApiName,Endpointname,Type,Description"
         objectdisplayfields="api,endpoint,method,description"
         rowclick="controllerOnClickFunction">
      </pm-api-table>
 </pre>
 *
 *
 *
 */

var pmlComponents = angular.module("pmlComponents");

pmlComponents.directive("pmApiTableBeta", [
        function() {
            return {
                templateUrl:"modules/pmlComponents/tags/pmApiTableBeta/pmApiTable-directive-beta.html",
                restrict: "E",
                scope: {
                    endpoint:            "@",
                    displayfields:       "@",
                    baseobject:          "@",
                    columnheaders:       "@",
                    rowclick:            "=",
                    rowbuttons:          "=",
                    search:              "@",
                    apiresponse:         "=",
                    classname:           "@",
                    removealertrow:      "&",
                    index:               "=",
                    filteredresponse:    "=",
                    footerlength:        "@"
                },
                controller:["pmApiTableServiceBeta", "$scope", "$location","$attrs","$filter","$window","$debounce", function($apiService, $scope, $location, $attrs, $filter, $window, $debounce){

                    $scope.apiresponse=[];
                    $scope.response=[];
                    $scope.filteredresponse = [];
                    $scope.completeresponse= [];
                    $scope.index=0;

                    // Handle row and row button click events
                    $scope.callRowClick=function(event, item, button){
                        if(event==="rowclick" && $scope.rowclick!==undefined) {
                            $scope.rowclick.apply(null, [item]);
                        } else if(event === "rowButton") {
                            button.onclick.apply(null,[item]);
                        }
                    };
                    $scope.loadMore = function(step) {
                        step = step || 100;
                        for (var i = 0; i < step; i++) {
                            if ($scope.filteredresponse && $scope.filteredresponse[$scope.index]) {
                                $scope.apiresponse.push($scope.filteredresponse[$scope.index]);
                                $scope.index += 1;
                            }
                        }
                    };
                    $scope.caretType = false;
                    $scope.setToggleCollapse = {};
                    $scope.columnHeaderList = [];
                    $scope.fieldList = [];
                    $scope.apiresponse = "waiting";
                    $scope.toggleCollapse= function(index){
                        $scope.setToggleCollapse[index]=!$scope.setToggleCollapse[index];
                    };
                    $scope.selectApi=function(item){
                        $location.url("/apiReference/"+item.api);
                    };
                    if($scope.displayfields){
                        $scope.fieldList = $scope.displayfields.split(",");
                    }
                    if($scope.columnheaders && $scope.columnheaders.split(",").length===$scope.fieldList.length){
                        $scope.columnHeaderList = $scope.columnheaders.split(",");
                    }
                    else{
                        $scope.columnHeaderList  = angular.copy($scope.fieldList);
                    }

                    /* NEM: Comment lines 101 to 118 in this file in order to remove the dynamic resizing of pub table. */
                    $scope.unbindResize = function(event){
                        angular.element($window).unbind("resize", $scope.unbindResize);
                    };

                    angular.element($window).bind("resize", function() {
                        $debounce(resizeDiv.bind(this), 1000);

                    });

                    $debounce(resizeDiv.bind(this), 1000);

                    function resizeDiv() {
                        $scope.tableElement = document.getElementById("pm-api-table-id");
                        if($scope.tableElement){
                            $scope.tableElement.style.height= $window.innerHeight -$scope.footerlength + "px";
                        }
                        angular.element($window).unbind("resize", $scope.unbindResize);
                    }

                    /*$apiService.callApi($scope.endpoint).success(function (response) {

                        $scope.apiresponse = $scope.baseobject === undefined ? response : response[$scope.baseobject];
                        angular.forEach($scope.apiresponse, function(item){
                            for(var key in item){
                                if(item[key] && !isNaN(item[key])){
                                    item[key] = item[key].toString();
                                }
                                else if(!item[key]){
                                    item[key] = "";
                                }
                            }
                        });

                        $scope.response=angular.copy($scope.apiresponse);
                    }).error(function(){
                        $scope.apiresponse = "error";
                    });*/

                }]
            };
        }
    ]
    /*
     * Data Filter allowing tabular capitalization of the first letter.
     * TODO: Move filters to a centralized place.
     */
).filter("capitalize", function() {
        return function(input, scope) {
            if(!isNaN(parseInt(input,10))) {
                if (input!==null) {
                    input = input.toLowerCase();
                }
                return input.substring(0,1).toUpperCase()+input.substring(1);
            }
        };
    }
);