angular.module('authentication', [])
    .value('values', {})
    .constant('constants', {})
    .config(function () { })
    .run(function () { });

// dynamically register module in application (states module)
angular.module('third_parties').requires.push('authentication');
