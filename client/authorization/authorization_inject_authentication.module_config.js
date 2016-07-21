angular
    .module('authorization')
        .config(["authorizationProvider",
            function (authorizationProvider) {
                authorizationProvider.set_authentication("authentication");
                authorizationProvider.set_login_state('user.login');
                authorizationProvider.set_forbidden_state('error.401');
            }]);
;