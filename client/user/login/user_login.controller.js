angular
    .module('user')
    .controller('loginCtrl', [
        '$scope',
        '$rootScope',
        '$state',
        'utils',
        'authentication',
        function ($scope, $rootScope, $state, utils, authentication) {
            $scope.user = {};
            $scope.autehnticate = function () {
                authentication
                    .authenticate($scope.user)
                    .then(function () {
                        //TODO clear rootscope, manage these
                        var returnToState = ($rootScope.returnToState && $rootScope.returnToState.name) || 'restricted.dashboard.main';
                        $rootScope.returnToStateParams = $rootScope.returnToStateParams || {};
                        $state.go(returnToState, $rootScope.returnToStateParams);
                    });
            }


            $scope.registerFormActive = false;

            var $login_card = $('#login_card'),
                $login_form = $('#login_form'),
                $login_help = $('#login_help'),
                $register_form = $('#register_form'),
                $login_password_reset = $('#login_password_reset');

            // show login form (hide other forms)
            var login_form_show = function () {
                $login_form
                    .show()
                    .siblings()
                    .hide();
            };

            // show register form (hide other forms)
            var register_form_show = function () {
                $register_form
                    .show()
                    .siblings()
                    .hide();
            };

            // show login help (hide other forms)
            var login_help_show = function () {
                $login_help
                    .show()
                    .siblings()
                    .hide();
            };

            // show password reset form (hide other forms)
            var password_reset_show = function () {
                $login_password_reset
                    .show()
                    .siblings()
                    .hide();
            };

            $scope.loginHelp = function ($event) {
                $event.preventDefault();
                utils.card_show_hide($login_card, undefined, login_help_show, undefined);
            };

            $scope.backToLogin = function ($event) {
                $event.preventDefault();
                $scope.registerFormActive = false;
                utils.card_show_hide($login_card, undefined, login_form_show, undefined);
            };

            $scope.registerForm = function ($event) {
                $event.preventDefault();
                $scope.registerFormActive = true;
                utils.card_show_hide($login_card, undefined, register_form_show, undefined);
            };

            $scope.passwordReset = function ($event) {
                $event.preventDefault();
                utils.card_show_hide($login_card, undefined, password_reset_show, undefined);
            };

        }
    ]);