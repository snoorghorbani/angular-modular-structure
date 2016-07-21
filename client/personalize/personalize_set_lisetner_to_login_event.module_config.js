angular
    .module('personalize')
        .config(['personalizeProvider', function (personalizeProvider) {
            personalizeProvider.set_login_event('login_succeed');
        }])
;