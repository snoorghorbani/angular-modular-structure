angular.module('user')
    .config(
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state("user.login", {
                    url: "/login",
                    templateUrl: 'public/user_login.template.html',
                    controller: 'loginCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit',
                                'lazy_parsleyjs',
                                'lazy_iCheck',
                                'public/user_login.controller.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Login',
                        roles: []
                    }
                });
        })
;