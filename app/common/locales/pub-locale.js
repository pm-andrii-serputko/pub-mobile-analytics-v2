/*global angular*/
(function (angular) {
    "use strict";

    var app;

    app = angular.module("ngLocale");

    app.factory("pubLocale", [
        "$translate",
        "$locale",
        "$timeout",
        "$q",
        "config",

        function ($translate, $locale, $timeout, $q, config) {

            return {

                deferred: $q.defer(),

                /**
                 * Load i18n files (ngLocales, translations) and inject them to application
                 *
                 * @param {string} locale
                 */
                set: function (locale) {
                    var ngLocalePath;
                    ngLocalePath = "common/locales/ngLocale/angular-locale_" + locale + ".js";
                    
                    this.load(ngLocalePath, function successCallback () {
                        var localInjector = angular.injector(["ngLocale"]),
                            externalLocale = localInjector.get("$locale");

                        var loadTranslates = function() {
                            this.overrideValues($locale, externalLocale);
                            this.deferred.resolve($locale);
                        }.bind(this);

                        $translate
                            .use(locale)
                            .then(loadTranslates)
                            .catch(function() {
                                $translate
                                    .use(config.defaultLocale)
                                    .then(loadTranslates);
                            });

                    }.bind(this), function errorCallback () {});

                    return this.deferred.promise;
                },

                /**
                 * Loads a script asynchronously
                 *
                 * @param {string} url The url for the script
                 * @param {function) callback A function to be called once the script is loaded
                 */
                load: function (url, callback, errorCallback) {
                    var script = document.createElement("script"),
                        body = document.getElementsByTagName("body")[0],
                        removed = false;

                    script.type = "text/javascript";
                    if (script.readyState) { // IE
                        script.onreadystatechange = function () {
                            if (script.readyState === "complete" ||
                                script.readyState === "loaded") {
                                script.onreadystatechange = null;
                                $timeout(function () {
                                    if (removed) {
                                        return;
                                    }
                                    removed = true;
                                    body.removeChild(script);
                                    callback();
                                }, 30, false);
                            }
                        };
                    } else { // Others
                        script.onload = function () {
                            if (removed) {
                                return;
                            }
                            removed = true;
                            body.removeChild(script);
                            callback();
                        };
                        script.onerror = function () {
                            if (removed) {
                                return;
                            }
                            removed = true;
                            body.removeChild(script);
                            errorCallback();
                        };
                    }
                    script.type = "text/javascript";
                    script.async = false;
                    script.src = url;

                    document.body.appendChild(script);
                },

                overrideValues: function (oldObject, newObject) {
                    angular.forEach(oldObject, function(value, key) {
                        if (!newObject[key]) {
                            delete oldObject[key];
                        } else if (angular.isArray(newObject[key])) {
                            oldObject[key].length = newObject[key].length;
                        }
                    }, this);
                    angular.forEach(newObject, function(value, key) {
                        if (angular.isArray(newObject[key]) || angular.isObject(newObject[key])) {
                            if (!oldObject[key]) {
                                oldObject[key] = angular.isArray(newObject[key]) ? [] : {};
                            }
                            this.overrideValues(oldObject[key], newObject[key]);
                        } else {
                            oldObject[key] = newObject[key];
                        }
                    }, this);
                }
            };
        }
    ]);

}).call(this, angular);


