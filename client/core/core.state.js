angular.module('restricted')
    .config(
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider
                .when('/dashboard', '/dashboard/main')
                .otherwise('/dashboard/main');
        })
;