angular
    .module('third_parties', [
        'ui.router',
        'oc.lazyLoad',
        'ngSanitize',
        'ngResource',
        'ngRetina',
        'ngLocalize',
        'ngLocalize.Config',
        'ConsoleLogger',
        'infinite-scroll',
        'scopeManager',
        'ngFileUpload',
        'sutility'
    ])
    .value('values', {})
    .constant('constants', {})
    .run(function () { });


angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 25);