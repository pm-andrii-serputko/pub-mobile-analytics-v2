(function () {
    "use strict";

    /**
     * Extend instance and static properties
     * @params instanceProperties {object}
     * @params staticProperties {object}
     * @returns {function} Class
     */
    Function.prototype.extend = function(instanceProperties, staticProperties) {
        for (var i in instanceProperties) {
            this.prototype[i] = instanceProperties[i];
        }
     
        for (var j in staticProperties) {
            this[j] = staticProperties[j];
        }
     
        return this;
    };
     
}).call(this);