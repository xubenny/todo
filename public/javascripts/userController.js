todoApp.controller('userController', ['$scope', '$http', function($scope, $http) {
    
    $scope.logined = false;
    $scope.email = "";

    // Every time a modal is shown, if it has an autofocus element, focus on it.
    $('.modal').on('shown.bs.modal', function() {
        $(this).find('[autofocus]').focus();
    });
    
    $scope.onSignin = function(email, pw) {
        
        console.log("onSignin", email, pw);
        
        $http.post('/users/login', {email: email, password: pw}).then(
            
            // successCallback
            function (res) {
                
                console.log("post/users/login success", res.data);
                $scope.logined = true;
                
                // restore user data
                $scope.email = res.data.email;
                $("#signin").modal('hide');
                
            },
            // fail call back
            function (res) {
                
                console.log("post/users/login fail", res.data, res.status);
                $scope.logined = false;
                
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
    
}]);