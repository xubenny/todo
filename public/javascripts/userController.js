"use strict";

todoApp.controller('userController', ['$scope', '$http', 'user', function($scope, $http, user) {
    

    // if seperate the focus callback and show function, the focus will not work
    $scope.showModal = function(id) {
        
        // remove error feedback of last time
        $(".alert-dismissible").remove();

        // Every time a modal is shown, if it has an autofocus element, focus on it.
        $(id).on('shown.bs.modal', function () { 
            $(this).find('[autofocus]').focus();
        })
        .modal('show');
    }
    
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
    
    $scope.changePassword = function(oldPw, newPw) {
        
        $http.post('users/changepw', {oldPw: oldPw, newPw: newPw}).then(
            
            // success call back
            function(res) {
                console.log("post/users/changepw success");
                $("#changepw").modal('hide');
            },
            
            // fail call back
            function(res) {
                console.log("post/users/changepw fail");
                
                // tell user fail to change password
                if($("#changePwFail").length === 0) {
                    $("#changePwForm").prepend("<div class='alert alert-danger alert-dismissible' id='changePwFail' role='alert'> <button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>Fail, please input correct password.</div>");
                }

                // focus on autofocus element
                $('#signup').find('[autofocus]').focus();
            })
    }
    
    $scope.sendResetMail = function(to) {
        $("#forgotpw").modal('hide');
        
        $http.post('users/sendresetmail/', {email: to}).then(

            // success call back
            function(res) {
                console.log("post/sendresetmail success");
                
                $scope.feedbackTitle = 'Email sent to ' + to;
                $scope.feedbackContent = "To get back into your account, follow the instructions we've sent to your email address.";
                $("#mailsent").modal('show');
            },
            
            // fail call back
            function(res) {
                console.log("post/sendresetmail fail", res.data);
                
                $scope.feedbackTitle = 'Fail to send Email to ' + to;
                $scope.feedbackContent = res.data.response;
                $("#mailsent").modal('show');
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









