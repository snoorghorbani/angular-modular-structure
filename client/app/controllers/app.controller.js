/*
 *  Admin angularjs
 *  controller
 */

angular
    .module('share')
    .controller('mainCtrl', [
        '$scope',
        '$rootScope',
        'scopeManager',
        'notifyService',
        'locale', 
        function ($scope, $rootScope, scopeManager, notifyService, shortcuts_service, locale) {
            $rootScope.$scopeManager = scopeManager;
            $rootScope.$$$notify = notifyService;
            $rootScope.$$$models = {};
        }
    ])
;
