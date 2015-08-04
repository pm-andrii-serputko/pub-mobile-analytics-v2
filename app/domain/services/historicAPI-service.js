/*global angular*/
(function (angular) {
    "use strict";

    var app;

    app = angular.module("pub-ui-analytics.domain");

    app.factory("historicApiService", [
        "$q",
        "$http",
        "$filter",
        "pubAnalyticService",
        "middlewareRoutes",
        "DateModel",
        "pmTokenStorageService",
        "historicDao",
        "chartModel",

        function ($q, $http,$filter ,pubAnalyticService, middlewareRoutes, dateModel, tokenStorageService, historicDao, chartModel) {

            var tableDefer = $q.defer();
            var chartDefer = $q.defer();
            var tableDecorator = "defaultValue";

            var service = {
                addCompareToParams: function (params){
                    if (dateModel.getCompareFlag()) {
                        params.compFromDate = service.getCompareFromDate();
                        params.compToDate = service.getCompareToDate();
                    }
                },

                getFromDate: function (slash) {
                    var format = slash? "yyyy/MM/dd" : "yyyy-MM-ddTHH:mm";
                    return $filter("date")(dateModel.getStartDate(), format);
                },

                getToDate: function (slash) {
                    var format = slash? "yyyy/MM/dd" : "yyyy-MM-ddTHH:mm";
                    return $filter("date")(dateModel.getEndDate(), format);
                },

                convertDateToFormatted: function (date) {
                    var format = "yyyy-MM-ddTHH:mm";
                    return $filter("date")(date, format);
                },

                getCompareFromDate: function (slash) {
                    var format = slash? "yyyy/MM/dd" : "yyyy-MM-ddTHH:mm";
                    return $filter("date")(dateModel.getCompareStartDate(), format);
                },

                getCompareToDate: function (slash) {
                    var format = slash? "yyyy/MM/dd" : "yyyy-MM-ddTHH:mm";
                    return $filter("date")(dateModel.getCompareEndDate(), format);
                },

                dateToString: function (date) {
                    return $filter("date")(date, "yyyy/MM/dd");
                },

                getTimezone: function () {
                    return pubAnalyticService.getTimezone();
                },

                getDimensions: function (options) {
                    var dimensions;

                    dimensions = pubAnalyticService.getHistoricDimensions();
                    dimensions = dimensions.getVisibleDimensions();
                    if (!options.allDimensions && dimensions.length) {
                        dimensions = [dimensions[options.groupLevel - 1]];
                    }
                    dimensions = dimensions.map(function (dimension) { return dimension.getId(); });
                    dimensions = dimensions.join(",");

                    return dimensions;
                },

                getHeatmapDimensions: function (options) {
                    var dimensions, dimension;

                    dimensions = pubAnalyticService.getHistoricDimensions();
                    dimensions = dimensions.getVisibleDimensions();
                    dimension = dimensions[options.groupLevel - 1];
                    if (!dimension || !dimensions[options.groupLevel]){
                        return "";
                    }
                    else {
                        dimension = dimension.getId() +"," + dimensions[options.groupLevel].getId();
                        return dimension;
                    }
                },

                getMetrics: function () {
                    var metrics;

                    metrics = pubAnalyticService.getHistoricMetrics();
                    metrics = metrics.getSelectedMetrics().length ? metrics.getSelectedMetrics() : metrics.getDefaultMetricList();
                    metrics = metrics.map(function (model) { return model.getId(); }).join(",");

                    return metrics;
                },

                getPageSize: function (options) {
                    var dimensions, dimension, size;

                    dimensions = pubAnalyticService.getHistoricDimensions();
                    dimensions = dimensions.getVisibleDimensions();
                    dimension = dimensions[options.groupLevel - 1];

                    size = dimension ? dimension.getFilter().getRankValue() : 10;

                    return size;
                },

                getSort: function (options) {
                    var dimensions, dimension, metrics, rank, sort;

                    metrics = pubAnalyticService.getHistoricMetrics().getSelectedMetrics();
                    metrics = metrics.map(function (metric) { return metric.getId(); });
                    metrics = metrics.length ? metrics : pubAnalyticService.getHistoricMetrics().getDefaultIdList();

                    dimensions = pubAnalyticService.getHistoricDimensions();
                    dimensions = dimensions.getVisibleDimensions();
                    dimension = dimensions[options.groupLevel - 1];

                    rank = dimension && dimension.getFilter().getRank() === "bottom" ? "" : "-";

                    sort = dimension ? dimension.getFilter().getMetric() : metrics[0];

                    sort = rank + sort || "";

                    return sort;
                },

                getFilters: function (options) {
                    var dimensions, dimension, visibleDimensions, invisibleDimensions, filters, settings;

                    settings = {
                        comparison: options.comparison !== undefined ? options.comparison : true,
                        dimensionValue: options.dimensionValue !== undefined ? options.dimensionValue : true
                    };

                    dimensions = pubAnalyticService.getHistoricDimensions();
                    visibleDimensions = dimensions.getVisibleDimensions();
                    invisibleDimensions = dimensions.getInvisibleDimensions();


                    dimensions = [];

                    if (!options.allDimensions) {
                        dimension = visibleDimensions[options.groupLevel - 1];
                        if (dimension) {
                            dimensions.push(dimension);
                        }
                    } else {
                        dimensions = dimensions.concat(visibleDimensions);
                    }

                    dimensions = dimensions.concat(invisibleDimensions);

                    filters = [];

                    if (options.filters.length) {
                        options.filters.forEach(function (filter) {
                            filters.push(filter);
                        });
                    }

                    dimensions.forEach(function (dimension) {

                        /**
                         * It's hotfix for ADS-915 regarding to dealMetaId issue
                         */
                        if (dimension.getId() === "dealMetaId" && options.total) {
                            var dealMetaIdFilter = "dealMetaId notEq 0";
                            filters.push(dealMetaIdFilter);
                        }

                        if (dimension.getFilter().getComparison() && dimension.getFilter().getCompareValue() && settings.comparison) {
                            var metric, comparison, comparisonValue;

                            metric = dimension.getFilter().getMetric();
                            comparison = dimension.getFilter().getComparison();
                            comparisonValue = dimension.getFilter().getCompareValue();

                            filters.push(metric + " " + comparison + " " + comparisonValue);
                        }

                        if (dimension.getFilter().getDimensionValueFilters().length && settings.dimensionValue) {
                            var values, dimensionId;
                            dimensionId = dimension.getId();
                            values = dimension.getFilter().getDimensionValueFilters();
                            values = values.map(function (value) { return dimensionId + " eq "+ value; });
                            values = values.join(",");

                            filters.push(values);
                        }
                    });

                    filters = filters.join("&filters=");

                    return filters;

                },

                getChartMetrics: function () {
                    return chartModel.getMetric();

                },


                convertStringToDate: function (aggregation, str) {
                    if (aggregation === "date"){
                        return new Date(service.dateToString(str));
                    }
                    else if (aggregation === "hour"){
                        var timeArray = str.split("T");
                        var parsedTime = timeArray[0].split("-").join("/")+" "+timeArray[1]+":00";
                        return new Date(parsedTime);
                    }
                    else if (aggregation === "week"){
                        return dateModel.convertWeekToDate(str).startDate;
                    }
                    else if (aggregation === "month"){
                        return dateModel.convertMonthToDate(str).startDate;
                    }
                    else if (aggregation === "quarter"){
                        return dateModel.convertQuarterToDate(str).startDate;
                    }
                },

                parseLinechart: function(timeseriesBy, options, id , response) {

                    var timeIndex = response.columns.indexOf(timeseriesBy);
                    var valueIndex = response.columns.indexOf(service.getChartMetrics());
                    var dualScaleValueIndex, dualLine;



                    if (dateModel.getCompareFlag()){
                        valueIndex = dateModel.getCompareValue() === "compareAbsoluteChange" ? 4 : 3;
                    }

                    var newLine = {};
                    newLine.values = [];

                    if (response.rows.length ===0){
                        return null;
                    }
                    else if (timeIndex !== -1){
                        newLine.key = response.rows[0][timeIndex];
                    }


                    //for dual scale
                    if (chartModel.getIsDualScale()){
                        dualScaleValueIndex = response.columns.indexOf(chartModel.getDualScaleMetric());
                        dualLine = {};
                        dualLine.values = [];
                        if (timeIndex !== -1){
                            dualLine.key = response.rows[0][timeIndex];
                        }
                    }

                    var traverseDate, responseDate,timeList = [];


                    //When it is custom range for hour, we need accurate start hour
                    if (timeseriesBy === "hour" && dateModel.getStartDate().getHours() !== 0 ){
                        traverseDate = dateModel.getStartDate();
                    }
                    else {
                        traverseDate = new Date(service.getFromDate(true));
                    }



                    //Start from date of the datepicker in month is not the start date in week, need special conversion
                    var dimensions = pubAnalyticService.getHistoricDimensions();
                    dimensions = dimensions.getVisibleDimensions();

                    var endDate = dateModel.getEndDate();


                    if (timeseriesBy === "week" || (timeseriesBy === "date" && dimensions[0] && dimensions[0].getId() === "week")) {
                        var tempWeekNo = dateModel.convertDateToWeek(traverseDate);
                        traverseDate = dateModel.convertWeekToDate(tempWeekNo).startDate;
                        tempWeekNo = dateModel.convertDateToWeek(endDate);
                        endDate = dateModel.convertWeekToDate(tempWeekNo).endDate;
                    }

                    var rowCount = 0;
                    var lineIndex= dateModel.getCompareFlag() ? 1 :0;

                    for (lineIndex; traverseDate <=  endDate;lineIndex++ )
                    {
                        if (response.rows[rowCount]){
                            responseDate = this.convertStringToDate(timeseriesBy, response.rows[rowCount][timeIndex]);
                        }
                        else {
                            responseDate = null;
                        }

                        if (responseDate && responseDate.getTime() === traverseDate.getTime()){
                            //for special Compare Percentage
                            if (response.rows[rowCount][valueIndex] === "Infinity"){
                                response.rows[rowCount][valueIndex] = 100;
                            }
                            else if (typeof(response.rows[rowCount][valueIndex]) === "string"){
                                response.rows[rowCount][valueIndex] = Number(response.rows[rowCount][valueIndex]);
                            }

                            //for dual scale
                            if (dualScaleValueIndex){
                                if (response.rows[rowCount][dualScaleValueIndex] === "Infinity"){
                                    response.rows[rowCount][dualScaleValueIndex] = 100;
                                }
                                else if (typeof(response.rows[rowCount][dualScaleValueIndex]) === "string"){
                                    response.rows[rowCount][dualScaleValueIndex] = Number(response.rows[rowCount][dualScaleValueIndex]);
                                }


                                dualLine.values.push([lineIndex,response.rows[rowCount][dualScaleValueIndex]]);
                            }


                            newLine.values.push([lineIndex,response.rows[rowCount][valueIndex]]);
                            rowCount++;
                        }
                        else {
                            newLine.values.push([lineIndex,null]);
                            if (dualScaleValueIndex){
                                dualLine.values.push([lineIndex,null]);
                            }
                        }

                        if (timeseriesBy === "date"){
                            timeList.push(new Date(traverseDate));
                            traverseDate.setDate(traverseDate.getDate() + 1);
                        }
                        else if (timeseriesBy === "hour"){
                            timeList.push(new Date(traverseDate));
                            traverseDate.setHours(traverseDate.getHours() + 1);
                        }
                        else if (timeseriesBy === "week"){
                            timeList.push(dateModel.convertDateToWeek(traverseDate));
                            traverseDate.setDate(traverseDate.getDate() + 7);
                        }
                        else if (timeseriesBy === "month"){
                            timeList.push(dateModel.convertDateToMonth(traverseDate));
                            traverseDate.setMonth(traverseDate.getMonth() + 1);
                        }
                        else if (timeseriesBy === "quarter"){
                            timeList.push(dateModel.convertDateToQuarter(traverseDate));
                            traverseDate.setMonth(traverseDate.getMonth() + 3);
                        }
                    }
                    chartModel.setTimeList(timeList);
                    newLine.currency = response.currency;

                    if (dualLine){
                        dualLine.currency = response.currency;
                        newLine.leftScale = true;
                        return [newLine,dualLine];
                    }
                    return newLine;
                },


                parseLinechartCompareAV: function(timeseriesBy, options, id , response) {
                    if (dateModel.getCompareFlag() && (dateModel.getCompareValue() === "compareAbsoluteValue")){
                        var currentLine  = {};
                        currentLine.values =[];

                        var compareLine  = {};
                        compareLine.values = [];

                        var currentDualLine, compareDualLine;

                        if (chartModel.getIsDualScale()){
                            currentDualLine  = {};
                            currentDualLine.values =[];

                            compareDualLine  = {};
                            compareDualLine.values = [];
                        }



                        if (timeseriesBy === "date") {
                            var traverseDate = new Date(service.getFromDate(true));
                            var rowCount = 0;
                            for (var lineIndex=1; traverseDate <= new Date(service.getToDate(true));lineIndex++ )
                            {
                                var responseDate = response.rows[rowCount]? new Date(service.dateToString(response.rows[rowCount][0])) :null;

                                if (responseDate && responseDate.getTime() === traverseDate.getTime()){

                                    currentLine.values.push([lineIndex,response.rows[rowCount][1]]);
                                    compareLine.values.push([lineIndex,response.rows[rowCount][2]]);
                                    if (chartModel.getIsDualScale()){
                                        currentDualLine.values.push([lineIndex,response.rows[rowCount][5]]);
                                        compareDualLine.values.push([lineIndex,response.rows[rowCount][6]]);
                                    }

                                    rowCount++;
                                }
                                else {
                                    currentLine.values.push([lineIndex,null]);
                                    compareLine.values.push([lineIndex,null]);

                                    if (chartModel.getIsDualScale()){
                                        currentDualLine.values.push([lineIndex,null]);
                                        compareDualLine.values.push([lineIndex,null]);
                                    }

                                }
                                traverseDate.setDate(traverseDate.getDate() + 1);
                            }
                        }
                        else {
                            angular.forEach(response.rows, function(each,index){
                                currentLine.values.push([index+1,each[1]]);
                                compareLine.values.push([index+1,each[2]]);

                                if (chartModel.getIsDualScale()){
                                    currentDualLine.values.push([index+1,each[5]]);
                                    compareDualLine.values.push([index+1,each[6]]);
                                }
                            });
                        }

                        if (chartModel.getIsDualScale()){
                            currentLine.leftScale = true;
                            compareLine.leftScale = true;

                            return [currentLine, currentDualLine, compareLine, compareDualLine];
                        }

                        return [currentLine, compareLine];
                    }

                },


                chartDataParse: function (chartType, timeseriesBy, options, id , response) {
                    response = JSON.parse(response);

                    if (!response){
                        return response;
                    }

                    var hash = [];
                    for (var dimensionId in response.displayValue) {
                        hash[dimensionId] = [];
                        for (var temp in response.displayValue[dimensionId]) {
                            var displayName = response.displayValue[dimensionId][temp].split(" ").join("-");
                            if (hash[dimensionId][displayName]){
                                response.displayValue[dimensionId][temp] += "("+temp+")";
                            }
                            else {
                                hash[dimensionId][displayName]=temp;
                            }
                        }
                    }

                    var currency = response.currency;

                    if (angular.isDefined(response.columns) ) {
                        response.columns.forEach(function (column, index) {
                            if (response.displayValue && response.displayValue[column]) {
                                response.rows = response.rows.map(function (row) {
                                    var id = row[index];
                                    row[index] = response.displayValue[column][id] || id;
                                    return row;
                                });
                            }
                        });
                    }

                    if (chartType === "linechart"){
                        if (dateModel.getCompareFlag() && dateModel.getCompareValue() === "compareAbsoluteValue"){
                            return this.parseLinechartCompareAV(timeseriesBy, options, id , response);
                        }
                        else {
                            return this.parseLinechart(timeseriesBy, options, id , response);
                        }
                    }
                    else if (chartType === "heatmap"){
                        response.id = id;
                        return response;
                    }
                    else if(chartType === "scatterchart" && !id){
                        return response;
                    }
                    else {
                        if (id){
                            response.rows[0].push(id);
                            return {data: response.rows[0], currency: currency};
                        }
                        else {
                            return {data: response.rows, currency: currency};
                        }
                    }
                },

                getConfig: function (options) {
                    options = options || {};
                    options.groupLevel = options.groupLevel || 1;
                    options.filters = options.filters || [];
                    options.allDimensions = false;

                    var params, config, url;
                    var fromTime = this.getFromDate();
                    var toTime = this.getToDate();

                    url = middlewareRoutes.historic + "/" + pubAnalyticService.getUserType() +"/" + pubAnalyticService.getUserId();
                    if (options.byTime === true){
                        fromTime = options.timeDimension;
                        toTime = options.timeDimension;
                    }


                    params = {
                        fromDate: fromTime,
                        toDate: toTime,
                        metrics: this.getMetrics(),
                        dimensions: "",
                        pageNumber: 1,
                        dateUnit: dateModel.getAggregation(),
                        pageSize: this.getPageSize(options),
                        sort: "",
                        filters: this.getFilters(options)
                    };

                    if (dateModel.getCompareFlag()) {
                        params.compFromDate = this.getCompareFromDate();
                        params.compToDate = this.getCompareToDate();
                    }

                    if(!options.total){
                        params.dimensions = this.getDimensions(options);
                        params.sort = this.getSort(options);
                    }
                    url = "http://analytics-api.matrix.pubmatic.com/v1/analytics/data" + "/" + pubAnalyticService.getUserType() +"/" + pubAnalyticService.getUserId();
                    config = {
                        method: "GET",
                        url: url,
                        cache: false,
                        params: params,
                        timeout: tableDefer.promise
                    };

                    return config;
                }
            };


            return {

                exportData: function (options) {
                    options = options || {};
                    options.groupLevel = options.groupLevel || 1;
                    options.filters = options.filters || [];
                    options.type = options.type || "xls";
                    options.comparison = false;
                    options.dimensionValue = true;
                    options.allDimensions = true;

                    var params, url;

                    url = middlewareRoutes.exportData + "/" + pubAnalyticService.getUserType() +"/" + pubAnalyticService.getUserId() + "?";

                    params = {
                        fromDate: service.getFromDate(),
                        toDate: service.getToDate(),
                        metrics: service.getMetrics(),
                        dimensions: service.getDimensions(options),
                        pageNumber: 1,
                        dateUnit: dateModel.getAggregation(),
                        pageSize: service.getPageSize(options),
                        sort: service.getSort(options),
                        filters: service.getFilters(options),
                        type: options.type
                    };

                    params[tokenStorageService.getAuthType()] = $http.defaults.headers.common.PubToken;

                    for (var key in params) {
                        url += encodeURIComponent(key) + "=" + encodeURIComponent(params[key]) + "&";
                    }
                    return url;
                },


                getTableData: function (options) {
                    var config = service.getConfig(options);
                    return historicDao.decorate(tableDecorator).fetch(config);
                },

                getTotalData: function (options) {
                    var config = service.getConfig(options);
                    return historicDao.decorate("defaultValue").fetch(config);
                },


                fetchRealChartData: function (id,chartType, timeseriesBy, options, metricOrder) {

                    options = options || {};
                    options.groupLevel = options.groupLevel || 1;
                    options.filters = options.filters || [];
                    options.allDimensions = false;


                    var params, config,url;
                    var timeAsFirstDimension = false;
                    var fromTime = service.getFromDate();
                    var toTime = service.getToDate();
                    if ((service.getDimensions(options) === "date") || (service.getDimensions(options) === "hour")||
                        (service.getDimensions(options) === "week") || (service.getDimensions(options) === "month") || (service.getDimensions(options) === "quarter")) {
                        timeAsFirstDimension = true;
                    }

                    url = middlewareRoutes.historic + "/" + pubAnalyticService.getUserType() +"/" + pubAnalyticService.getUserId();

                    if (chartType === "linechart") {

                        var metrics = service.getChartMetrics();
                        if (chartModel.getIsDualScale()) {
                            metrics = metrics + "," + chartModel.getDualScaleMetric();
                        }

                        //Set for maximum number of days in year (leap year)
                        var maxPageSize = 366;

                        if (chartModel.getIsDefaultChart() !== true) {
                            if (timeAsFirstDimension === false){
                                options.filters.push(service.getDimensions(options)+" eq "+id);
                            }
                            else {
                                if (chartModel.getAggregation() !== service.getDimensions(options)) {
                                    fromTime = service.convertDateToFormatted(dateModel.universalConvert(id, service.getDimensions(options), chartModel.getAggregation()).startDate);
                                    toTime = service.convertDateToFormatted(dateModel.universalConvert(id, service.getDimensions(options), chartModel.getAggregation()).endDate);
                                }
                                else {
                                    fromTime = id;
                                    toTime = id;
                                }
                            }
                        }

                        params = {
                            fromDate: fromTime,
                            toDate: toTime,
                            dateUnit: chartModel.getAggregation(),
                            metrics: metrics,
                            dimensions: timeseriesBy,
                            pageNumber: timeAsFirstDimension? 1 : "" ,
                            sort: timeseriesBy,
                            pageSize: timeAsFirstDimension? maxPageSize : "" ,
                            filters: service.getFilters(options)
                        };

                        service.addCompareToParams(params);
                    }
                    else if (chartType === "heatmap") {
                        var result;
                        if (typeof(id)==="object") {
                            var list = id;
                            result = list.map(function(dimension) {
                                return service.getDimensions(options)+" eq "+dimension.id;
                            }).join();
                            options.filters.push(result);
                        }
                        else {
                            options.filters.push(service.getDimensions(options)+" eq "+id);
                        }


                        params = {
                            fromDate: fromTime,
                            toDate: toTime,
                            metrics: service.getChartMetrics(),
                            dateUnit: dateModel.getAggregation(),
                            dimensions: service.getHeatmapDimensions(options),
                            pageNumber: 1,
                            sort: "-"+service.getChartMetrics(),
                            pageSize: 1000,
                            filters: service.getFilters(options)
                        };

                        service.addCompareToParams(params);

                    }
                    else if(chartType==="scatterchart" && id){
                        if (timeAsFirstDimension === false) {
                            options.filters.push(service.getDimensions(options)+" eq "+id);
                        }
                        else {
                            fromTime = id;
                            toTime = id;
                        }

                        params = {
                            fromDate: fromTime,
                            toDate: toTime,
                            metrics: service.getMetrics(),
                            dateUnit: dateModel.getAggregation(),
                            dimensions: service.getDimensions(options),
                            pageNumber: 1,
                            pageSize: service.getPageSize(options),
                            filters: service.getFilters(options)
                        };
                    }
                    //For bar/pie/scatter/bubble charts. If id = default, if !id = non default chart
                    else {
                        if (!id){
                            var defaultChartMetrics = service.getMetrics().split(",");

                            var tempIndex = defaultChartMetrics.indexOf(service.getChartMetrics());

                            var selectedChartMetric = defaultChartMetrics[tempIndex];
                            if(metricOrder && (chartType==="scatterchart" || chartType==="bubblechart")){
                                var dimensions = pubAnalyticService.getHistoricDimensions(),
                                    sortMetric = defaultChartMetrics[0], dimension, metricFound;
                                dimensions = dimensions.getVisibleDimensions();
                                dimension = dimensions[0];
                                dimension.getFilter().setMetric(sortMetric);
                                metricFound = false;
                                angular.forEach(metricOrder, function(metric){
                                    if(metric===sortMetric){
                                        metricFound = true;
                                    }
                                });
                                if(metricFound === false){
                                    metricOrder.push(sortMetric);
                                }
                                defaultChartMetrics = metricOrder.join(",");
                            }else{
                                defaultChartMetrics[tempIndex] = defaultChartMetrics[0];
                                defaultChartMetrics[0] = selectedChartMetric;
                                defaultChartMetrics = defaultChartMetrics.join(",");
                            }


                            params = {
                                fromDate: fromTime,
                                toDate: toTime,
                                metrics: defaultChartMetrics,
                                dimensions: service.getDimensions(options),
                                pageNumber: 1,
                                dateUnit: dateModel.getAggregation(),
                                sort: service.getSort(options,chartType),
                                pageSize: service.getPageSize(options),
                                filters: service.getFilters(options)
                            };
                            service.addCompareToParams(params);
                        }
                        else {
                            if (timeAsFirstDimension === false) {
                                options.filters.push(service.getDimensions(options)+" eq "+id);
                            }
                            else {
                                fromTime = id;
                                toTime = id;
                            }

                            params = {
                                fromDate: fromTime,
                                toDate: toTime,
                                metrics: service.getChartMetrics(),
                                dateUnit: dateModel.getAggregation(),
                                dimensions: service.getDimensions(options),
                                pageNumber: 1,
                                pageSize: service.getPageSize(options),
                                filters: service.getFilters(options)
                            };
                        }
                    }

                    service.addCompareToParams(params);

                    url = "http://analytics-api.matrix.pubmatic.com/v1/analytics/data" + "/" + pubAnalyticService.getUserType() +"/" + pubAnalyticService.getUserId();
                    config = {
                        method: "GET",
                        url: url,
                        cache: false,
                        params: params,
                        timeout: chartDefer.promise,
                        transformResponse: service.chartDataParse.bind(service,chartType, timeseriesBy, options, id)
                    };


                    return $http(config);
                },

                abortTable: function () {
                    tableDefer.resolve();
                    tableDefer = $q.defer();
                },

                abortChart: function () {
                    chartDefer.resolve();
                    chartDefer = $q.defer();
                },

                abort: function () {
                    this.abortTable();
                    this.abortChart();
                },

                decorate: function (decorator) {
                    tableDecorator = decorator;
                    return this;
                }
            };
        }
    ]);

}).call(this, angular);



