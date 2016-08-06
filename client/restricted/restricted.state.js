angular.module('restricted')
    .config(
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state("restricted", {
                    abstract: true,
                    url: "",
                    views: {
                        'main_header': {
                            templateUrl: 'public/header.template.html',
                            controller: 'main_header.controller'
                        },
                        'main_sidebar': {
                            templateUrl: 'public/main_sidebar.template.html',
                            controller: 'main_sidebar.controller'
                        },
                        '': {
                            templateUrl: 'public/restricted.template.html'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit',
                                'lazy_selectizeJS',
                                'lazy_switchery',
                                'lazy_prismJS',
                                'lazy_autosize',
                                'lazy_iCheck',
                                'lazy_themes',
                                'public/shortcuts.service.js',
                                'lazy_style_switcher'
                            ]);
                        }]
                    }
                })
        })
;