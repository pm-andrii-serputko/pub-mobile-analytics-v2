/*global angular*/
/*jshint unused:false*/
(function (angular) {
    "use strict";

    var app;

    app = angular.module("pub-ui-analytics.common");
 
    app.factory("mediator", function () {

        var Mediator = (function(window, undefined) {
     
            function Mediator () {
                this._topics = {};
            }
         
            Mediator.prototype.subscribe = function (topic, callback) {
                if(!this._topics.hasOwnProperty( topic )) {
                    this._topics[topic] = [];
                }
         
                this._topics[topic].push(callback);
                return true;
            };
         
            Mediator.prototype.unsubscribe = function (topic, callback) {
                if(!this._topics.hasOwnProperty(topic) ) {
                    return false;
                }
         
                for(var i = 0, len = this._topics[topic].length; i < len; i++) {
                    if( this._topics[topic][i] === callback) {
                        this._topics[topic].splice(i, 1);
                        return true;
                    }
                }
         
                return false;
            };
         
            Mediator.prototype.publish = function () {
                var args = Array.prototype.slice.call(arguments);
                var topic = args.shift();
         
                if(!this._topics.hasOwnProperty(topic)) {
                    return false;
                }
         
                for(var i = 0, len = this._topics[topic].length; i < len; i++) {
                    this._topics[topic][i].apply(undefined, args);
                }
                return true;
            };
         
            return Mediator;
         
        })(window);

        return new Mediator();

    });

}).call(this, angular);