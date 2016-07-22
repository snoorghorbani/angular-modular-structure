angular
    .module('app')
    .controller('windowCtrl', [
        '$scope',
        function ($scope) {
            $scope.hello = "Hello from Controller!";
        }
    ]);