/*jshint unused:false*/
"use strict";

var app =  angular.module("pubSlicerApp");

app.directive("pubNlpInput",[
    "mediator",
    "pubAnalyticService",
    "pubNLPService",
    "pubURLService",
    "$compile",
    "slicerURLParamsService",
    "chartModel",
    "ngDialog",
    "$filter",
    "$location",
    "$route",
    "pubUniversalAnalyticService",
    "pageModel",

    function (mediator, pubAnalyticService, pubNLPService, pubURLService, $compile, slicerURLParamsService, chartModel, ngDialog, $filter, $location, $route, pubUniversalAnalyticService, pageModel) {
        return {
            restrict: "EA",
            require: "ngModel",

            link: function(scope, element, attrs, ngModel) {

                scope.read = function() {
                    ngModel.$setViewValue(element.html());
                };

                scope.togglePillTip = function(dimensinId, event){
                    var tooltip = document.querySelector("span.tooltip");

                    if (dimensinId && event){
                        var dimensionsCollection = pubAnalyticService.getHistoricDimensions();
                        var dimensionModel = dimensionsCollection.findDimensionById(dimensinId);
                        var target = event.target || event.srcElement;
                        scope.tooltipContent = dimensionModel.getDescription();
                        scope.tooltipPosition = target.offsetLeft-TOOLTIP_ADJUST_POSITION +"px";
                        scope.showTooltip = true;
                    }
                    else {
                        if (tooltip){
                            tooltip.className += " disapper";
                        }
                        scope.showTooltip = false;
                    }
                };

                scope.update = function () {
                    var dimensions, metrics, pillList;

                    scope.textProcessed = false;
                    scope.checkDuplicate = false;
                    scope.canEdit = false;
                    element[0].innerHTML = "";

                    // pillBtnMaker has duplicated logic
                    dimensions = pubAnalyticService.getHistoricDimensions();
                    dimensions = dimensions.getVisibleDimensions();
                    // pillBtnMaker has duplicated logic
                    metrics = pubAnalyticService.getHistoricMetrics();
                    metrics = metrics.getSelectedMetrics();

                    pillList = dimensions.concat(metrics).map(function (each) { return each.getName(); });

                    scope.pillBtnMaker(pillList);

                    if (pillList.length ===0) {
                        scope.nlpDisplay = "create report";
                    }

                    moveCursorToEnd();
                };

                scope.updateNlp = function(createReport){
                    var nlpElement = element[0];
                    nlpElement.innerHTML = "";
                    scope.textProcessed = false;
                    slicerURLParamsService.fetch();
                    var pillNum = countPill();
                    var dimensions = pubAnalyticService.getHistoricDimensions();
                    dimensions = dimensions.getVisibleDimensions();

                    var metrics = pubAnalyticService.getHistoricMetrics();
                    metrics = metrics.getSelectedMetrics();

                    var pillList=[];
                    angular.forEach(dimensions.concat(metrics),function(each){
                        pillList.push(each.getName());
                    });
                    scope.checkDuplicate = false;
                    if ((pillNum ===0) || (createReport === true)){
                        scope.canEdit = false;
                        scope.pillBtnMaker(pillList);

                    }

                    if ((createReport === true) && (pillList.length ===0)){
                        scope.nlpDisplay = "create report";
                    }
                    moveCursorToEnd();
                };

                scope.navigateNLP =  function(command){
                    var nlpElement = element[0];
                    var truncatedNlpText = nlpElement.innerHTML.split(" ").join("");
                    var truncatedCommand = command.split(" ").join("");

                    //clear out the dimension and metric selection.
                    slicerURLParamsService.reset();

                    //return if the command parameter is 'dashboard' and the nlp is empty, otherwiser nlp will convert to 'dashboard' when is empty.
                    if ((command === "dashboard") && (nlpElement.innerHTML.length === 0)){
                        return;
                    }
                    //return if the command parameter is 'standard report' and the nlp is empty and is aggregator, otherwiser nlp will convert to 'standard reports' when is empty.
                    else if ((command === "standard reports") && (nlpElement.innerHTML.length === 0) && (pubUniversalAnalyticService.isAggregator())){
                        return;
                    }

                    if  ( ((!API.duplicateCommands[truncatedCommand]) || (API.duplicateCommands[truncatedCommand] !==  API.duplicateCommands[truncatedNlpText]))) {
                        nlpElement.innerHTML = command;
                        scope.nlpDisplay = command;
                    }
                };


                scope.pillBtnMaker = function (pillList)  {

                    var dimensionsCollection = pubAnalyticService.getHistoricDimensions();
                    var metricsCollection = pubAnalyticService.getHistoricMetrics();
                    angular.forEach(pillList, function(pill, index) {
                        var dimensionModel;
                        dimensionModel = dimensionsCollection.findDimensionByName(pill);


                        var metricModel;
                        metricModel = metricsCollection.findMetricByName(pill);

                        var existingElement = pubNLPService.getPillListfromNlpStr(element[0].innerHTML.replace(pill,"")).join(HTML_TEXT.SPACE);

                        if (dimensionModel) {
                            element.html("slice ");

                            if (existingElement &&  (stringEndsWith(existingElement,HTML_TEXT.HYPERLINK_END_TAG + HTML_TEXT.SPACE))) {
                                element.append($compile(existingElement)( scope ));
                            }

                            pill= "<a pill class='nlp-pill selected dimension'  ng-click='pillNavigate(\"dimensions\")' ng-mouseover='togglePillTip(\""+dimensionModel.getId()+"\",$event)'  ng-mouseout='togglePillTip()'    contentEditable='false'  id='pill-"+ pill +"' >"+ pill +"</a>";
                            element.append($compile( pill+HTML_TEXT.SPACE)( scope ));
                        }
                        else if (metricModel) {
                            element.html("slice ");

                            if (existingElement &&  (stringEndsWith(existingElement,HTML_TEXT.HYPERLINK_END_TAG + HTML_TEXT.SPACE))) {
                                element.append($compile(existingElement)( scope ));
                            }
                            pill= "<a class='nlp-pill selected metric' ng-click='pillNavigate(\"metrics\")' contentEditable='false'  id='pill-"+ pill +"' >"+ pill +"</a>";
                            element.append($compile( pill+HTML_TEXT.SPACE)( scope ));
                        }
                    });
                };

                scope.pillNavigate = function (type) {
                    pageModel.setIsModifyingExistingReport(true);
                    type = pubUniversalAnalyticService.isAggregator()? "filter" : type;
                    var hash = slicerURLParamsService.getUrl(type, {f: slicerURLParamsService.getEncodedData()});
                    pubURLService.navigate(hash);
                };


                ngModel.$render = function() {
                    if (ngModel.$viewValue) {
                        element.html(ngModel.$viewValue);
                    }
                    else {
                        element.html("");
                    }
                    moveCursorToEnd();
                };

                var countPill = function(){
                    scope.nlpDisplay = scope.nlpDisplay || "";
                    var pillList = pubNLPService.getPillListfromNlpStr(scope.nlpDisplay);
                    var parsedPillList = pubNLPService.convertPilltoDimensionMetricList(pillList);
                    return pillList.length;
                };

                var moveCursorToEnd  = function () {
                    var range = document.createRange();
                    range.selectNodeContents(element[0]);
                    range.collapse(false);
                    var selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                };


                var stringEndsWith = function(str, suffix) {
                    return str.indexOf(suffix, str.length - suffix.length) !== -1;
                };

                var pubNlpInputInit = function(){
                    scope.pillNum = 0;

                    API = {
                        duplicateCommands: {
                            dashboard: "dashboard",
                            realtime: "dashboard",
                            createreport: "createReport",
                            createareport: "createReport",
                            createthereport: "createReport"
                        }
                    };

                    KEY_CODE = {
                        SPACE: 32,
                        ENTER: 13,
                        DELETE: 8
                    };

                    HTML_TEXT = {
                        SPACE: "&nbsp;",
                        HYPERLINK_END_TAG:"</a>"
                    };

                    BROWSERS = {
                        FIREFOX: "firefox"
                    };

                    TOOLTIP_ADJUST_POSITION = 60;

                    NLP_INPUT_LIMIT = 500;

                    var path = window.location.hash.split("?")[0];
                    if (path === "#/custom"){
                        scope.nlpDisplay = "custom reports";
                    }

                    if (path=== "#/standard"){
                        scope.nlpDisplay = "standard reports";
                    }

                    if (path=== "#/schedule"){
                        scope.nlpDisplay = "schedule reports";
                    }

                    if (path === ("#/dimensions") || path===("#/filter") || path ===("#/metrics")  ){
                        scope.nlpDisplay = "create report";
                    }

                    scope.$watch("nlpDisplay", function(newValue, oldValue) {
                        scope.pillNum = countPill();
                        scope.canEdit = true;
                        scope.cursorSwitcher = "";
                        
                        if (newValue && pubNLPService.isSlicePillCommand(newValue)){
                            scope.canEdit = false;
                            scope.cursorSwitcher = "non-editable";
                            scope.textProcessed = false;
                        }
                        else {
                            if (scope.nlpPaste === true){
                                var regex = /(<([^>]+)>)/ig;
                                scope.nlpDisplay = newValue.replace(regex, "");
                                newValue = scope.nlpDisplay;
                                scope.nlpPaste = false;
                            }
                            var nlp, url;
                            nlp = pubNLPService.match(newValue);
                            url = pubNLPService.nlpToURL(nlp);
                            pubNLPService.setNLP(nlp);
                            pubURLService.navigate(url);
                        }
                    });


                    mediator.subscribe("nlp.update", function () {
                        scope.update();
                    });


                    element.bind("keydown", function (event) {
                        var elementText = element[0].innerHTML;
                        var valid = true;


                        if (scope.nlpDisplay.length >= NLP_INPUT_LIMIT && event.keyCode !== KEY_CODE.DELETE){
                            event.preventDefault();
                            return;
                        }

                        //This will fix the problem that firefox conteneditable auto add tag at the end
                        if (navigator.userAgent.toLowerCase().indexOf(BROWSERS.FIREFOX) > -1) {
                            if (event.keyCode === KEY_CODE.SPACE) {
                                event.preventDefault();
                                scope.nlpDisplay = scope.nlpDisplay + HTML_TEXT.SPACE;
                            }

                            if (event.keyCode === KEY_CODE.DELETE) {
                                event.preventDefault();
                                if (stringEndsWith(elementText,HTML_TEXT.SPACE)){
                                    scope.nlpDisplay = scope.nlpDisplay.slice(0,scope.nlpDisplay.length - HTML_TEXT.SPACE.length);
                                }
                                else {
                                    scope.nlpDisplay = scope.nlpDisplay.slice(0,scope.nlpDisplay.length-1);
                                }
                            }
                        }
                    });

                    element.bind("onkeypress keypress", function (event) {
                        if (event.keyCode === KEY_CODE.ENTER) {
                            event.preventDefault();
                        }
                    });
                    
                    element.bind("blur keyup change", function() {
                        scope.$apply(scope.read);
                    });
                };

                var API;
                var KEY_CODE;
                var HTML_TEXT;
                var BROWSERS;
                var TOOLTIP_ADJUST_POSITION;
                var NLP_INPUT_LIMIT;

                pubNlpInputInit();
            }
        };
    }
]);