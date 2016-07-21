angular.module('socket', [])
    .value('values', {})
    .constant('constants', {})
    .config(function () { })
    .run(function (socket) { });

// dynamically register module in application (states module)
angular.module('third_parties').requires.push('socket');