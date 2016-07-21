angular.module('states', [
    'error',
    'restricted',
    'authentication',
    'authorization',
    'user',
    'login'
])
    .value('values', {})
    .constant('constants', {})
    .run(function () { });
