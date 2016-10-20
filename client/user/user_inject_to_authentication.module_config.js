angular
    .module('user')
        .config(["authenticationProvider", "user.serviceProvider",
            function (authentication, user_service) {
                authentication.register_authentication_provider("user.service");
            }])
;