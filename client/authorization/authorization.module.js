
angular.module('authorization', [])
    .value('values', {})
    .constant('constants', {})
    .config(function () { })
    .run(function (authorization) { });

// dynamically register module in application (states module)
//angular.module('states').requires.push('authorization');

angular.module('authorization')
    .run(['$rootScope', '$state', '$stateParams', 'authorization', 'user.service',
        function ($rootScope, $state, $stateParams, authorization, user_service) {
            $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
                console.log(toState.name)
                $rootScope.toState = toState;
                $rootScope.toStateParams = toStateParams;

                //if (!user_service.is_identity_resolved()) authorization.authorize();
                if (toState.name == 'user.login') return;

                authorization.authorize();
            });

        }])
;
