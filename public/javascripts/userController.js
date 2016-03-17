todoApp.controller('userController', ['$scope', '$http', 'user', function($scope, $http, user) {
    
    // for nav bar display user account
    $scope.email = "xbl@mail.com";

    // Every time a modal is shown, if it has an autofocus element, focus on it.
    $('.modal').on('shown.bs.modal', function() {
        $(this).find('[autofocus]').focus();
    });
    
    // get user logined status
    $http.get('/users/getstatus').then(

        // success callback
        function (res) {
            user.logined = true;
            $scope.email = res.data;
            console.log('get/users/getstatus', res.data);
        },
        // fail callback
        function (res) {
            user.logined = false;
        }
    );
    
    $scope.onSignin = function(email, pw) {
        
        console.log("onSignin", email, pw);
        
        $http.post('/users/login', {email: email, password: pw}).then(
            
            // success callback
            function (res) {
                
                console.log("post/users/login success");
                user.logined = true;
                
                // restore user data
                $("#signin").modal('hide');
                
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
                $('#signin').find('[autofocus]').focus();
            }
        );    
    }
    
    $scope.isLogined = function() {
        return user.logined;
    }
    
}]);