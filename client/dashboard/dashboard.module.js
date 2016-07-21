angular.module('dashboard', [])
    .value('values', {})
    .constant('constants', {})
    .config(function () { })
    .run(function () { });

// dynamically register module in application (states module)
angular.module('states').requires.push('dashboard');