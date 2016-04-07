"use strict";

todoApp.factory('user', ['$http', function($http) {
    var user = {
        logined: false,
        email: "",
        // tasks array address will be shared to controllers
        tasks: []
    };
    
    //--------------------- initial when start up -----------------------------
    
    // get user logined status
    $http.get('/users/getstatus').then(

        // success callback
        function (res) {
            user.logined = true;
            user.email = res.data;
            console.log('get/users/getstatus', res.data);
            
            user.getTasks();
        },
        // fail callback
        function (res) {
            user.logined = false;
            
            // fill some demo data
            user.tasks.copy([
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
            ]);
        }
    );

    //-------------------- public method for controllers -----------------------
    
    // taskController.tasks will use same address with user.tasks, so that userController can refresh the task view by changing user.tasks
    user.getTasks = function() {
        var self = this;

        $http.get('/users/gettasks').then(
        
            // success callback
            function(res) {
                console.log('get/users/gettasks success', res.data);
                
                // can not use '=' to tasks array, bucause it will change it's address
                self.tasks.copy(res.data);
            }
        );

    }
    
    user.logout = function() {
        var self = this;
        
        $http.get('/users/logout').then(

        // success callback
        function(res) {
            console.log("get/users/logout success");
        });     

        // logout, whether success or fail logout(maybe already session expire)
        self.logined = false;
        self.tasks.copy([]);
    }
    
    //--------------------- extend javascript array method ---------------------
    Array.prototype.copy = function(from) {
        while(this.length > 0)
            this.pop();
        
        for(var i=0; i<from.length; i++) {
            this.push(from[i]);
        }
    }
    
    //--------------------- return object --------------------------------------
    
    return user;
}]);