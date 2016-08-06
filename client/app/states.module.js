angular.module('states', [
    'error',
    'restricted',
    'authentication',
    'authorization',
    'user'
])
    .value('values', {})
    .constant('constants', {})
    .run(function () { });
