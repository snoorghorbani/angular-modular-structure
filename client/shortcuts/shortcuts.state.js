angular.module('shortcuts')
    .config(
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
            .state("restricted.shortcuts", {
                url: "/shortcuts",
                template: '<div ui-view autoscroll="false"/>',
                abstract: true
            })
        })
;