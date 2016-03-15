"use strict";

var todoApp = angular.module("todoApp", ['ngAnimate']);

todoApp.controller("taskController", ["$scope", "$animate", function($scope, $animate) {
    
    // constant
    $scope.statusIcon = {
        finished: "glyphicon-ok",
        deleted: "glyphicon-trash"
    };
    
    // task list after filter
    $scope.tasks = [
        {content: "[demo] Pay monthly credit card",
        status: "ongoing"},
        {content: "[demo] Clean house",
        status: "finished"},
        {content: "[demo] Return books to library",
        status: "deleted"},
        {content: "[demo] Ask David about the book study material",
        status: "ongoing"},
        {content: "[demo] Pick up Roger from Suzanne middle school",
        status: "ongoing"},
        {content: "[demo] Prepare donation check for church",
        status: "finished"}
        ];

    // fill background full of window size
    $("#mainContainer").css("min-height", $(window).height());
}]);
