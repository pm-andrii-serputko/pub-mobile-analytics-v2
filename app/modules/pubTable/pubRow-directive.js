/*jshint quotmark:false*/
"use strict";
var app = angular.module("pubSlicerApp");

app.directive("pubRow", [
    "$compile",
    "pubTableService",
    "historicApiService",
    "$timeout",
    "mediator",

    function ($compile, pubTableService, historicApiService, $timeout, mediator) {

        var OFFLINE_TIMER_VALUE = 30;

        return {
            templateUrl: "modules/pubTable/pubRow-directive.html",
            restrict: "A",
            scope: {
                filters: "@",
                row: "=",
                selectedDimensions: "=",
                currentGroupingLevel: "=",
                showCheckbox: "="
            },
            replace: true,

            link: function (scope, element) {
                var newElement;
                var errorMessageElement;
                scope.isExpanded = false;
                scope.showSpinner = false;
                scope.showOfflineLabel = false;
                scope.loadingError = false;

                mediator.subscribe("compareValue_change", function () {
                    if (scope.isExpanded) {
                        historicApiService.getTableData(scope.tableParams).then(parseRows, getTableDataError);
                    }
                });
                scope.showInput = scope.selectedDimensions.length > 0;
                scope.nextGroupingLevel = scope.currentGroupingLevel + 1;

                scope.showExpandButton = (scope.selectedDimensions.length > scope.currentGroupingLevel) && scope.currentGroupingLevel > 0;

                scope.rowspan = 1;


                scope.$watch("rowspan", function (newRowspan, oldRowspan) {
                    if (scope.$parent.$parent.rowspan) {
                        scope.$parent.$parent.rowspan = scope.$parent.$parent.rowspan + newRowspan - oldRowspan;
                    }
                });

                scope.rows = [];

                scope.toggleRow = function (isFirstCell) {
                    var expand = isFirstCell && !scope.isExpanded && scope.showExpandButton;

                    return expand ? scope.expand() : scope.collapse();

                };

                scope.expand = function () {
                    if (scope.showOfflineLabel || scope.showSpinner) {
                        return;
                    }
                    var id = scope.row[0].id;
                    var parentDimension = scope.selectedDimensions[scope.currentGroupingLevel - 1];
                    scope.showSpinner = true;
                    scope.filters = scope.filters ? scope.filters.split("&") : [];
                    var byTime = false;
                    var rowTime;
                    var newFilter = [];
                    scope.filters.push(parentDimension.getId() + " eq " + id);
                    if (parentDimension.getGroupId() === "timeUnits") {
                        byTime = true;
                        rowTime = id;
                    }

                    angular.forEach(scope.filters,function(filter){
                        var name = filter.split(" eq ")[0];
                        var id = filter.split(" eq ")[1];
                        if ((name === "hour")  || (name === "date") || (name === "week") || (name === "month") || (name === "quarter")) {
                            byTime = true;
                            rowTime = filter.split(" eq ")[1];
                        }
                        else{
                            newFilter.push(name + " eq " + id);
                        }
                    });

                    scope.showOfflineLabel = false;
                    scope.offlineTimerValue = OFFLINE_TIMER_VALUE;
                    scope.filters = scope.filters.join("&");
                    newFilter = newFilter.join("&");
                    scope.tableParams = {
                        groupLevel: scope.nextGroupingLevel,
                        filters: newFilter ? newFilter.split("&") : [],
                        byTime: byTime,
                        timeDimension : rowTime
                    };

                    historicApiService.getTableData(this.tableParams).then(getTableDataSuccess, getTableDataError);
                };

                function getTableDataSuccess (response) {
                    parseRows(response);
                    scope.rowspan = scope.rows.length + 1;
                    scope.isExpanded = true;
                    scope.showSpinner = false;

                    if (!newElement) {
                        newElement = angular.element('<tr pub-row ng-repeat="row in rows track by $index" filters={{filters}} row="row" show-checkbox="showCheckbox" selected-dimensions="selectedDimensions" current-grouping-level="nextGroupingLevel"></tr>');
                        element.after(newElement);
                        $compile(newElement)(scope);
                    }
                }

                function parseRows(response) {
                    scope.rows = pubTableService.parseRows(response.rows, {
                        dimensions: scope.selectedDimensions,
                        groupingLevel: scope.nextGroupingLevel
                    });
                }

                function getTableDataError () {
                    scope.showSpinner = false;
                    if (!window.navigator.onLine) {
                        scope.showOfflineLabel = true;
                        scope.startOfflineTimer();
                    } else {
                        scope.showOfflineLabel = false;
                        scope.rowspan = 2;
                        scope.isExpanded = true;
                        scope.loadingError = true;
                        if (!errorMessageElement) {
                            errorMessageElement = angular.element('<tr ng-if="loadingError"><td ng-click="collapse();expand();" class="alert-box alert-bg" colspan="{{row.length}}">{{"ERROR.LOADING_FAILED" | translate}}</td></tr>');
                            element.after(errorMessageElement);
                            $compile(errorMessageElement)(scope);
                        }
                    }
                }

                scope.startOfflineTimer = function () {
                    $timeout(function () {
                        scope.offlineTimerValue = scope.offlineTimerValue - 1;
                        if (scope.offlineTimerValue <= 0) {
                            scope.showOfflineLabel = false;
                            scope.expand();
                        } else {
                            scope.startOfflineTimer();
                        }
                    }, 1000);
                };

                scope.collapse = function () {
                    scope.loadingError = false;
                    scope.isExpanded = false;
                    scope.rowspan = 1;
                    scope.rows = [];
                };
            }
        };
    }
]);