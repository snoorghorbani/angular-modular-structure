angular.module('dashboard')
    .run(['main_sidebar_menu.service', function (main_sidebar_menu_service) {
        main_sidebar_menu_service.registerNewSection({
            id: 1,
            title: 'dashboard.Main Of Dashboard',
            icon: 'icons.dashboard',
            link: 'restricted.dashboard.main'
        });
    }]);