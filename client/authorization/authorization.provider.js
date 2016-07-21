angular
    .module('authorization')
        .provider('authorization', [
            function () {
                var authenticationServiceName;
                var config = {};
                return {
                    set_authentication: function (service) {
                        authenticationServiceName = service;
                    },
                    set_login_state: function (stateName) {
                        config.loginState = stateName;
                    },
                    set_forbidden_state: function (stateName) {
                        config.forbiddenState = stateName;
                    },
                    $get: ['$injector', '$rootScope', '_', '$state',
                        function ($injector, $rootScope, _, $state) {
                            var authenticationServices = $injector.get(authenticationServiceName);

                            return {
                                authorize: function () {
                                    var isAuthenticated = authenticationServices.is_authenticated();

                                    if ($rootScope.toState.data &&
                                        $rootScope.toState.data.roles &&
                                        $rootScope.toState.data.roles.length > 0 &&
                                        !authenticationServices.is_in_any_role($rootScope.toState.data.roles)) {

                                        if (isAuthenticated)
                                            setTimeout(function myfunction() {
                                                $state.go(config.forbiddenState); // user is signed in but not authorized for desired state
                                            }, 0)
                                        else {
                                            // user is not authenticated. stow the state they wanted before you
                                            // send them to the signin state, so you can return them when you're done
                                            $rootScope.returnToState = $rootScope.toState;
                                            $rootScope.returnToStateParams = $rootScope.toStateParams;

                                            // now, send them to the signin state so they can log in
                                            setTimeout(function myfunction() {
                                                $state.go(config.loginState, {});
                                            }, 0)
                                        }
                                    }
                                }
                            };
                        }]
                }
            }
        ])
;