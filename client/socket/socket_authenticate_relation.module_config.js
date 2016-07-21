angular
    .module('socket')
        .config(['socketProvider', function (socketProvider) {
            socketProvider.set_url("http://localhost:3333");
            socketProvider.set_event('login_succeed', 'login');
        }])
;