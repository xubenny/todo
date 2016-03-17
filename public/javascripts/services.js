todoApp.factory('user', [function($http) {
    var user = {
        logined: false
    };
    
    return user;
}]);