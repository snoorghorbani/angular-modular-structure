angular
    .module('shortcuts')
    .controller('shortcuts.controller', [
        '$scope',
        'shortcuts.service',
        'locale',
        '_',
        function ($scope,shortcuts_service ,locale, _) {
            var $scopeManager = new $scope.$scopeManager($scope);

        }
    ])
;