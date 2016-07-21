angular
    .module('dashboard')
    .controller('dashboard.controller', [
        '$scope',
        'dashboard.service',
        'locale',
        '_',
        function ($scope,dashboard_service ,locale, _) {
            var $scopeManager = new $scope.$scopeManager($scope);

        }
    ])
;