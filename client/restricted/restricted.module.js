angular.module('restricted', [])
    .value('values', {})
    .constant('constants', {})
    .run(function () { });

// dynamically register module in application (states module)
angular.module('states').requires.push('restricted');
;