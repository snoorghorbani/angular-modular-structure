angular
    .module('authentication')
        .provider('authentication', [function () {
            var authenticationServicesName = [];
            var authenticationServices = {};

            return {
                register_authentication_provider: function (service) {
                    authenticationServicesName.push(service);
                },
                $get: ['$rootScope', '$injector', '_', function ($rootScope, $injector, _) {
                    _.each(authenticationServicesName, function (service) {
                        authenticationServices[service] = $injector.get(service);
                    });

                    return {
                        logout: authenticationServices['user.service'].logout,
                        authenticate: function (user) {
                            return authenticationServices['user.service'].authenticate(user).then(function (resp) {
                                $rootScope.$broadcast('login_succeed', resp);
                            });
                        },
                        is_authenticated: authenticationServices['user.service'].is_authenticated,
                        is_identity_resolved: authenticationServices['user.service'].is_identity_resolved,
                        is_in_role: authenticationServices['user.service'].is_in_role,
                        is_in_any_role: authenticationServices['user.service'].is_in_any_role,
                        get_user: authenticationServices['user.service'].get_user
                    }
                }]
            }
        }])
;
