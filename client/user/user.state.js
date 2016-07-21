angular.module('user')
    .config(
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
            .state("user", {
                url: "/user",
                template: '<div ui-view autoscroll="false"/>',
                abstract: true
            })
        })
;