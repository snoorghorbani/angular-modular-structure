angular
    .module('app')
    .controller('numericTextboxCtrl', [
        '$scope',
        function ($scope) {
            $scope.value = 50;
        }
    ]);