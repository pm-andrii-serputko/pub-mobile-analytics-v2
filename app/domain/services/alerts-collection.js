/*global angular*/
(function (angular) {
    "use strict";

    var app;

    app = angular.module("pub-ui-analytics.domain");

    /**
     * @ngdoc service
     * @name AlertsCollection
     * @kind function
     *
     * @description
     * Menege and create new instances of report models
     */
    app.factory("AlertsCollection", [function () {

        var AlertsCollection = function (options) {
            options = options || {};
            this.Model = options.model;
        };

        AlertsCollection.prototype = {

            methods: ["map", "reset", "all", "add", "findById"],

            /**
             * @description
             * Collection of report model
             */
            models: [],

            /**
             * @description
             * Adding and removing models
             * @param response {array}
             * return {object} self
             */
            reset: function (response) {
                this.models = [];

                angular.forEach(response, function (attrs) {
                    this.add(attrs);
                }, this);

                return this;
            },

            /**
             * @description
             * Returns list of all reports
             * return {array} reports
             */
            all: function () {
                return this.models;
            },

            /**
             * @description
             * Create and add a model to collection
             * @param attrs {object}
             */
            add: function (attrs) {
                var model = new this.Model(attrs);
                if (attrs && model.isValid()) {
                    this.models.push(model);
                }
            },

            /**
             * @description
             * Find model by Id and update it
             * @param id {number}
             * @param attrs {object}
             */
            update: function (id, attrs) {
                var model = this.models.filter(function (model) { return model.getId() === id; })[0];
                if (model) {
                    model.set(attrs);
                }

            },

            /**
             * @description
             * Find model by Id and remove it
             * @param id {number}
             */
            destroy: function (id) {
                this.models = this.models.filter(function (model) { return model.getId() !== id; });
            },

            findById: function (id) {
                var models = this.models.filter(function (model) {
                    return model.getId() === parseInt(id, 10);
                });

                return models[0];
            },

            each: function (iterator) {
                this.models.forEach(iterator);
            },

            map: function (iterator) {
                return this.models.map(iterator);
            }
        };

        return AlertsCollection;

    }]);


}).call(this, angular);