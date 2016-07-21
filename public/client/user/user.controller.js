angular
    .module('user')
    .controller('user.controller', [
        '$scope',
        'user.service',
        'locale',
        '_',
        function ($scope,user_service ,locale, _) {
            var $scopeManager = new $scope.$scopeManager($scope);

        }
    ])
;