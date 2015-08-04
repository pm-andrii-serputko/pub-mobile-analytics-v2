/*global describe, it, expect, beforeEach, inject*/
/*jshint expr: true */
(function (angular) {
    "use strict";

    describe("common.extensions.angular.copy", function () {

        beforeEach(function () {
            module("pub-ui-analytics");
        });

        beforeEach(function () {
            inject(function($q, $rootScope) {
                this.$q = $q;
                this.$rootScope = $rootScope;
            });
        });

        describe("ADS-1808", function() {
            it("should copy promise object", function (done) {
                var defer = this.$q.defer();
                var promise = angular.copy(defer.promise);

                promise.then(function(data) {
                    expect(data).to.equal(777);
                    done();
                });
                defer.resolve(777);
                this.$rootScope.$apply();
            });
        });

        describe("Angular", function() {
            it("should have 1.3.15 version. If you updated angular version be sure angular.copy method works properly and it can copy Promise object", function () {
                expect(angular.version.full).to.equal("1.3.15");
            });
        });
    });

}).call(this, angular);