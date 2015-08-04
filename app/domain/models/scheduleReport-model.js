/*global angular*/
(function (angular) {
    "use strict";

    var app;

    app = angular.module("pub-ui-analytics.domain");

    app.factory("ScheduleReportModel", [function () {

        /**
         * @constructor
         */
        var ScheduleReportModel = function (attrs) {
            /**
             * The default attributes of model
             */
            this.attributes = {
                id: null,
                reportId: null,
                reportType: "CUSTOM", // CUSTOM, STANDARD
                downloadType: "EXCEL", // CSV
                frequency: "DAILY", // DAILY, WEELKY, MONTHLY
                day: 1,
                hour: 1,
                ampm: "AM", // AM, PM
                email: null,
                subject: "",
                comment: "",
                reportName: ""
            };

            attrs = attrs || {};
            this.attributes = this.parse(attrs);
        };

        ScheduleReportModel.prototype = {

            /**@constructor*/
            constructor: ScheduleReportModel.prototype.constructor,

            /**
             * @description
             * The function is passed the raw response object,
             * and should return the attributes hash to be set on the model.
             * @params response {object}
             * @returns {object} attributes hash
             */
            parse: function (response) {
                var attrs = {
                    id: response.id || this.attributes.id,
                    reportId: response.reportId || this.attributes.reportId,
                    reportType: response.reportType || this.attributes.reportType,
                    downloadType: response.downloadType || this.attributes.downloadType,
                    frequency: response.frequency || this.attributes.frequency,
                    day: response.day || this.attributes.day,
                    ampm: response.ampm || this.attributes.ampm,
                    email: response.email || this.attributes.email,
                    subject: response.subject || this.attributes.subject,
                    comment: response.comment || this.attributes.comment,
                    reportName: response.reportName || this.attributes.reportName
                };

                attrs.hour = response.hour || this.attributes.hour;

                if (response.hour === 0) {
                    attrs.hour = 0;
                }

                attrs = this.to12Hour(attrs);

                return attrs;
            },

            get: function (attr) {
                return this.attributes[attr];
            },

            set: function (attrs) {
                attrs = this.parse(attrs);
                for (var key in attrs) {
                    this.attributes[key] = attrs[key];
                }
            },

            getId: function () {
                return this.attributes.id;
            },

            setId: function (value) {
                this.attributes.id = value;
            },

            getReportId: function () {
                return this.attributes.reportId;
            },

            setReportId: function (value) {
                this.attributes.reportId = value;
            },

            getReportType: function () {
                return this.attributes.reportType;
            },

            setReportType: function (value) {
                this.attributes.reportType = value;
            },

            getDownloadType: function () {
                return this.attributes.downloadType;
            },

            setDownloadType: function (value) {
                this.attributes.downloadType = value;
            },

            getFrequency: function () {
                return this.attributes.frequency;
            },

            setFrequency: function (value) {
                this.attributes.frequency = value;
            },

            getDay: function () {
                return this.attributes.day;
            },

            setDay: function (value) {
                this.attributes.day = value;
            },

            getHour: function () {
                return this.attributes.hour;
            },

            setHour: function (value) {
                this.attributes.hour = value;
            },

            getAmpm: function () {
                return this.attributes.ampm;
            },

            setAmpm: function (value) {
                this.attributes.ampm = value;
            },

            getEmail: function () {
                return this.attributes.email;
            },

            setEmail: function (value) {
                this.attributes.email = value;
            },

            getSubject: function () {
                return this.attributes.subject;
            },

            setSubject: function (value) {
                this.attributes.subject = value;
            },

            getComment: function () {
                return this.attributes.comment;
            },

            setComment: function (value) {
                this.attributes.comment = value;
            },
            getReportName: function () {
                return this.attributes.reportName;
            },

            setReportName: function (value) {
                this.attributes.reportName = value;
            },

            isValid : function(){
                //TODO: Implement validate method here.
                return true;
            },

            to12Hour: function(attrs){
                attrs.ampm = attrs.hour < 12 ? "AM" : "PM";
                attrs.hour = attrs.hour === 0 ? 12 : ((attrs.hour > 12) ? attrs.hour - 12 : attrs.hour);
                return attrs;
            },

            to24Hour: function(attrs) {
                var tokens = /([10]?\d)/i.exec(attrs.hour);
                if (tokens === null) { return null; }
                if (attrs.ampm.toLowerCase() === "pm" && tokens[1] !== "12") {
                    tokens[1] = "" + (12 + (+tokens[1]));
                } else if (attrs.ampm.toLowerCase() === "am" && tokens[1] === "12") {
                    tokens[1] = 0;
                }
                attrs.hour = parseInt(tokens[1],10);
                return attrs;
            },

            toJSON: function (attrs) {
                attrs = attrs || this.attributes;
                attrs = angular.copy(attrs);
                attrs = this.to24Hour(attrs);
                return attrs;
            }

        };

        ScheduleReportModel.decorators = {};
        ScheduleReportModel.decorators.shortDay = {
            getDay: function () {
                var frequency = this.report.getFrequency();

                if (frequency === "DAILY") {
                    return "Mon - Sun";
                }

                if (frequency === "WEEKLY") {
                    var week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                    return week[this.report.getDay()];
                }

                if (frequency === "MONTHLY") {
                    var day = this.report.getDay() + "'th";

                    if (this.report.getDay() === 1 || this.report.getDay() === 21 || this.report.getDay() === 31) {
                        day = this.report.getDay() + "'st";
                    }

                    if (this.report.getDay() === 2 || this.report.getDay() === 22) {
                        day = this.report.getDay() + "'nd";
                    }

                    if (this.report.getDay() === 3 || this.report.getDay() === 23) {
                        day = this.report.getDay() + "'rd";
                    }

                    return "Every " + day +" day";
                }
            }
        };

        ScheduleReportModel.prototype.decorate = function (decorator) {
            var F = function () {}, overrides = this.constructor.decorators[decorator], i, newobj;
            F.prototype = this;
            newobj = new F();
            newobj.report = F.prototype;
            for (i in overrides) {
                if (overrides.hasOwnProperty(i)) {
                    newobj[i] = overrides[i];
                }
            }
            return newobj;
        };

        return ScheduleReportModel;

    }]);

}).call(this, angular);