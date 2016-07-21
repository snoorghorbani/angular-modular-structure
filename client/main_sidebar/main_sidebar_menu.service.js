angular
    .module('main_sidebar')
        .service('main_sidebar_menu.service', ['_', function (_) {
            var sections = [];
            this.registerNewSection = function (menuItems) {
                menuItems = (angular.isArray(menuItems)) ? menuItems : [menuItems];
                for (var i = 0; i < menuItems.length; i++) {
                    if (menuItems[i].parent) {
                        var parentSection =_.filter(sections, function (item) { return item.title == menuItems[i].parent });
                        parentSection[0].submenu = parentSection[0].submenu || [];
                        parentSection[0].submenu.push(menuItems[i]);
                    } else {
                        sections.push(menuItems[i]);
                    }
                }
            }
            this.register_sub_menu = function (menuItems) {
                menuItems = (angular.isArray(menuItems)) ? menuItems : [menuItems];
                for (var i = 0; i < menuItems.length; i++) {
                    if (menuItems[i].parent) {
                    } else {
                        sections.push(menuItems[i]);
                    }
                }
            }
            this.getSections = function () {
                return sections;
            }
        }]);