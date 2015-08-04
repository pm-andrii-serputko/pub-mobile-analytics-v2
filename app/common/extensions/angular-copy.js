(function(angular) {
    "use strict";
    /**
     * Angular copy method was overrided to fix issue with copping Promise object.
     */
    angular.copy = copy;

    function copy(source, destination, stackSource, stackDest) {
        if (isWindow(source) || isScope(source)) {
            throw ngMinErr("cpws",
                "Can't copy! Making copies of Window or Scope instances is not supported.");
        }

        if (!destination) {
            destination = source;
            if (source) {
                if (isArray(source)) {
                    destination = copy(source, [], stackSource, stackDest);
                } else if (isDate(source)) {
                    destination = new Date(source.getTime());
                } else if (isRegExp(source)) {
                    destination = new RegExp(source.source, source.toString().match(/[^\/]*$/)[0]);
                    destination.lastIndex = source.lastIndex;
                } else if (isPromise(source)) {
                    destination = source;
                } else if (isObject(source)) {
                    var emptyObject = Object.create(Object.getPrototypeOf(source));
                    destination = copy(source, emptyObject, stackSource, stackDest);
                }
            }
        } else {
            if (source === destination) {
                throw ngMinErr("cpi", "Can't copy! Source and destination are identical.");
            }

            stackSource = stackSource || [];
            stackDest = stackDest || [];

            if (isObject(source)) {
                var index = stackSource.indexOf(source);
                if (index !== -1) {
                    return stackDest[index];
                }

                stackSource.push(source);
                stackDest.push(destination);
            }

            var result;
            if (isArray(source)) {
                destination.length = 0;
                for (var i = 0; i < source.length; i++) {
                    result = copy(source[i], null, stackSource, stackDest);
                    if (isObject(source[i])) {
                        stackSource.push(source[i]);
                        stackDest.push(result);
                    }
                    destination.push(result);
                }
            } else {
                var h = destination.$$hashKey;
                if (isArray(destination)) {
                    destination.length = 0;
                } else {
                    angular.forEach(destination, function(value, key) {
                        delete destination[key];
                    });
                }
                for (var key in source) {
                    if (source.hasOwnProperty(key)) {
                        result = copy(source[key], null, stackSource, stackDest);
                        if (isObject(source[key])) {
                            stackSource.push(source[key]);
                            stackDest.push(result);
                        }
                        destination[key] = result;
                    }
                }
                setHashKey(destination, h);
            }

        }
        return destination;
    }

    function ngMinErr() {
        var minErr = angular.$$minErr("ng");
        minErr.apply(null, arguments);
    }


    /**
     * All methods below were grabed from angular.js file
     */
    function isWindow(obj) {
        return obj && obj.window === obj;
    }

    function isScope(obj) {
        return obj && obj.$evalAsync && obj.$watch;
    }

    function isFunction(value) {
        return typeof value === "function";
    }

    function isPromise(obj) {
        return obj && isFunction(obj.then);
    }

    function isArray(value) {
        return Array.isArray(value);
    }

    function isDate(value) {
        return Object.prototype.toString.call(value) === "[object Date]";
    }

    function isRegExp(value) {
        return Object.prototype.toString.call(value) === "[object RegExp]";
    }

    function isObject(value) {
        return value !== null && typeof value === "object";
    }

    function setHashKey(obj, h) {
        if (h) {
            obj.$$hashKey = h;
        } else {
            delete obj.$$hashKey;
        }
    }

}).call(this, angular);
