/*
 *  Admin angularjs
 *  controller
 */

angular
    .module('share')
        .controller('main_header.controller', ['$timeout', '$scope', '$filter', '$window', 'authentication',
            function ($timeout, $scope, $filter, $window, $authentication) {
                $scope.logout = function () {
                    $authentication.logout();
                }

                $('#menu_top').children('[data-uk-dropdown]').on('show.uk.dropdown', function () {
                    $timeout(function () {
                        $($window).resize();
                    }, 280)
                });
            }])
;
