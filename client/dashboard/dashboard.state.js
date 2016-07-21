angular.module('dashboard')
    .config(
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
            .state("restricted.dashboard", {
                url: "/dashboard",
                template: '<div ui-view autoscroll="false"/>',
                abstract: true
            })
        })
;