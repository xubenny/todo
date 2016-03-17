"use strict";

todoApp.controller('userController', ['$scope', '$http', 'user', function($scope, $http, user) {
    
    // it doesn't work
    // Every time a modal is shown, if it has an autofocus element, focus on it.
    $('.modal').on('shown.bs.modal', function() {
        console.log("autofocus");
        $(this).find('[autofocus]').focus();
    });
    
    
    $scope.onSignin = function(email, pw) {
        
        console.log("onSignin", email, pw);
        
        $http.post('/users/login', {email: email, password: pw}).then(
            
            // success callback
            function (res) {
                
                console.log("post/users/login success");
                user.logined = true;
                user.email = res.data;
                
                // restore user data
                $("#signin").modal('hide');
                
                user.getTasks();
                
            },
            // fail callback
            function (res) {
                
                console.log("post/users/login fail", res.data, res.status);
                user.logined = false;
                
                var errMsg = res.data;
                if(res.status === 401) {
                    errMsg = 'Email or password does not match!';
                }
                
                // tell user name or password not correct
                if($("#loginFail").length === 0) {
                    $("#signinForm").prepend("<div class='alert alert-danger alert-dismissible' id='loginFail' role='alert'> <button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" + errMsg + "</div>");
                }
                
                // focus on autofocus element
                $('#signin').find('[autofocus]').focus();
            }
        );    
    }
    
    $scope.onSignup = function(email, pw) {
        
        $http.post('users/signup', {email: email, password: pw}).then(
            
            // success call back
            function(res) {
                console.log("post/users/signup success", res.data);
                
                $("#signup").modal('hide');
                
                // sign in immediately
                $scope.onSignin(email, pw);
            },
            
            // fail call back
            function(res) {
                console.log("post/signup fail", res.data, res.status);
         
                // tell user fail to sign up
                if($("#signupFail").length === 0) {
                    $("#signupForm").prepend("<div class='alert alert-danger alert-dismissible' id='signupFail' role='alert'> <button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>Signup fail, please try another name.</div>");
                }
                
                // focus on autofocus element
                $('#signup').find('[autofocus]').focus();
            }
        );
    }
    
    
    // for nav bar display user login status
    $scope.isLogined = function() {
        return user.logined;
    }
    
    // for nav bar display user account
    $scope.account = function() {
        return user.email;
    }
    
    $scope.logout = function() {
        user.logout();
    }
    
}]);









