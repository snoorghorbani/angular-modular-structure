angular
    .module('authentication')
        .config(["authenticationProvider",
            function (authenticationProvider) {
                authenticationProvider.register_authentication_provider("user.service");
            }])
;