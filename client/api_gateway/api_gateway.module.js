angular.module('api_gateway', [
        'apiGateway',
        'sutility'
    ])
    .value('values', {})
    .constant('constants', {})
    .config(function () { })
    .run(function ($rootScope, apiGateway) {
        window.$$$api = $rootScope.$$$api = apiGateway.init();
    });

// dynamically register module in application (states module)
angular.module('states').requires.push('api_gateway');