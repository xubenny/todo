"use strict";

var todoApp = angular.module("todoApp", ['ngAnimate']);

todoApp.controller("taskController", ["$scope", "$animate", "$http", "user", function($scope, $animate, $http, user) {
    
    // constant
    $scope.statusIcon = {
        finished: "glyphicon-ok",
        deleted: "glyphicon-trash"
    };
    
    //------------------------ initial varibles --------------------------------
    
    // share tasks address with user service so that other controller can access
    $scope.tasks = user.tasks;    
    
    //------------------------- define function -----------------------------

    // when "Add New Task" button is pressed
    $scope.onAddTask = function() {

        // can add task only after logined
        if(!user.logined) {
            // remove error feedback of last time
            $(".alert-dismissible").remove();

            // Every time a modal is shown, if it has an autofocus element, focus on it.
            $('#signin').on('shown.bs.modal', function () { 
                $(this).find('[autofocus]').focus();
            })
            .modal('show');
            
            return;
        }
        
        // display input bar
        $scope.inputTask = true;
        // deley a little to wait for the animation start, otherwise fail to focus
        setTimeout(function() {
            $('#inputTask').focus();
        }, 10);
    }
    
    // when "Done" button on right of new task input bar is pressed
    // new task insert in the front
    $scope.onAddDone = function() {
        
        // can add task only after logined
        if(!user.logined)
            return;

        var task = {content: $scope.content,
                    status: "ongoing",
                    time: Date.now()
                   };
        console.log("onAddDone", task);

        // upload to server
        $http.post('/users/addtask', task).then(
            function (res) {
                // unshift is an js array method to add new items to the beginning
                $scope.tasks.unshift(task); 

                // switch to filter "ongoing" so that the new task can be shown up
                if($scope.filter !== '' && $scope.filter !== 'ongoing') {
                    $scope.filter = "ongoing";
                }
                $scope.content = "";
                $('#inputTask').focus();
            },
            function (res) {
                // session expire, should logout
                user.logout();
            }
        );
    }

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
        
        if(!user.logined)
            return;
         
        // upload to server
        $http.post('/users/updatetask', task).then(
            function (res) {
            },
            function (res) {
                // session expire, should logout
                user.logout();
            }
        );   
    }

    // permenent remove a deleted task, or temporary mark a normal task
    $scope.onRemove = function(task) {
        if(task.status === "deleted") {
            var index = $scope.tasks.indexOf(task);
            $scope.tasks.splice(index, 1);

            if (!user.logined)
                return;
            
            // upload to server
            $http.post('/users/removetask', task).then(
                function (res) {
                },
                function (res) {
                    // session expire, should logout
                    user.logout();
                }
            );   
        }
        else {
            task.status = "deleted";
            
            if (!user.logined)
                return;
            
            // upload to server
            $http.post('/users/updatetask', task).then(
                function (res) {
                },
                function (res) {
                    // session expire, should logout
                    user.logout();
                }
            );   
        }
    }
    
    // remove all task marked with "deleted"
    $scope.onClearTrash = function() {
        // filter is a javascipt array method to create an subset array
        $scope.tasks = $scope.tasks.filter(function(task) {
            return task.status !== "deleted";
        });
        // should keep user service and controller share the same address
        user.tasks = $scope.tasks;

        if (!user.logined)
            return;
            
        // upload to server
        $http.get('/users/cleartrash').then(
            function (res) {
            },
            function (res) {
                // session expire, should logout
                user.logout();
            }
        );   
    }

    // when "Edit" icon in task item is pressed
    $scope.onEdit = function(index) {

        $scope.editItem = index;
        // deley a little to wait for the animation start, otherwise fail to focus
        setTimeout(function() {
            // assume that only one item is being edited
            $('.editItem:visible').eq(0).focus();
        }, 10);
    }
    
    // when "Done" button in task item is pressed
    // model will automatic sync with resultTasks, so tasks, bacause they share same objects
    $scope.onEditDone = function(task) {
        
        if (task.content == '')
            return;

        // exit edit mode
        $scope.editItem = -1;
        
        // if not logined, just modified local data
        if(!user.logined)
            return;
        
        // upload to server
        $http.post('/users/updatetask', task).then(
            function (res) {
            },
            function (res) {
                // session expire, should logout
                user.logout();
            }
        );
        
    }
    
    // clear content if right side of search input box is clicked 
    $scope.onClearSearch = function(e) {
        if(e.currentTarget.clientWidth - e.offsetX < 30) {
            $scope.keyword = '';
        }
    }
    
    // show pointer cursor when mouse move to right side of search input box
    $scope.onSearchHover = function(e) {
        if($scope.keyword !== "" && e.currentTarget.clientWidth - e.offsetX < 30) {
            $("#keyword").css("cursor", "pointer");
        }
        else {
            $("#keyword").css("cursor", "auto");
        }
    }
    


}]);
