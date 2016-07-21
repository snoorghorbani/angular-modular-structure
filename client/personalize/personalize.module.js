angular.module('personalize', [])
    .value('values', {})
    .constant('constants', {})
    .config(function () { })
    .run(function (personalize) { });

// dynamically register module in application (states module)
angular.module('third_parties').requires.push('personalize');