/*global angular*/
(function (angular) {
    "use strict";

    var app = angular.module("pubSlicerApp");

    app.directive("pubFilterDragAndDrop", function () {

        var draggableEl;

        return {
            restrict: "A",
            link: function ($scope, element) {

                var handleDragStart = function (e) {
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/html", this.innerHTML);
                    this.classList.add("drag-and-drop-move");

                    // Copy draggable DOM Element
                    draggableEl = this;
                };

                var handleDragOver = function (e) {
                    if (e.preventDefault) {
                        e.preventDefault();
                    }

                    var middleY = e.target.clientHeight / 2;
                    var y = e.offsetY || e.layerY;
                    
                    if (middleY < y) {
                        // insert element after
                        this.parentNode.insertBefore(draggableEl, this.nextSibling);
                    } else {
                        // insert element befor
                        this.parentNode.insertBefore(draggableEl, this);
                    }


                    return false;
                };

                var handleDragEnd = function () {
                    this.classList.remove("drag-and-drop-move");

                    if ($scope.drop) {
                        $scope.drop($scope.dimension, this.parentNode.attributes.visible.value);
                    }
                };

                // add event Listener
                element[0].addEventListener("dragstart", handleDragStart, false);
                element[0].addEventListener("dragover", handleDragOver, false);
                element[0].addEventListener("dragend", handleDragEnd, false);

            }
        };

    });

}).call(this, angular);
