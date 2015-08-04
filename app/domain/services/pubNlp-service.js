/*global angular*/
(function (angular) {
    "use strict";

    angular
        .module("pub-ui-analytics.domain")

        .factory("pubNLPService", [
        "pubNLPService.Slice",
        "pubNLPService.Dashboard",
        "pubNLPService.Config",
        "pubNLPService.Createreport",
        "pubNLPService.Help",
        "pubNLPService.Alerts",
        "pubNLPService.Standardreport",
        "pubNLPService.Customreport",
        "pubNLPService.ScheduleReports",
        "pubNLPService.Benchmark",
        
        function (slice, dashboard, config, createReport, help, alerts, standardReport, customReport, scheduleReports, benchmark) {
            var SLICE_COMMAND_FORMAT = "slice <a";


            var API = {

                nlp: "",

                expr: /\s?(\w*(?=\s)?)/,

                /**
                 * NLP commands
                 */
                commands: {
                    slice: help,
                    dashboard: dashboard,
                    config: config,
                    help: help,
                    realtime: dashboard,
                    standardreports: standardReport,
                    createreport: createReport,
                    createareport: createReport,
                    createthereport: createReport,
                    customreports: customReport,
                    scheduledreports: scheduleReports
                },
                getCommand: function(searchQuery){
                    var isCommand = false;
                    var command = "";
                    var wordList = searchQuery.split(API.expr);
                    for (var i=0; i < wordList.length ;i++ ){
                        command =  wordList.slice(0, i+1).join("");
                        command = command.toLowerCase();
                        if (this.has(command)) {
                            isCommand = true;
                            break;
                        }
                    }

                    return isCommand ? command : "";
                },

                has: function (key) {
                    return this.commands.hasOwnProperty(key);
                },

                run: function (key, searchQuery) {
                    var fn = this.commands[key.toLowerCase()];

                    return fn(searchQuery);
                }
            };

            return {
                setNLP: function (value) {
                    API.nlp = value;
                },

                getNLP: function () {
                    return API.nlp;
                },
                getCommandList: function(){
                    return Object.keys(API.commands);
                },

                setAggregatorCommand: function(){
                    API.commands = {
                        slice: help,
                        config: config,
                        help: help,
                        standardreports: standardReport,
                        scheduledreports: scheduleReports
                    };
                },

                setAlertCommand: function(){
                    API.commands.alerts = alerts;
                },

                setBenchmarkCommand: function(){
                    API.commands.benchmarking = benchmark;
                },

                match: function (searchQuery) {
                    searchQuery = searchQuery || "";
                    var newNlp = "";

                    var command = API.getCommand(searchQuery);

                    if (command) {
                        newNlp = API.run(command, searchQuery);
                    } else {
                        //TODO: find a way to navigate to home, right now dashboard is default
                        var path = window.location.hash.split("?")[0];
                        if ((path !== "#/") || (searchQuery)){
                            newNlp = (!searchQuery || searchQuery.length===0) ? API.run("loginlinks", searchQuery) : API.run("help", searchQuery);
                        }
                    }

                    return newNlp;
                },
                isCommand: function (searchQuery) {
                    return API.getCommand(searchQuery) !== "";
                },

                /**
                 * Convert NLP search query to URL hash
                 * @params nlp {string}
                 * @returns {string} Converted URL hash
                 */
                nlpToURL: function (nlp) {
                    var url = nlp.replace(" ", "/");
                    return url;
                },

                getPillListfromNlpStr: function(nlpStr){
                    var pillList = [];
                    var result;
                    if (nlpStr.indexOf("slice ") === 0){
                        result = nlpStr.split("slice ")[1];
                    }
                    else{
                        result = nlpStr.split("analyze ")[1];
                    }

                    if (result){
                        pillList = result.split("&nbsp;");
                    }

                    return pillList;
                },

                convertPilltoDimensionMetricList: function(pillList) {
                    var parsedPillList = [];
                    angular.forEach(pillList, function(pill) {
                        var match = pill.match(/.*<a .*>(.*?)\W.*/);
                        if (match) {
                            var pillElement = angular.element(pill);
                            parsedPillList.push(pillElement[0].innerHTML);
                        }
                    });
                    return parsedPillList;
                },

                isSliceCommand: function(str){
                    return str.indexOf("slice ") === 0;
                },

                isSlicePillCommand: function(str){
                    return str.indexOf(SLICE_COMMAND_FORMAT) === 0;
                }
            };
        }
    ]);

}).call(this, angular);
