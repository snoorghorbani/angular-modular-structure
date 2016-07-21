angular
    .module('main_sidebar')
        .controller('main_sidebar.controller', [
            '$timeout',
            '$scope',
            '$rootScope',
            '$filter',
            '$rootScope',
            'main_sidebar_menu.service',
            'shortcuts.service',
            '$state',
            '_',
            'authentication',
            function ($timeout, $scope, $rootScope, $filter, $rootScope, main_sidebar_menu_service, shortcuts_service, $state, _, authentication) {

                $rootScope.sections = [];
                var sections = main_sidebar_menu_service.getSections();
                var state;
                var user = authentication.get_user();
                _.each(sections, function (section) {
                    state = $state.get(section.link);
                    if (!state.data || !state.data.roles || state.data.roles.length == 0 || authentication.is_in_any_role(state.data.roles))
                        $rootScope.sections.push(section);
                })

                $scope.shortcuts = shortcuts_service.getItems()

                $scope.$on('onLastRepeat', function (scope, element, attrs) {
                    $timeout(function () {
                        if (!$rootScope.miniSidebarActive) {
                            // activate current section
                            //$('#sidebar_main #menu_sections').find('.current_section > a').trigger('click');
                        } else {
                            // add tooltips to mini sidebar
                            var tooltip_elem = $('#sidebar_main').find('.menu_tooltip');
                            tooltip_elem.each(function () {
                                var $this = $(this);

                                $this.attr('title', $this.find('.menu_title').text());
                                UIkit.tooltip($this, {});
                            });
                        }
                    })
                });

                // language switcher
                $scope.langSwitcherModel = 'gb';
                var langData = $scope.langSwitcherOptions = [
                    { id: 1, title: 'English', value: 'gb' },
                    { id: 2, title: 'فارسی', value: 'fa' }
                ];
                $scope.langSwitcherConfig = {
                    maxItems: 1,
                    render: {
                        option: function (langData, escape) {
                            return '<div class="option">' +
                                '<i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i>' +
                                '<span>' + escape(langData.title) + '</span>' +
                                '</div>';
                        },
                        item: function (langData, escape) {
                            return '<div class="item"><i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i></div>';
                        }
                    },
                    valueField: 'value',
                    labelField: 'title',
                    searchField: 'title',
                    create: false,
                    onInitialize: function (selectize) {
                        $('#lang_switcher').next().children('.selectize-input').find('input').attr('readonly', true);
                    }
                };

            }
        ])