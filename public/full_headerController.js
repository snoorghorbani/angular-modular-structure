angular
    .module('app')
    .controller('full_headerCtrl', [
        '$rootScope',
        '$scope',
        '$timeout',
        function ($rootScope,$scope,$timeout) {

            $rootScope.fullHeaderActive = true;

        }
    ]);