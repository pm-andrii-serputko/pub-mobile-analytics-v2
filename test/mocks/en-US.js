(function (angular) {
    "use strict";

    var app = angular.module("pub-ui-analytics");

    app.value("enUSMock", {
        "DASHBOARD": {
            "RTD": "Real Time Dashboard",
            "CURRENT_TIME": "Current time",
            "LAST_20_MIN": "last 20 mins",
            "LOADING": "Retrieving up-to-the-minute data...",
            "DAY_SUMMARY": "Day Summary",
            "REVENUE": "Revenue",
            "IMPRESSION": "Impression",
            "ECPM": "eCPM",
            "DATA_IS_LIVE": "Data is Live",
            "DATA_IS_STATIC": "Data is Static",
            "TOP_10": "Top 10",
            "SELECT_SITE": "Select Site",
            "SELECT": "Select",
            "VIEW_BY": "View by"
        },
        "SEARCH": {
            "ALL_PUBMATIC_REPORTS": "All PubMatic reports",
            "HOW_ABOUT": "How about trying something like this?",
            "BUILD_REPORTS_ON_FLY": "Build reports on-the-fly by typing",
            "VIEW_BUISINESS_SUMMARY": "View your current business summary by type",
            "HERE_WHAT_WE_FOUND_FOR": "Here's what we found for"
        },
        "NLP": {
            "SLICE": "slice",
            "DASHBOARD": "dashboard"
        },
        "SLICER": {
            "REPORT_TITLE": "Create a custom report",
            "DOWNLOAD_EXCEL_FILE": "Download as Excel file",
            "DOWNLOAD_CSV_FILE": "Download as CSV file"
        },
        "CONFIG": {
            "TITLE": "Config",
            "APP_VERSION": "App Version",
            "BUILD_DATA": "Build Data",
            "GIT_COMMIT": "Git Commit",
            "SELECT": "Select Language"
        }
    });

}).call(this, angular);