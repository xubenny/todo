"use strict";

var todoApp = angular.module("todoApp", ['ngAnimate']);

todoApp.controller("taskController", ["$scope", "$animate", function($scope, $animate) {
    
    // constant
    $scope.statusIcon = {
        finished: "glyphicon-ok",
        deleted: "glyphicon-trash"
    };
    
    //------------------------ initial varibles --------------------------------
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
    
    //------------------------- define function -----------------------------
    // update the status
    $scope.onCheck = function(task) {
        switch(task.status) {
            case "ongoing":
                task.status = "finished";
                break;
            case "finished":
                task.status = "ongoing";
                break;
            case "deleted":
                task.status = "finished";
                break;
        }
    }

    // permenent remove a deleted task, or temporary mark a normal task
    $scope.onRemove = function(task) {
        if(task.status === "deleted") {
            var index = $scope.tasks.indexOf(task);
            $scope.tasks.splice(index, 1);
        }
        else {
            task.status = "deleted";
        }
    }
    

}]);
