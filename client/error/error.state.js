angular.module('error', [])
    .config(
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state("error", {
                    url: "/error",
                    templateUrl: 'client/error/error.template.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit'
                            ]);
                        }]
                    }
                })
                .state("error.404", {
                    url: "/404",
                    templateUrl: 'client/error/error_404View.html'
                })
                .state("error.500", {
                    url: "/500",
                    templateUrl: 'client/error/error_500View.html'
                })
                .state("error.401", {
                    url: "/401",
                    templateUrl: 'client/error/error_401.template.html'
                })

        })
;