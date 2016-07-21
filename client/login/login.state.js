angular.module('login', [])
    .config(
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state("login", {
                    url: "/login",
                    templateUrl: 'client/login/login.template.html',
                    controller: 'loginCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit',
                                'lazy_iCheck',
                                'client/login/login.controller.js'
                            ]);
                        }]
                    }
                });
        })
;