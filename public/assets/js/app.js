/*
*  Admin AngularJS
*/
; "use strict";

var app = angular.module('app', [
    'third_parties',
    'core',
    'share',
    'states'
]);

app.constant('variables', {
    header__main_height: 48,
    easing_swiftOut: [0.4, 0, 0.2, 1],
    bez_easing_swiftOut: $.bez([0.4, 0, 0.2, 1])
});

app.config(function ($locationProvider, $sceDelegateProvider, $urlRouterProvider) {
    //$locationProvider.html5Mode(true);
    $sceDelegateProvider.resourceUrlWhitelist([
        'self'
    ]);
});
app
    .value("localeSupported", ["fa-IR"])
    .value('localeConf', {
        basePath: 'public/languages',
        defaultLocale: 'fa-IR',
        sharedDictionary: 'common',
        fileExtension: '.lang.json',
        persistSelection: true,
        cookieName: 'COOKIE_LOCALE_LANG',
        observableAttrs: new RegExp('^data-(?!ng-|i18n)'),
        delimiter: '::',
        validTokens: new RegExp('^[\\w\\.-]+\\.[\\w\\s\\.-]+\\w(:.*)?$')
    })
    .run(['locale', function (locale) {
        locale.setLocale('fa-IR');
    }]);
/* Run Block */
app
    .run([
        '$rootScope',
        '$state',
        '$stateParams',
        '$http',
        '$window',
        '$timeout',
        'preloaders',
        'variables',
        function ($rootScope, $state, $stateParams, $http, $window, $timeout, variables) {

            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            $rootScope.$on('$stateChangeSuccess', function () {
                // scroll view to top
                $("html, body").animate({
                    scrollTop: 0
                }, 200);

                $timeout(function () {
                    $rootScope.pageLoading = false;
                    $($window).resize();
                }, 300);

                $timeout(function () {
                    $rootScope.pageLoaded = true;
                    $rootScope.appInitialized = true;
                    // wave effects
                    $window.Waves.attach('.md-btn-wave,.md-fab-wave', ['waves-button']);
                    $window.Waves.attach('.md-btn-wave-light,.md-fab-wave-light', ['waves-button', 'waves-light']);
                }, 600);

            });

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                // main search
                $rootScope.mainSearchActive = false;
                // single card
                $rootScope.headerDoubleHeightActive = false;
                // top bar
                $rootScope.toBarActive = false;
                // page heading
                $rootScope.pageHeadingActive = false;
                // top menu
                $rootScope.topMenuActive = false;
                // full header
                $rootScope.fullHeaderActive = false;
                // full height
                $rootScope.page_full_height = false;
                // secondary sidebar
                $rootScope.sidebar_secondary = false;
                $rootScope.secondarySidebarHiddenLarge = false;

                if ($($window).width() < 1220) {
                    // hide primary sidebar
                    $rootScope.primarySidebarActive = false;
                    $rootScope.hide_content_sidebar = false;
                }
                if (!toParams.hasOwnProperty('hidePreloader')) {
                    $rootScope.pageLoading = true;
                    $rootScope.pageLoaded = false;
                }

            });

            // fastclick (eliminate the 300ms delay between a physical tap and the firing of a click event on mobile browsers)
            FastClick.attach(document.body);

            // get version from package.json
            $http.get('./package.json').success(function (response) {
                $rootScope.appVer = response.version;
            });

            // modernizr
            $rootScope.Modernizr = Modernizr;

            // get window width
            var w = angular.element($window);
            $rootScope.largeScreen = w.width() >= 1220;

            w.on('resize', function () {
                return $rootScope.largeScreen = w.width() >= 1220;
            });

            // show/hide main menu on page load
            $rootScope.primarySidebarOpen = ($rootScope.largeScreen) ? true : false;

            $rootScope.pageLoading = true;

            // wave effects
            $window.Waves.init();

        }
    ])
    .run([
        'PrintToConsole',
        function (PrintToConsole) {
            // app debug
            PrintToConsole.active = true;
        }
    ])
    .run(function ($rootScope) {
        $rootScope.menuSections = [];
    })
;

angular
    .module('core', [])
    .config(function () { })
    .value("core_module_config", {})
    .constant('constants', {})
    .run(function () { });
angular
    .module('share', [
        "main_sidebar"
    ])
    .config(function () { })
    .value("share_module_config", {
        show_$id: false,
        debug_mode: false
    })
    .constant('constants', {})
    .run(function () { });
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

angular
    .module('third_parties', [
        'ui.router',
        'oc.lazyLoad',
        'ngSanitize',
        'ngResource',
        'ngRetina',
        'ngLocalize',
        'ngLocalize.Config',
        'ConsoleLogger',
        'infinite-scroll',
        'scopeManager',
        'sutility'
    ])
    .value('values', {})
    .constant('constants', {})
    .run(function () { });


angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 25);
angular.module('api_gateway', [
        'apiGateway',
        'sutility'
    ])
    .value('values', {})
    .constant('constants', {})
    .config(function () { })
    .run(function ($rootScope, apiGateway) {
        $rootScope.$$$api = apiGateway.init();
    });

// dynamically register module in application (states module)
angular.module('states').requires.push('api_gateway');
angular.module('authentication', [])
    .value('values', {})
    .constant('constants', {})
    .config(function () { })
    .run(function () { });

// dynamically register module in application (states module)
angular.module('third_parties').requires.push('authentication');


angular.module('authorization', [])
    .value('values', {})
    .constant('constants', {})
    .config(function () { })
    .run(function (authorization) { });

// dynamically register module in application (states module)
//angular.module('states').requires.push('authorization');

angular.module('authorization')
    .run(['$rootScope', '$state', '$stateParams', 'authorization', 'user.service',
        function ($rootScope, $state, $stateParams, authorization, user_service) {
            $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
                console.log(toState.name)
                $rootScope.toState = toState;
                $rootScope.toStateParams = toStateParams;

                //if (!user_service.is_identity_resolved()) authorization.authorize();
                if (toState.name == 'user.login') return;

                authorization.authorize();
            });

        }])
;

angular
    .module("ConsoleLogger", [])
    // router.ui debug
    // app.js (run section "PrintToConsole")
    .factory("PrintToConsole", [
        "$rootScope",
        function ($rootScope) {
            var handler = { active: false };
            handler.toggle = function () { handler.active = !handler.active; };

            if (handler.active) {
                console.log($state + ' = ' + $state.current.name);
                console.log($stateParams + '=' + $stateParams);
                console.log($state_full_url + '=' + $state.$current.url.source);
                console.log(Card_fullscreen + '=' + card_fullscreen);

                $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                    console.log("$stateChangeStart --- event, toState, toParams, fromState, fromParams");
                    console.log(arguments);
                });
                $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
                    console.log("$stateChangeError --- event, toState, toParams, fromState, fromParams, error");
                    console.log(arguments);
                });
                $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                    console.log("$stateChangeSuccess --- event, toState, toParams, fromState, fromParams");
                    console.log(arguments);
                });
                $rootScope.$on('$viewContentLoading', function (event, viewConfig) {
                    console.log("$viewContentLoading --- event, viewConfig");
                    console.log(arguments);
                });
                $rootScope.$on('$viewContentLoaded', function (event) {
                    console.log("$viewContentLoaded --- event");
                    console.log(arguments);
                });
                $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
                    console.log("$stateNotFound --- event, unfoundState, fromState, fromParams");
                    console.log(arguments);
                });
            }

            return handler;
        }
    ])
;
angular.module('dashboard', [])
    .value('values', {})
    .constant('constants', {})
    .config(function () { })
    .run(function () { });

// dynamically register module in application (states module)
angular.module('states').requires.push('dashboard');
angular.module('error', [])
    .value('values', {})
    .constant('constants', {})
    .config(function () { })
    .run(function () { });
angular.module('host_managing', [])
    .value('values', {})
    .constant('constants', {})
    .config(function () { })
    .run(function () { });

// dynamically register module in application (states module)
angular.module('states').requires.push('host_managing');
angular
    .module('main_sidebar', [])
    .config(function () { })
    .value('menu_values', { })
    .constant('constants', { })
    .run(function () { });
angular
    .module('metrics_graphics', []);


// dynamically register module in application ([object Object] module)
angular.module('share').requires.push('metrics_graphics');
angular.module('personalize', [])
    .value('values', {})
    .constant('constants', {})
    .config(function () { })
    .run(function (personalize) { });

// dynamically register module in application (states module)
angular.module('third_parties').requires.push('personalize');
angular.module('restricted', [])
    .value('values', {})
    .constant('constants', {})
    .run(function () { });

// dynamically register module in application (states module)
angular.module('states').requires.push('restricted');
;
angular.module('socket', [])
    .value('values', {})
    .constant('constants', {})
    .config(function () { })
    .run(function (socket) { });

// dynamically register module in application (states module)
angular.module('third_parties').requires.push('socket');
angular.module('shortcuts', [])
    .value('values', {})
    .constant('constants', {})
    .config(function () { })
    .run(function () { });

// dynamically register module in application (states module)
angular.module('states').requires.push('shortcuts');
;
angular.module('user', [])
    .value('values', {})
    .constant('constants', {})
    .config(function () { })
    .run(function () { });

// dynamically register module in application (states module)
//angular.module('states').requires.push('user');
;
angular
    .module('authentication')
        .provider('authentication', [function () {
            var authenticationServicesName = [];
            var authenticationServices = {};

            return {
                register_authentication_provider: function (service) {
                    authenticationServicesName.push(service);
                },
                $get: ['$rootScope', '$injector', '_', function ($rootScope, $injector, _) {
                    _.each(authenticationServicesName, function (service) {
                        authenticationServices[service] = $injector.get(service);
                    });

                    return {
                        logout: authenticationServices['user.service'].logout,
                        authenticate: function (user) {
                            return authenticationServices['user.service'].authenticate(user).then(function (resp) {
                                $rootScope.$broadcast('login_succeed', resp);
                            });
                        },
                        is_authenticated: authenticationServices['user.service'].is_authenticated,
                        is_identity_resolved: authenticationServices['user.service'].is_identity_resolved,
                        is_in_role: authenticationServices['user.service'].is_in_role,
                        is_in_any_role: authenticationServices['user.service'].is_in_any_role,
                        get_user: authenticationServices['user.service'].get_user
                    }
                }]
            }
        }])
;

angular
    .module('authorization')
        .provider('authorization', [
            function () {
                var authenticationServiceName;
                var config = {};
                return {
                    set_authentication: function (service) {
                        authenticationServiceName = service;
                    },
                    set_login_state: function (stateName) {
                        config.loginState = stateName;
                    },
                    set_forbidden_state: function (stateName) {
                        config.forbiddenState = stateName;
                    },
                    $get: ['$injector', '$rootScope', '_', '$state',
                        function ($injector, $rootScope, _, $state) {
                            var authenticationServices = $injector.get(authenticationServiceName);

                            return {
                                authorize: function () {
                                    var isAuthenticated = authenticationServices.is_authenticated();

                                    if ($rootScope.toState.data &&
                                        $rootScope.toState.data.roles &&
                                        $rootScope.toState.data.roles.length > 0 &&
                                        !authenticationServices.is_in_any_role($rootScope.toState.data.roles)) {

                                        if (isAuthenticated)
                                            setTimeout(function myfunction() {
                                                $state.go(config.forbiddenState); // user is signed in but not authorized for desired state
                                            }, 0)
                                        else {
                                            // user is not authenticated. stow the state they wanted before you
                                            // send them to the signin state, so you can return them when you're done
                                            $rootScope.returnToState = $rootScope.toState;
                                            $rootScope.returnToStateParams = $rootScope.toStateParams;

                                            // now, send them to the signin state so they can log in
                                            setTimeout(function myfunction() {
                                                $state.go(config.loginState, {});
                                            }, 0)
                                        }
                                    }
                                }
                            };
                        }]
                }
            }
        ])
;
angular
    .module('personalize')
        .provider('personalize', [function () {
            var loginEventName;
            var user;
            return {
                set_login_event: function (topic) {
                    loginEventName = topic;
                },
                $get: ['$rootScope', '$injector', '_', 'socket', function ($rootScope, $injector, _, socket) {
                    var personalObject;
                    if (loginEventName) {
                        $rootScope.$on(loginEventName, function (e, userData) {
                            debugger
                            user = userData;
                            var stored = localStorage.getItem(user.AccountName);
                            if (!stored) {
                                personalObject = {}
                                localStorage.setItem(user.AccountName, "{}");
                            }
                            else {
                                personalObject = JSON.parse(stored);
                            }
                        });
                    }
					if(socket){
						socket.on('user_updated_data', function (resp) {
							debugger
							alert('data update');
						});
					}
                    return {
                        save: function (name, value) {
                            debugger;
                            personalObject[name] = value;
                            localStorage.setItem(user.AccountName, JSON.stringify(personalObject));

                            this.sync();
                        },
                        load: function (name) {
                            //personalObject = localStorage.getItem(user.AccountName);
                            return (personalObject && personalObject[name]) ? personalObject[name] : false;
                        },
                        sync: function () {
							if(!socket){ 
							console.log('socket note found!');
							return false
							}
                            socket.emit('user_update_data', { AccountName: user.AccountName, data: personalObject });
                        }
                    }
                }]
            }
        }])
;

angular
    .module('socket')
        .provider('socket', [
            function () {
                var authenticationServiceName;
                var config = {};
                var socket;
                var events = [];
                var URL;



                return {
                    on: function (topic, fn) {
                        socket.on(topic, fn);
                    },
                    set_url: function (url) {
                        URL = url;
                    },
                    connect: function (fn) {
                        socket.on('connect', fn);
                    },
                    set_event: function (name, topic) {
                        events.push({
                            name: name,
                            topic, topic
                        })
                    },
                    $get: ['$injector', '$rootScope', '_', '$state',
                        function ($injector, $rootScope, _, $state) {
							var io = io||false;
							if(!io) return false;
                            socket = io.connect(URL);;

                            socket.on('chat message', function (msg) {
                                debugger
                                $('#messages').append($('<li>').text(msg));
                            });
                            socket.on('user connected', function (msg) {
                                debugger
                                alert(msg);
                            });

                            socket.on('connect', function () {
                                socket.send('hi');

                                socket.on('message', function (msg) {
                                    alert('hi');
                                });
                            });
                            debugger;
                            _.each(events, function (event) {
                                $rootScope.$on(event.name, function (e, data) {
                                    debugger
                                    console.log(data); // 'Data to send'
                                    socket.emit(event.topic, data);
                                });
                            });
                            return socket;
                        }]
                }
            }
        ])
;
angular
    .module('user')
        .provider('user.service', [
            function () {
                return {
                    $get: ['$rootScope', '$q', '$http', '$timeout', '$state', '_',
                        function ($rootScope, $q, $http, $timeout, $state, _) {
                            var anonymousUser = {
                                "AccountName": "Guest",
                                "Password": "",
                                "Result": {
                                    "AccountName": "Guest",
                                    "EmailAddress": "Guest@shatel.ir",
                                    "RoleCode": ['anonymous']
                                }
                            } 
                            var _identity = anonymousUser,
                                _authenticated = false;
                            return {
                                is_identity_resolved: function () {
                                    return _.is.defined(_identity);
                                },
                                is_authenticated: function () {
                                    return _authenticated;
                                },
                                is_in_role: function (role) {
                                    if (!_authenticated || !_identity.Result.RoleCode) return false;

                                    return _identity.Result.RoleCode.indexOf(role) != -1;
                                },
                                is_in_any_role: function (roles) {
                                    if (!_authenticated || !_identity.Result.RoleCode) return false;
                                    roles = roles || [];
                                    for (var i = 0; i < roles.length; i++) {
                                        if (this.is_in_role(roles[i])) return true;
                                    }

                                    return false;
                                },
                                //authenticate: function (identity) {
                                //    _identity = identity;
                                //    _authenticated = identity != null;
                                //    // for this demo, we'll store the identity in localStorage. For you, it could be a cookie, sessionStorage, whatever
                                //    //if (identity) localStorage.setItem("demo.identity", angular.toJson(identity));
                                //    //else localStorage.removeItem("demo.identity");
                                //},
                                authenticate: function (user, force) {

                                    var deferred = $q.defer();
                                    var userAuth = $rootScope.$$$api.user.Authenticate.$init();

                                    if (force === true) _identity = anonymousUser;

                                    // check and see if we have retrieved the identity data from the server. if we have, reuse it by immediately resolving
                                    if (_.is.not.equal(_identity, anonymousUser) || _.is.not.defined(user)) {
                                        deferred.resolve(_identity);

                                        return deferred.promise;
                                    }
                                    userAuth
                                        .$promise
                                            .then(function (data) {
                                                data.Result.RoleCode = ['StoreManager']
                                                _identity = data;
                                                _authenticated = true;
                                                deferred.resolve(_identity);
                                            })
                                            .catch(function () {
                                                _identity = anonymousUser;
                                                _authenticated = false;
                                                deferred.resolve(_identity);
                                            });
                                    userAuth.$update(user).$invoke();

                                    return deferred.promise;
                                },
                                logout: function () {
                                    var deferred = $q.defer();

                                    $rootScope.$$$api.user.logout
                                        .$promise
                                            .then(function (data) {
                                                _identity = anonymousUser;
                                                _authenticated = false;
                                                deferred.resolve(_identity);
                                                $state.go('user.login');
                                            })
                                            .catch(function () {
                                                _identity = anonymousUser;
                                                _authenticated = false;
                                                deferred.resolve(_identity);
                                            });
                                    $rootScope.$$$api.user.logout.$init(true);

                                    return deferred.promise;
                                },
                                get_user: function () {
                                    return _identity;
                                }
                            }
                        }]
                }
            }])
;
angular
    .module('api_gateway')
        .config(function (apiGatewayProvider, _Provider) {
            window._date = _Provider._.date;
            window._is = _Provider._.is;
            apiGatewayProvider.set_data_type_getter({
                "date": function (value) {
                    //var date = moment(value).format("YYYY-MM-DD").split('-');
                    //return _Provider._.date.georgian.to.persian(date[0], date[1], date[2]).join('/');
                    var date = new Date(value.match(/\d+/)[0] * 1);
                    return _Provider._.date.georgian.to.persian(date.getUTCFullYear(), date.getMonth() + 1, date.getDate(), '/');
                }
            });
        })
;
angular
    .module('api_gateway')
        .config(function (apiGatewayProvider, _Provider) {
            apiGatewayProvider.set_data_type_setter({
                "date": function (value) {
                    if (!value) return "";

                    var jalaliDate = value.split('/');
                    return _Provider._.date.persian.to.georgian(parseInt(jalaliDate[0]), parseInt(jalaliDate[1]), parseInt(jalaliDate[2]), '/');
                }
            });
        })
;
angular
    .module('api_gateway')
        .config(function (apiGatewayProvider) {
            apiGatewayProvider.set_data_type_schema({
                "Password": {
                    "Type": "Password",
                    "IsRequired": true,
                    "MinLength": 6
                },
                "EmailAddress": {
                    "Type": "email"
                },
                "PagingInfo": {
                    "PageNo": {
                        "Type": "number",
                        "IsRequired": true,
                        "Default": 1
                    },
                    "PageSize": {
                        "Type": "number",
                        "IsRequired": true,
                        "Default": 5
                    }
                },
                "SortingInfo": {
                    "FieldName": {
                        "InputType": "select",
                        "IsRequired": true,
                        "Default": "ProductName",
                        "options": ["ProductName", "TotalSoldNumber"]
                    },
                    "Direction": {
                        "Type": "select",
                        "IsRequired": true,
                        "Default": "ASC",
                        "options": ["ASC", "DESC"]
                    }
                },
                "Period": {
                    "Start": {
                        "Type": "date",
                        "InputType": "mask",
                        "Pattern": "(13)\\d{2}\\/(0[1-9]|1[0-2])\\/(0[1-9]|1\\d|2\\d|3[01])",
                        "IsRequired": true,
                        "Default": "1390/1/1"
                    },
                    "End": {
                        "Type": "date",
                        "InputType": "mask",
                        "Pattern": "(13)\\d{2}\\/(0[1-9]|1[0-2])\\/(0[1-9]|1\\d|2\\d|3[01])",
                        "IsRequired": true,
                        "Default": "1399/12/12"
                    }
                },
                "PriceComponent": {
                    "BasePrice": {},
                    "NetAmount": {},
                    "DiscountAmount": {},
                    "VatAmount": {
                        "Tax": {},
                        "MunicipalityTax": {}
                    },
                    "GrossAmount": {}
                },
                "OnlinePayment": {
                    "TransactionRefrenceId": {},
                    "PaymentDateTime": {}
                }
            });
        });
angular
    .module('authentication')
        .config(["authenticationProvider",
            function (authenticationProvider) {
                authenticationProvider.register_authentication_provider("user.service");
            }])
;
angular
    .module('authorization')
        .config(["authorizationProvider",
            function (authorizationProvider) {
                authorizationProvider.set_authentication("authentication");
                authorizationProvider.set_login_state('user.login');
                authorizationProvider.set_forbidden_state('error.401');
            }]);
;
angular
    .module('personalize')
        .config(['personalizeProvider', function (personalizeProvider) {
            personalizeProvider.set_login_event('login_succeed');
        }])
;
angular
    .module('socket')
        .config(['socketProvider', function (socketProvider) {
            socketProvider.set_url("http://localhost:3333");
            socketProvider.set_event('login_succeed', 'login');
        }])
;
//angular
//    .module('user')
////        .config(["authenticationProvider", "user.serviceProvider",
////            function (authentication, user_service) {
////                authentication.register_authentication_provider("user.service");
////            }])
////;
angular.module('restricted')
    .config(
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider
                .when('/dashboard', '/dashboard/main')
                .otherwise('/dashboard/main');
        })
;
angular.module('dashboard')
    .config(
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
            .state("restricted.dashboard", {
                url: "/dashboard",
                template: '<div ui-view autoscroll="false"/>',
                abstract: true
            })
        })
;
angular.module('error', [])
    .config(
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state("error", {
                    url: "/error",
                    templateUrl: 'client/error/error.template.html',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit'
                            ]);
                        }]
                    }
                })
                .state("error.404", {
                    url: "/404",
                    templateUrl: 'client/error/error_404View.html'
                })
                .state("error.500", {
                    url: "/500",
                    templateUrl: 'client/error/error_500View.html'
                })
                .state("error.401", {
                    url: "/401",
                    templateUrl: 'client/error/error_401.template.html'
                })

        })
;
angular.module('login', [])
    .config(
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state("login", {
                    url: "/login",
                    templateUrl: 'client/login/login.template.html',
                    controller: 'loginCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit',
                                'lazy_iCheck',
                                'client/login/login.controller.js'
                            ]);
                        }]
                    }
                });
        })
;
angular.module('restricted')
    .config(
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state("restricted", {
                    abstract: true,
                    url: "",
                    views: {
                        'main_header': {
                            templateUrl: 'public/client/header/header.template.html',
                            controller: 'main_header.controller'
                        },
                        'main_sidebar': {
                            templateUrl: 'public/client/main_sidebar/main_sidebar.template.html',
                            controller: 'main_sidebar.controller'
                        },
                        '': {
                            templateUrl: 'public/client/restricted/restricted.template.html'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit',
                                'lazy_selectizeJS',
                                'lazy_switchery',
                                'lazy_prismJS',
                                'lazy_autosize',
                                'lazy_iCheck',
                                'lazy_themes',
                                'public/client/shortcuts/shortcuts.service.js',
                                'lazy_style_switcher'
                            ]);
                        }]
                    }
                })
        })
;
angular.module('shortcuts')
    .config(
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
            .state("restricted.shortcuts", {
                url: "/shortcuts",
                template: '<div ui-view autoscroll="false"/>',
                abstract: true
            })
        })
;
angular.module('user')
    .config(
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
            .state("user", {
                url: "/user",
                template: '<div ui-view autoscroll="false"/>',
                abstract: true
            })
        })
;
/*
 *	view template   :   Resource Management
 */
angular.module('dashboard')
    .config(
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
				.state("restricted.dashboard.main", {
					url: "/main",
					templateUrl: 'client/dashboard/main/dashboard_main.template.html',
					controller: 'dashboard_main.controller',
					resolve: {
						deps: ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load([
                                'lazy_countUp',
                                'lazy_charts_peity',
                                'lazy_charts_easypiechart',
                                'lazy_charts_metricsgraphics',
                                'lazy_charts_chartist',
                                'lazy_weathericons',
                                'lazy_google_maps',
                                'lazy_clndr',
                                'public/client/dashboard/main/dashboard_main.controller.js'
							], { serie: true });
						}],
						sale_chart_data: function($http){
                            return $http({method: 'GET', url: 'data/mg_dashboard_chart.min.json'})
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        user_data: function($http){
                            return $http({ method: 'GET', url: 'data/user_data.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
					},
					data: {
					    pageTitle: 'dashboard main',
					    roles: []
					}

				})
			})
;
angular.module('login', [])
    .config(
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state("user.login", {
                    url: "/login",
                    templateUrl: 'public/client/user/login/user_login.template.html',
                    controller: 'loginCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_uikit',
                                'lazy_parsleyjs',
                                'lazy_iCheck',
                                'public/client/user/login/user_login.controller.js'
                            ]);
                        }]
                    },
                    data: {
                        pageTitle: 'Login',
                        roles: []
                    }
                });
        })
;
angular.module('dashboard')
    .run(['main_sidebar_menu.service', function (main_sidebar_menu_service) {
        main_sidebar_menu_service.registerNewSection({
            id: 1,
            title: 'dashboard.Main Of Dashboard',
            icon: 'icons.dashboard',
            link: 'restricted.dashboard.main'
        });
    }]);
/**set action modal and data contract
 *  maybe : 
 *            apiGateway
 *              .context(controllerName)
                .action(actionName)
 *              .post(POST/PUT/DELETE?GET)
 *              .model(function(){})
 *              .schema({
 *					name:{
 *	 					IsRequired
 *	 					Default
 *	 					Type
 *	 					MaxLength
 *					}	 
 *              })
 *              .getter(value_path,function(){})
 *              .setter(value_path,function(){})
 *              .notification(message);
 **/
angular
    .module('dashboard')
        .run(['apiGateway', '_', function (apiGateway, _) {

            apiGateway
                .context('dashboard')
                .action("DailySalesAmount")
                .type('POST')
                .schema({
                    "Period": {},
                    "Result": {
                        "Items": [{
                            "Date": {},
                            "TotalNumber": {},
                            "TotalNetAmount": {}
                        }]
                    }
                })
                .getter("Result.Items.Date", function (value) {
                    return new Date(moment(value).format());
                })
                .notification("dashboard.Daily Sales Amount of Dashboard start")
                .done()
            ;
        }])
;
/**set action modal and data contract
 *  maybe : 
 *            apiGateway
 *              .context(controllerName)
                .action(actionName)
 *              .post(POST/PUT/DELETE?GET)
 *              .model(function(){})
 *              .schema({
 *					name:{
 *	 					IsRequired
 *	 					Default
 *	 					Type
 *	 					MaxLength
 *					}	 
 *              })
 *              .getter(value_path,function(){})
 *              .setter(value_path,function(){})
 *              .notification(message);
 **/
angular
    .module('dashboard')
        .run(['apiGateway', function (apiGateway) {

            apiGateway
                .context('dashboard')
                .action("OrdersCompleted")
                .type('GET')
                .schema({
                    //"Period": {},
                    "Result": {
                        "CompletedOrders": {},
                        "TotalOrders": {}
                    }
                })
                .virtual("ordersRate", 0)
                .getter("ordersRate", function (current) {
                    return (this.Result.CompletedOrders * 100 / this.Result.TotalOrders).toPrecision(2);
                })
                .notification("dashboard.Orders Completed of Dashboard start")
                .done()
            ;
        }])
;
/**set action modal and data contract
 *  maybe : 
 *            apiGateway
 *              .context(controllerName)
                .action(actionName)
 *              .post(POST/PUT/DELETE?GET)
 *              .model(function(){})
 *              .schema({
 *					name:{
 *	 					IsRequired
 *	 					Default
 *	 					Type
 *	 					MaxLength
 *					}	 
 *              })
 *              .getter(value_path,function(){})
 *              .setter(value_path,function(){})
 *              .notification(message);
 **/
angular
    .module('host_managing')
        .run(['apiGateway', function (apiGateway) {

            apiGateway
                .context('hostManaging')
                .action("ServiceHealth")
                .type('GET')
                .schema({
                    "ServiceStatus": {},
                    "ServiceUpTime": {},
                    "ServerUpTime": {}
                })
                .notification("host_managing.Service Health of Host Managing start")
                .done()
            ;
        }])
;
/**set action modal and data contract
 *  maybe : 
 *            apiGateway
 *              .context(controllerName)
                .action(actionName)
 *              .type(POST/PUT/DELETE?GET)
 *              .model(function(){})
 *              .schema({
 *					name:{
 *	 					IsRequired
 *	 					Default
 *	 					Type
 *	 					MaxLength
 *					}	 
 *              })
 *              .virtual(property_name , default_value)
 *              .getter(value_path,function(){})
 *              .setter(value_path,function(){})
 *              .notification(message);
 **/
angular
    .module('login')
        .run(['apiGateway', function (apiGateway) {

            apiGateway
                .context('user')
                .action("Authenticate")
                .type('POST')
                .schema({
                    "AccountName": { "IsRequired": true },
                    "Password": {},
                    "Result": {
                        "AccountName": {},
                        "EmailAddress": {},
                        "RoleCode": {}
                    }
                })
                .done()
            ;
        }])
;
/**set action modal and data contract
 *  maybe : 
 *            apiGateway
 *              .context(controllerName)
                .action(actionName)
 *              .type(POST/PUT/DELETE?GET)
 *              .model(function(){})
 *              .schema({
 *					name:{
 *	 					IsRequired
 *	 					Default
 *	 					Type
 *	 					MaxLength
 *					}	 
 *              })
 *              .virtual(property_name , default_value)
 *              .getter(value_path,function(){})
 *              .setter(value_path,function(){})
 *              .notification(message);
 **/
angular
    .module('user')
        .run(['apiGateway', function (apiGateway) {

            apiGateway
                .context('user')
                .action("logout")
                .type('POST')
                .schema()
                .done()
            ;
        }])
;
app
    .factory('utils', function () {
        return {
            // Util for finding an object by its 'id' property among an array
            findByItemId: function findById(a, id) {
                for (var i = 0; i < a.length; i++) {
                    if (a[i].item_id == id) return a[i];
                }
                return null;
            },
            // serialize form
            serializeObject: function(form) {
                var o = {};
                var a = form.serializeArray();
                $.each(a, function() {
                    if (o[this.name] !== undefined) {
                        if (!o[this.name].push) {
                            o[this.name] = [o[this.name]];
                        }
                        o[this.name].push(this.value || '');
                    } else {
                        o[this.name] = this.value || '';
                    }
                });
                return o;
            },
            // high density test
            isHighDensity: function() {
                return ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 1.3));
            },
            // touch device test
            isTouchDevice: function() {
                return !!('ontouchstart' in window);
            },
            // local storage test
            lsTest: function() {
                var test = 'test';
                try {
                    localStorage.setItem(test, test);
                    localStorage.removeItem(test);
                    return true;
                } catch(e) {
                    return false;
                }
            },
            // show/hide card
            card_show_hide: function(card,begin_callback,complete_callback,callback_element) {
                $(card).velocity({
                        scale: 0,
                        opacity: 0.2
                    }, {
                        duration: 400,
                        easing: [ 0.4,0,0.2,1 ],
                        // on begin callback
                        begin: function () {
                            if (typeof begin_callback !== 'undefined') {
                                begin_callback(callback_element);
                            }
                        },
                        // on complete callback
                        complete: function () {
                            if (typeof complete_callback !== 'undefined') {
                                complete_callback(callback_element);
                            }
                        }
                    })
                    .velocity('reverse');
            }
        };
    })
;
app
    .factory('windowDimensions', [
        '$window',
        function ($window) {
            return {
                height: function () {
                    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
                },
                width: function () {
                    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                }
            }
        }
    ])
;
app
    .service('detectBrowser', [
        '$window',
        function($window) {
            // http://stackoverflow.com/questions/22947535/how-to-detect-browser-using-angular
            return function() {
                var userAgent = $window.navigator.userAgent,
                    browsers  = {
                        chrome  : /chrome/i,
                        safari  : /safari/i,
                        firefox : /firefox/i,
                        ie      : /internet explorer/i
                    };

                for ( var key in browsers ) {
                    if ( browsers[key].test(userAgent) ) {
                        return key;
                    }
                }
                return 'unknown';
            }
        }
    ])
    .service('preloaders', [
        '$rootScope',
        '$timeout',
        'utils',
        function($rootScope,$timeout,utils) {
            $rootScope.content_preloader_show = function(style,container) {
                var $body = $('body');
                if(!$body.find('.content-preloader').length) {
                    var image_density = utils.isHighDensity() ? '@2x' : '' ;

                    var preloader_content = (typeof style !== 'undefined' && style == 'regular')
                        ? '<img src="assets/img/spinners/spinner' + image_density + '.gif" alt="" width="32" height="32">'
                        : '<div class="md-preloader"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="32" width="32" viewbox="0 0 75 75"><circle cx="37.5" cy="37.5" r="33.5" stroke-width="8"/></svg></div>';

                    var thisContainer = (typeof container !== 'undefined') ? container : $body;

                    thisContainer.append('<div class="content-preloader">' + preloader_content + '</div>');
                    $timeout(function() {
                        $('.content-preloader').addClass('preloader-active');
                    });
                }
            };
            $rootScope.content_preloader_hide = function() {
                var $body = $('body');
                if($body.find('.content-preloader').length) {
                    // hide preloader
                    $('.content-preloader').removeClass('preloader-active');
                    // remove preloader
                    $timeout(function() {
                        $('.content-preloader').remove();
                    }, 500);
                }
            };

        }
    ])
;
app.service('notifyService', ['_', 'locale', function (_, locale) {
    var localize_then_show_message = function (type, textOrTitle, text, timeout, clickHandler, bodyOutputType) {
        var i18n = {
            path: 'common',
            text: ''
        };
        if (textOrTitle) {
            var temp = textOrTitle.split('.');
            i18n.path = temp.shift();
            i18n.text = temp.join('.');
        } else {
            i18n.text = 'default message';
        }
        locale.ready(i18n.path).then(function () {
            if (!UIkit.notify) return;
            var message = locale.getString([i18n.path, i18n.text].join('.'), {});
            UIkit.notify({
                message: message,
                status: type,
                timeout: 1000,
                pos: 'bottom-left',
            })
        });
    }

    this.success = _.leftCurry(localize_then_show_message)("success");

    this.error = _.leftCurry(localize_then_show_message)("danger");

    this.info = _.leftCurry(localize_then_show_message)("info");

    //this.wait = _.rightCurry(localize_then_show_message)("info");

    //this.warning = _.rightCurry(localize_then_show_message)("info");
}]);
/*WW
*  Admin AngularJS
*  directives
*/
;'use strict';

app
    // page title
    .directive('pageTitle', [
        '$rootScope',
        '$timeout',
        function($rootScope, $timeout) {
            return {
                restrict: 'A',
                link: function() {
                    var listener = function(event, toState) {
                        var default_title = 'Admin';
                        $timeout(function() {
                            $rootScope.page_title = (toState.data && toState.data.pageTitle)
                                ? default_title + ' - ' + toState.data.pageTitle : default_title;
                        });
                    };
                    $rootScope.$on('$stateChangeSuccess', listener);
                }
            }
        }
    ])
    // add width/height properities to Image
    .directive('addImageProp', [
        '$timeout',
        'utils',
        function ($timeout,utils) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    elem.on('load', function () {
                        $timeout(function() {
                            var w = !utils.isHighDensity() ? $(elem).width() : $(elem).width()/2,
                                h = !utils.isHighDensity() ? $(elem).height() : $(elem).height()/2;
                            $(elem).attr('width',w).attr('height',h);
                        })
                    });
                }
            };
        }
    ])
    // print page
    .directive('printPage', [
        function () {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    var message = attrs['printMessage'];
                    $(elem).on('click', function(e) {
                        e.preventDefault();
                        UIkit.modal.confirm(message ? message : 'Do you want to print this page?', function () {
                            // wait for dialog to fully hide
                            setTimeout(function () {
                                window.print();
                            }, 300)
                        }, {
                            labels: {
                                'Ok': 'print'
                            }
                        });
                    });
                }
            };
        }
    ])
    // full screen
    .directive('fullScreenToggle', [
        function () {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    $(elem).on('click', function(e) {
                        e.preventDefault();
                        screenfull.toggle();
                    });
                }
            };
        }
    ])
    // single card
    .directive('singleCard', [
        '$window',
        '$timeout',
        function ($window,$timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {

                    var $md_card_single = $(elem),
                        w = angular.element($window);

                    function md_card_content_height() {
                        var content_height = w.height() - ((48 * 2) + 12);
                        $md_card_single.find('.md-card-content').innerHeight(content_height);
                    }

                    $timeout(function() {
                        md_card_content_height();
                    },100);

                    w.on('resize', function(e) {
                        // Reset timeout
                        $timeout.cancel(scope.resizingTimer);
                        // Add a timeout to not call the resizing function every pixel
                        scope.resizingTimer = $timeout( function() {
                            md_card_content_height();
                            return scope.$apply();
                        }, 280);
                    });

                }
            }
        }
    ])
    // outside list
    .directive('listOutside', [
        '$window',
        '$timeout',
        function ($window,$timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attr) {

                    var $md_list_outside_wrapper = $(elem),
                        w = angular.element($window);

                    function md_list_outside_height() {
                        var content_height = w.height() - ((48 * 2) + 10);
                        $md_list_outside_wrapper.height(content_height);
                    }

                    md_list_outside_height();

                    w.on('resize', function(e) {
                        // Reset timeout
                        $timeout.cancel(scope.resizingTimer);
                        // Add a timeout to not call the resizing function every pixel
                        scope.resizingTimer = $timeout( function() {
                            md_list_outside_height();
                            return scope.$apply();
                        }, 280);
                    });

                }
            }
        }
    ])
    // callback on last element in ng-repeat
    .directive('onLastRepeat', function ($timeout) {
        return function (scope, element, attrs) {
            if (scope.$last) {
                $timeout(function () {
                    scope.$emit('onLastRepeat', element, attrs);
                })
            }
        };
    })
    // content sidebar
    .directive('contentSidebar', [
        '$rootScope',
        '$document',
        function ($rootScope,$document) {
            return {
                restrict: 'A',
                link: function(scope,el,attr) {

                    if(!$rootScope.header_double_height) {
                        $rootScope.$watch('hide_content_sidebar', function() {
                            if($rootScope.hide_content_sidebar) {
                                $('#page_content').css('max-height', $('html').height() - 40);
                                $('html').css({
                                    'paddingRight': scrollbarWidth(),
                                    'overflow': 'hidden'
                                });
                            } else {
                                $('#page_content').css('max-height','');
                                $('html').css({
                                    'paddingRight': '',
                                    'overflow': ''
                                });
                            }
                        });

                    }
                }
            }
        }
    ])
    // attach events to document
    .directive('documentEvents', [
        '$rootScope',
        '$window',
        '$timeout',
        'variables',
        function ($rootScope, $window, $timeout,variables) {
            return {
                restrict: 'A',
                link: function(scope,el,attr) {

                    var hidePrimarySidebar = function() {
                        $rootScope.primarySidebarActive = false;
                        $rootScope.primarySidebarOpen = false;
                        $rootScope.hide_content_sidebar = false;
                        $rootScope.primarySidebarHiding = true;
                        $timeout(function() {
                            $rootScope.primarySidebarHiding = false;
                        },280);
                    };

                    var hideSecondarySidebar = function() {
                        $rootScope.secondarySidebarActive = false;
                    };

                    var hideMainSearch = function() {
                        var $header_main = $('#header_main');
                        $header_main
                            .children('.header_main_search_form')
                            .velocity("transition.slideUpBigOut", {
                                duration: 280,
                                easing: variables.easing_swiftOut,
                                begin: function() {
                                    $header_main.velocity("reverse");
                                    $rootScope.mainSearchActive = false;
                                },
                                complete: function() {
                                    $header_main
                                        .children('.header_main_content')
                                        .velocity("transition.slideDownBigIn", {
                                            duration: 280,
                                            easing: variables.easing_swiftOut,
                                            complete: function() {
                                                $('.header_main_search_input').blur().val('');
                                            }
                                        })
                                }
                            });
                    };

                    // hide components on $document click
                    scope.onClick = function ($event) {
                        // primary sidebar
                        if( $rootScope.primarySidebarActive && !$($event.target).closest('#sidebar_main').length && !$($event.target).closest('#sSwitch_primary').length && !$rootScope.largeScreen) {
                            hidePrimarySidebar();
                        }
                        // secondary sidebar
                        if( $rootScope.secondarySidebarActive && !$($event.target).closest('#sidebar_secondary').length && !$($event.target).closest('#sSwitch_secondary').length) {
                            hideSecondarySidebar();
                        }
                        // main search form
                        if( $rootScope.mainSearchActive && !$($event.target).closest('.header_main_search_form').length && !$($event.target).closest('#main_search_btn').length) {
                            hideMainSearch();
                        }
                        // style switcher
                        if( $rootScope.styleSwitcherActive && !$($event.target).closest('#style_switcher').length) {
                            $rootScope.styleSwitcherActive = false;
                        }
                    };

                    // hide components on key press (esc)
                    scope.onKeyUp = function ($event) {
                        // primary sidebar
                        if( $rootScope.primarySidebarActive && !$rootScope.largeScreen && $event.keyCode == 27) {
                            hidePrimarySidebar();
                        }
                        // secondary sidebar
                        if( $rootScope.secondarySidebarActive && $event.keyCode == 27) {
                            hideSecondarySidebar();
                        }
                        // main search form
                        if( $rootScope.mainSearchActive && $event.keyCode == 27) {
                            hideMainSearch();
                        }
                        // style switcher
                        if( $rootScope.styleSwitcherActive && $event.keyCode == 27) {
                            $rootScope.styleSwitcherActive = false;
                        }

                    };

                }
            };
        }
    ])
    // main search show
    .directive('mainSearchShow', [
        '$rootScope',
        '$window',
        '$timeout',
        function ($rootScope, $window, variables) {
            return {
                restrict: 'E',
                template: '<a href="#" id="main_search_btn" class="user_action_icon" ng-click="showSearch($event)"><i class="material-icons md-24 md-light">&#xE8B6;</i></a>',
                replace: true,
                scope: true,
                link: function(scope,el,attr) {
                    scope.showSearch = function($event) {
                        $event.preventDefault();

                        $('#header_main')
                            .children('.header_main_content')
                            .velocity("transition.slideUpBigOut", {
                                duration: 280,
                                easing: variables.easing_swiftOut,
                                begin: function() {
                                    $rootScope.mainSearchActive = true;
                                },
                                complete: function() {
                                    $('#header_main')
                                        .children('.header_main_search_form')
                                        .velocity("transition.slideDownBigIn", {
                                            duration: 280,
                                            easing: variables.easing_swiftOut,
                                            complete: function() {
                                                $('.header_main_search_input').focus();
                                            }
                                        })
                                }
                            });
                    };
                }
            };
        }
    ])
    // main search hide
    .directive('mainSearchHide', [
        '$rootScope',
        '$window',
        'variables',
        function ($rootScope, $window, variables) {
            return {
                restrict: 'E',
                template: '<i class="md-icon header_main_search_close material-icons" ng-click="hideSearch($event)">&#xE5CD;</i>',
                replace: true,
                scope: true,
                link: function(scope,el,attr) {
                    scope.hideSearch = function ($event) {
                        $event.preventDefault();

                        var $header_main = $('#header_main');

                        $header_main
                            .children('.header_main_search_form')
                            .velocity("transition.slideUpBigOut", {
                                duration: 280,
                                easing: variables.easing_swiftOut,
                                begin: function() {
                                    $header_main.velocity("reverse");
                                    $rootScope.mainSearchActive = false;
                                },
                                complete: function() {
                                    $header_main
                                        .children('.header_main_content')
                                        .velocity("transition.slideDownBigIn", {
                                            duration: 280,
                                            easing: variables.easing_swiftOut,
                                            complete: function() {
                                                $('.header_main_search_input').blur().val('');
                                            }
                                        })
                                }
                            });

                    };
                }
            };
        }
    ])

    // primary sidebar
    .directive('sidebarPrimary', [
        '$rootScope',
        '$window',
        '$timeout',
        'variables',
        '$state',
        function ($rootScope, $window, $timeout, variables, $state) {
            return {
                restrict: 'A',
                scope: 'true',
                link: function(scope,el,attr) {
                    scope.submenuToggle = function ($event) {
                        $event.preventDefault();

                        var $this = $($event.currentTarget),
                            $sidebar_main = $('#sidebar_main'),
                            slideToogle = $this.next('ul').is(':visible') ? 'slideUp' : 'slideDown';

                        $this.next('ul')
                            .velocity(slideToogle, {
                                duration: 400,
                                easing: variables.easing_swiftOut,
                                begin: function() {
                                    if(slideToogle == 'slideUp') {
                                        $(this).closest('.submenu_trigger').removeClass('act_section')
                                    } else {
                                        if($rootScope.menuAccordionMode) {
                                            $this.closest('li').siblings('.submenu_trigger').each(function() {
                                                $(this).children('ul').velocity('slideUp', {
                                                    duration: 500,
                                                    easing: variables.easing_swiftOut,
                                                    begin: function() {
                                                        $(this).closest('.submenu_trigger').removeClass('act_section')
                                                    }
                                                })
                                            })
                                        }
                                        $(this).closest('.submenu_trigger').addClass('act_section')
                                    }
                                },
                                complete: function() {
                                    if(slideToogle !== 'slideUp') {
                                        var scrollContainer = $sidebar_main.find(".scroll-content").length ? $sidebar_main.find(".scroll-content") :  $sidebar_main.find(".scrollbar-inner");
                                        $this.closest('.act_section').velocity("scroll", {
                                            duration: 500,
                                            easing: variables.easing_swiftOut,
                                            container: scrollContainer
                                        });
                                    }
                                }
                            });

                        $state.go($this.data('state'));
                    };
                }
            };
        }
    ])
    // toggle primary sidebar
    .directive('sidebarPrimaryToggle', [
        '$rootScope',
        '$window',
        '$timeout',
        function ($rootScope, $window, $timeout) {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                template: '<a id="sSwitch_primary" href="#" class="sSwitch sSwitch_left" ng-click="togglePrimarySidebar($event)" ng-hide="miniSidebarActive || topMenuActive"><span class="sSwitchIcon"></span></a>',
                link: function (scope, el, attrs) {
                    scope.togglePrimarySidebar = function ($event) {

                        $event.preventDefault();

                        if($rootScope.primarySidebarActive) {
                            $rootScope.primarySidebarHiding = true;
                            if($rootScope.largeScreen) {
                                $timeout(function() {
                                    $rootScope.primarySidebarHiding = false;
                                    $(window).resize();
                                },280);
                            }
                        } else {
                            if($rootScope.largeScreen) {
                                $timeout(function() {
                                    $(window).resize();
                                });
                            }
                        }

                        $rootScope.primarySidebarActive = !$rootScope.primarySidebarActive;

                        if( !$rootScope.largeScreen ) {
                            $rootScope.hide_content_sidebar = $rootScope.primarySidebarActive ? true : false;
                        }

                        if($rootScope.primarySidebarOpen) {
                            $rootScope.primarySidebarOpen = false;
                            $rootScope.primarySidebarActive = false;
                        }
                    };

                }
            };
        }
    ])
    // secondary sidebar
    .directive('sidebarSecondary', [
        '$rootScope',
        '$timeout',
        'variables',
        function ($rootScope,$timeout,variables) {
            return {
                restrict: 'A',
                link: function(scope,el,attrs) {
                    $rootScope.sidebar_secondary = true;
                    if(attrs.toggleHidden == 'large') {
                        $rootScope.secondarySidebarHiddenLarge = true;
                    }

                    // chat
                    var $sidebar_secondary = $(el);
                    if($sidebar_secondary.find('.md-list.chat_users').length) {

                        $('.md-list.chat_users').children('li').on('click',function() {
                            $('.md-list.chat_users').velocity("transition.slideRightBigOut", {
                                duration: 280,
                                easing: variables.easing_swiftOut,
                                complete: function() {
                                    $sidebar_secondary
                                        .find('.chat_box_wrapper')
                                        .addClass('chat_box_active')
                                        .velocity("transition.slideRightBigIn", {
                                            duration: 280,
                                            easing: variables.easing_swiftOut,
                                            begin: function() {
                                                $sidebar_secondary.addClass('chat_sidebar')
                                            }
                                        })
                                }
                            });
                        });

                        $sidebar_secondary
                            .find('.chat_sidebar_close')
                            .on('click',function() {
                                $sidebar_secondary
                                    .find('.chat_box_wrapper')
                                    .removeClass('chat_box_active')
                                    .velocity("transition.slideRightBigOut", {
                                        duration: 280,
                                        easing: variables.easing_swiftOut,
                                        complete: function () {
                                            $sidebar_secondary.removeClass('chat_sidebar');
                                            $('.md-list.chat_users').velocity("transition.slideRightBigIn", {
                                                duration: 280,
                                                easing: variables.easing_swiftOut
                                            })
                                        }
                                    })
                            });

                        if($sidebar_secondary.find('.uk-tab').length) {
                            $sidebar_secondary.find('.uk-tab').on('change.uk.tab',function(event, active_item, previous_item) {
                                if($(active_item).hasClass('chat_sidebar_tab') && $sidebar_secondary.find('.chat_box_wrapper').hasClass('chat_box_active')) {
                                    $sidebar_secondary.addClass('chat_sidebar')
                                } else {
                                    $sidebar_secondary.removeClass('chat_sidebar')
                                }
                            })
                        }
                    }

                }
            };
        }
    ])
    // toggle secondary sidebar
    .directive('sidebarSecondaryToggle', [
        '$rootScope',
        '$window',
        '$timeout',
        function ($rootScope, $window, $timeout) {
            return {
                restrict: 'E',
                replace: true,
                template: '<a href="#" id="sSwitch_secondary" class="sSwitch sSwitch_right" ng-show="sidebar_secondary" ng-click="toggleSecondarySidebar($event)"><span class="sSwitchIcon"></span></a>',
                link: function (scope, el, attrs) {
                    scope.toggleSecondarySidebar = function ($event) {
                        $event.preventDefault();
                        $rootScope.secondarySidebarActive = !$rootScope.secondarySidebarActive;
                    };
                }
            };
        }
    ])
    // activate card fullscreen
    .directive('cardFullscreenActivate', [
        '$rootScope',
        'variables',
        function ($rootScope, variables) {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                template: '<i class="md-icon material-icons md-card-fullscreen-activate" ng-click="cardFullscreenActivate($event)">&#xE5D0;</i>',
                link: function (scope, el, attrs) {
                    scope.cardFullscreenActivate = function ($event) {
                        $event.preventDefault();

                        var $thisCard = $(el).closest('.md-card'),
                            mdCard_h = $thisCard.height(),
                            mdCard_w = $thisCard.width();

                        // create placeholder for card
                        $thisCard.after('<div class="md-card-placeholder" style="width:'+ mdCard_w+'px;height:'+ mdCard_h+'px;"/>');
                        // add overflow hidden to #page_content (fix for ios)
                        //$body.addClass('md-card-fullscreen-active');
                        // add width/height to card (preserve original size)
                        $thisCard
                            .addClass('md-card-fullscreen')
                            .css({
                                'width': mdCard_w,
                                'height': mdCard_h
                            })
                            // animate card to top/left position
                            .velocity({
                                left: 0,
                                top: 0
                            },{
                                duration: 600,
                                easing: variables.easing_swiftOut,
                                begin: function(elements) {
                                    $rootScope.card_fullscreen = true;
                                    $rootScope.hide_content_sidebar = true;
                                    // add back button
                                    //$thisCard.find('.md-card-toolbar').prepend('<span class="md-icon md-card-fullscreen-deactivate material-icons uk-float-left">&#xE5C4;</span>');
                                    //admin_page_content.hide_content_sidebar();
                                }
                            })
                            // resize card to full width/height
                            .velocity({
                                height: '100%',
                                width: '100%'
                            },{
                                duration: 600,
                                easing: variables.easing_swiftOut,
                                complete: function(elements) {
                                    // activate onResize callback for some js plugins
                                    //$(window).resize();
                                    // show fullscreen content
                                    $thisCard.find('.md-card-fullscreen-content').velocity("transition.slideUpBigIn", {
                                        duration: 600,
                                        easing: variables.easing_swiftOut,
                                        complete: function(elements) {
                                            // activate onResize callback for some js plugins
                                            $(window).resize();
                                        }
                                    });
                                }
                            });
                    }
                }
            }
        }
    ])
    // deactivate card fullscreen
    .directive('cardFullscreenDeactivate', [
        '$rootScope',
        '$window',
        'variables',
        function ($rootScope, $window, variables) {
            return {
                restrict: 'E',
                replace: true,
                template: '<span class="md-icon md-card-fullscreen-deactivate material-icons uk-float-left" ng-show="card_fullscreen" ng-click="cardFullscreenDeactivate($event)">&#xE5C4;</span>',
                link: function (scope, el, attrs) {
                    scope.cardFullscreenDeactivate = function ($event) {
                        $event.preventDefault();

                        // get card placeholder width/height and offset
                        var $thisPlaceholderCard = $('.md-card-placeholder'),
                            mdPlaceholderCard_h = $thisPlaceholderCard.height(),
                            mdPlaceholderCard_w = $thisPlaceholderCard.width(),
                            mdPlaceholderCard_offset_top = $thisPlaceholderCard.offset().top,
                            mdPlaceholderCard_offset_left = $thisPlaceholderCard.offset().left,
                            $thisCard = $('.md-card-fullscreen');

                        $thisCard
                            // resize card to original size
                            .velocity({
                                height: mdPlaceholderCard_h,
                                width: mdPlaceholderCard_w
                            },{
                                duration: 600,
                                easing: variables.easing_swiftOut,
                                begin: function(elements) {
                                    // hide fullscreen content
                                    $thisCard.find('.md-card-fullscreen-content').velocity("transition.slideDownOut",{ duration: 280, easing: variables.easing_swiftOut });
                                    $rootScope.card_fullscreen = false;
                                },
                                complete: function(elements) {
                                    $rootScope.hide_content_sidebar = false;
                                }
                            })
                            // move card to original position
                            .velocity({
                                left: mdPlaceholderCard_offset_left,
                                top: mdPlaceholderCard_offset_top
                            },{
                                duration: 600,
                                easing: variables.easing_swiftOut,
                                complete: function(elements) {
                                    // remove some styles added by velocity.js
                                    $thisCard.removeClass('md-card-fullscreen').css({
                                        width: '',
                                        height: '',
                                        left: '',
                                        top: ''
                                    });
                                    // remove card placeholder
                                    $thisPlaceholderCard.remove();
                                    $(window).resize();
                                }
                            })

                    }
                }
            }
        }
    ])
    // card close
    .directive('cardClose', [
        'utils',
        function (utils) {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                template: '<i class="md-icon material-icons md-card-toggle" ng-click="cardClose($event)">&#xE14C;</i>',
                link: function (scope, el, attrs) {
                    scope.cardClose = function ($event) {
                        $event.preventDefault();

                        var $this = $(el),
                            thisCard = $this.closest('.md-card'),
                            removeCard = function() {
                                $(thisCard).remove();
                            };

                        utils.card_show_hide(thisCard,undefined,removeCard)

                    }
                }
            }
        }
    ])
    // card toggle
    .directive('cardToggle', [
        'variables',
        function (variables) {
            return {
                restrict: 'E',
                replace: true,
                scope: true,
                template: '<i class="md-icon material-icons md-card-toggle" ng-click="cardToggle($event)">&#xE316;</i>',
                link: function (scope, el, attrs) {
                    scope.cardToggle = function ($event) {
                        $event.preventDefault();

                        var $this = $(el),
                            thisCard = $this.closest('.md-card');

                        $(thisCard).toggleClass('md-card-collapsed').children('.md-card-content').slideToggle('280', variables.bez_easing_swiftOut);

                        $this.velocity({
                            scale: 0,
                            opacity: 0.2
                        }, {
                            duration: 280,
                            easing: variables.easing_swiftOut,
                            complete: function() {
                                $(thisCard).hasClass('md-card-collapsed') ? $this.html('&#xE313;') : $this.html('&#xE316;');
                                $this.velocity('reverse');
                            }
                        });


                    }
                }
            }
        }
    ])
    // card overlay toggle
    .directive('cardOverlayToggle', [
        function () {
            return {
                restrict: 'E',
                template: '<i class="md-icon material-icons" ng-click="toggleOverlay($event)">&#xE5D4;</i>',
                replace: true,
                scope: true,
                link: function (scope, el, attrs) {

                    if(el.closest('.md-card').hasClass('md-card-overlay-active')) {
                        el.html('&#xE5CD;')
                    }

                    scope.toggleOverlay = function ($event) {

                        $event.preventDefault();

                        if(!el.closest('.md-card').hasClass('md-card-overlay-active')) {
                            el
                                .html('&#xE5CD;')
                                .closest('.md-card').addClass('md-card-overlay-active');

                        } else {
                            el
                                .html('&#xE5D4;')
                                .closest('.md-card').removeClass('md-card-overlay-active');
                        }

                    }
                }
            }
        }
    ])
    // custom scrollbar
    .directive('customScrollbar', [
        '$rootScope',
        function ($rootScope) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, el, attrs) {

                    // check if mini sidebar is enabled
                    if(attrs['id'] == 'sidebar_main' && $rootScope.miniSidebarActive) {
                        return;
                    }

                    $(el).addClass('uk-height-1-1').wrapInner("<div class='scrollbar-inner'></div>");
                    if(Modernizr.touch) {
                        $(el).children('.scrollbar-inner').addClass('touchscroll');
                    } else {
                        $(el).children('.scrollbar-inner').scrollbar({
                            disableBodyScroll: true,
                            scrollx: false,
                            duration: 100
                        });
                    }

                }
            }
        }
    ])
    // material design inputs
    .directive('mdInput',[
        '$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                scope: {
                    ngModel: '='
                },
                controller: function ($scope,$element) {
                    var $elem = $($element);
                    $scope.updateInput = function() {
                        // clear wrapper classes
                        $elem.closest('.md-input-wrapper').removeClass('md-input-wrapper-danger md-input-wrapper-success md-input-wrapper-disabled');

                        if($elem.hasClass('md-input-danger')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-danger')
                        }
                        if($elem.hasClass('md-input-success')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-success')
                        }
                        if($elem.prop('disabled')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-wrapper-disabled')
                        }
                        if($elem.hasClass('label-fixed')) {
                            $elem.closest('.md-input-wrapper').addClass('md-input-filled')
                        }
                        if($elem.val() != '') {
                            $elem.closest('.md-input-wrapper').addClass('md-input-filled')
                        }
                    };
                },
                link: function (scope, elem, attrs) {

                    var $elem = $(elem);

                    $timeout(function() {
                        if(!$elem.hasClass('md-input-processed')) {
                            if ($elem.prev('label').length) {
                                $elem.prev('label').andSelf().wrapAll('<div class="md-input-wrapper"/>');
                            } else if ($elem.siblings('[data-uk-form-password]').length) {
                                $elem.siblings('[data-uk-form-password]').andSelf().wrapAll('<div class="md-input-wrapper"/>');
                            } else {
                                $elem.wrap('<div class="md-input-wrapper"/>');
                            }
                            $elem
                                .addClass('md-input-processed')
                                .closest('.md-input-wrapper')
                                .append('<span class="md-input-bar"/>');
                        }

                        scope.updateInput();

                    });

                    scope.$watch(function() {
                        return $elem.attr('class'); },
                        function(newValue,oldValue){
                            if(newValue != oldValue) {
                                scope.updateInput();
                            }
                        }
                    );

                    scope.$watch(function() {
                        return $elem.val(); },
                        function(newValue,oldValue){
                            if( !$elem.is(':focus') && (newValue != oldValue) ) {
                                scope.updateInput();
                            }
                        }
                    );

                    $elem
                        .on('focus', function() {
                            $elem.closest('.md-input-wrapper').addClass('md-input-focus')
                        })
                        .on('blur', function() {
                            $timeout(function() {
                                $elem.closest('.md-input-wrapper').removeClass('md-input-focus');
                                if($elem.val() == '') {
                                    $elem.closest('.md-input-wrapper').removeClass('md-input-filled')
                                } else {
                                    $elem.closest('.md-input-wrapper').addClass('md-input-filled')
                                }
                            },100)
                        });

                }
            }
        }
    ])
    // material design fab speed dial
    .directive('mdFabSpeedDial',[
        'variables',
        function (variables) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {
                    $(elem)
                        .append('<i class="material-icons md-fab-action-close" style="display:none">&#xE5CD;</i>')
                        .on('click',function(e) {
                            e.preventDefault();

                            var $this = $(this),
                                $this_wrapper = $this.closest('.md-fab-wrapper');

                            if(!$this_wrapper.hasClass('md-fab-active')) {
                                $this_wrapper.addClass('md-fab-active');
                            } else {
                                $this_wrapper.removeClass('md-fab-active');
                            }

                            $this.velocity({
                                scale: 0
                            },{
                                duration: 140,
                                easing: variables.easing_swiftOut,
                                complete: function() {
                                    $this.children().toggle();
                                    $this.velocity({
                                        scale: 1
                                    },{
                                        duration: 140,
                                        easing: variables.easing_swiftOut
                                    })
                                }
                            })
                        })
                        .closest('.md-fab-wrapper').find('.md-fab-small')
                        .on('click',function() {
                            $(this).closest('.md-fab-wrapper').removeClass('md-fab-active')
                        });
                }
            }
        }
    ])
    // material design fab toolbar
    .directive('mdFabToolbar',[
        'variables',
        '$document',
        function (variables,$document) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {

                    var $fab_toolbar = $(elem);

                    $fab_toolbar
                        .children('i')
                        .on('click', function(e) {
                            e.preventDefault();

                            var toolbarItems = $fab_toolbar.children('.md-fab-toolbar-actions').children().length;

                            $fab_toolbar.addClass('md-fab-animated');

                            var FAB_padding = !$fab_toolbar.hasClass('md-fab-small') ? 16 : 24,
                                FAB_size = !$fab_toolbar.hasClass('md-fab-small') ? 64 : 44;

                            setTimeout(function() {
                                $fab_toolbar
                                    .width((toolbarItems*FAB_size + FAB_padding))
                            },140);

                            setTimeout(function() {
                                $fab_toolbar.addClass('md-fab-active');
                            },420);

                        });

                    $($document).on('click scroll', function(e) {
                        if( $fab_toolbar.hasClass('md-fab-active') ) {
                            if (!$(e.target).closest($fab_toolbar).length) {

                                $fab_toolbar
                                    .css('width','')
                                    .removeClass('md-fab-active');

                                setTimeout(function() {
                                    $fab_toolbar.removeClass('md-fab-animated');
                                },140);

                            }
                        }
                    });
                }
            }
        }
    ])
    // material design fab sheet
    .directive('mdFabSheet',[
        'variables',
        '$document',
        function (variables,$document) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {
                    var $fab_sheet = $(elem);

                    $fab_sheet
                        .children('i')
                        .on('click', function(e) {
                            e.preventDefault();

                            var sheetItems = $fab_sheet.children('.md-fab-sheet-actions').children('a').length;

                            $fab_sheet.addClass('md-fab-animated');

                            setTimeout(function() {
                                $fab_sheet
                                    .width('240px')
                                    .height(sheetItems*40 + 8);
                            },140);

                            setTimeout(function() {
                                $fab_sheet.addClass('md-fab-active');
                            },280);

                        });

                    $($document).on('click scroll', function(e) {
                        if( $fab_sheet.hasClass('md-fab-active') ) {
                            if (!$(e.target).closest($fab_sheet).length) {

                                $fab_sheet
                                    .css({
                                        'height':'',
                                        'width':''
                                    })
                                    .removeClass('md-fab-active');

                                setTimeout(function() {
                                    $fab_sheet.removeClass('md-fab-animated');
                                },140);

                            }
                        }
                    });
                }
            }
        }
    ])
    // hierarchical show
    .directive('hierarchicalShow', [
        '$timeout',
        '$rootScope',
        function ($timeout,$rootScope) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {


                    var parent_el = $(elem),
                        baseDelay = 60;


                    var add_animation = function(children,length) {
                        children
                            .each(function(index) {
                                $(this).css({
                                    '-webkit-animation-delay': (index * baseDelay) + "ms",
                                    'animation-delay': (index * baseDelay) + "ms"
                                })
                            })
                            .end()
                            .waypoint({
                                element: elem[0],
                                handler: function() {
                                    parent_el.addClass('hierarchical_show_inView');
                                    setTimeout(function() {
                                        parent_el
                                            .removeClass('hierarchical_show hierarchical_show_inView fast_animation')
                                            .children()
                                            .css({
                                                '-webkit-animation-delay': '',
                                                'animation-delay': ''
                                            });
                                    }, (length*baseDelay)+1200 );
                                    this.destroy();
                                },
                                context: window,
                                offset: '90%'
                            });
                    };

                    $rootScope.$watch('pageLoaded',function() {
                       if($rootScope.pageLoaded) {
                           var children = parent_el.children(),
                               children_length = children.length;

                           $timeout(function() {
                               add_animation(children,children_length)
                           },560)

                       }
                    });

                }
            }
        }
    ])
    // hierarchical slide in
    .directive('hierarchicalSlide', [
        '$timeout',
        '$rootScope',
        function ($timeout,$rootScope) {
            return {
                restrict: 'A',
                scope: true,
                link: function (scope, elem, attrs) {

                    var $this = $(elem),
                        baseDelay = 100;

                    var add_animation = function(children,context,childrenLength) {
                        children.each(function(index) {
                            $(this).css({
                                '-webkit-animation-delay': (index * baseDelay) + "ms",
                                'animation-delay': (index * baseDelay) + "ms"
                            })
                        });
                        $this.waypoint({
                            handler: function() {
                                $this.addClass('hierarchical_slide_inView');
                                $timeout(function() {
                                    $this.removeClass('hierarchical_slide hierarchical_slide_inView');
                                    children.css({
                                        '-webkit-animation-delay': '',
                                        'animation-delay': ''
                                    });
                                }, (childrenLength*baseDelay)+1200 );
                                this.destroy();
                            },
                            context: context[0],
                            offset: '90%'
                        });
                    };

                    $rootScope.$watch('pageLoaded',function() {
                        if($rootScope.pageLoaded) {
                            var thisChildren = attrs['slideChildren'] ? $this.children(attrs['slideChildren']) : $this.children(),
                                thisContext = attrs['slideContext'] ? $this.closest(attrs['slideContext']) : 'window',
                                thisChildrenLength = thisChildren.length;

                            if(thisChildrenLength >= 1) {
                                $timeout(function() {
                                    add_animation(thisChildren,thisContext,thisChildrenLength)
                                },560)
                            }
                        }
                    });

                }
            }
        }
    ])
    // preloaders
    .directive('mdPreloader',[
        function () {
            return {
                restrict: 'E',
                scope: {
                    width: '=',
                    height: '=',
                    strokeWidth: '=',
                    style: '@?'
                },
                template: '<div class="md-preloader{{style}}"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" ng-attr-height="{{ height }}" ng-attr-width="{{ width }}" viewbox="0 0 75 75"><circle cx="37.5" cy="37.5" r="33.5" ng-attr-stroke-width="{{ strokeWidth }}"/></svg></div>',
                link: function (scope, elem, attr) {

                    scope.width = scope.width ? scope.width : 48;
                    scope.height = scope.height ? scope.height : 48;
                    scope.strokeWidth = scope.strokeWidth ? scope.strokeWidth : 4;

                    attr.$observe('warning', function() {
                        scope.style = ' md-preloader-warning'
                    });

                    attr.$observe('success', function() {
                        scope.style = ' md-preloader-success'
                    });

                    attr.$observe('danger', function() {
                        scope.style = ' md-preloader-danger'
                    });

                }
            }
        }
    ])
    .directive('preloader',[
        '$rootScope',
        'utils',
        function ($rootScope,utils) {
            return {
                restrict: 'E',
                scope: {
                    width: '=',
                    height: '=',
                    style: '@?'
                },
                template: '<img src="assets/img/spinners/{{style}}{{imgDensity}}.gif" alt="" ng-attr-width="{{width}}" ng-attr-height="{{height}}">',
                link: function (scope, elem, attrs) {

                    scope.width = scope.width ? scope.width : 32;
                    scope.height = scope.height ? scope.height : 32;
                    scope.style = scope.style ? scope.style : 'spinner';
                    scope.imgDensity = utils.isHighDensity() ? '@2x' : '' ;

                    attrs.$observe('warning', function() {
                        scope.style = 'spinner_warning'
                    });

                    attrs.$observe('success', function() {
                        scope.style = 'spinner_success'
                    });

                    attrs.$observe('danger', function() {
                        scope.style = 'spinner_danger'
                    });

                    attrs.$observe('small', function() {
                        scope.style = 'spinner_small'
                    });

                    attrs.$observe('medium', function() {
                        scope.style = 'spinner_medium'
                    });

                    attrs.$observe('large', function() {
                        scope.style = 'spinner_large'
                    });

                }
            }
        }
    ])
    // uikit components
    .directive('ukHtmlEditor',[
        '$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    $timeout(function() {
                        UIkit.htmleditor(elem[0], {
                            'toolbar': '',
                            'height': '240'
                        });
                    });
                }
            }
        }
    ])
    .directive('ukNotification',[
        '$window',
        function ($window) {
            return {
                restrict: 'A',
                scope: {
                    message: '@',
                    status: '@?',
                    timeout: '@?',
                    group: '@?',
                    position: '@?',
                    callback: '&?'
                },
                link: function (scope, elem, attrs) {

                    var w = angular.element($window),
                        $element = $(elem);

                    scope.showNotify = function() {
                        var thisNotify = UIkit.notify({
                            message: scope.message,
                            status: scope.status ? scope.status : '',
                            timeout: scope.timeout ? scope.timeout : 5000,
                            group: scope.group ? scope.group : '',
                            pos: scope.position ? scope.position : 'top-center',
                            onClose: function() {
                                $('body').find('.md-fab-wrapper').css('margin-bottom','');
                                clearTimeout(thisNotify.timeout);

                                if(scope.callback) {
                                    if( angular.isFunction(scope.callback()) ) {
                                        scope.$apply(scope.callback());
                                    } else {
                                        console.log('Callback is not a function');
                                    }
                                }

                            }
                        });
                        if(
                            ( (w.width() < 768) && (
                                (scope.position == 'bottom-right')
                                || (scope.position == 'bottom-left')
                                || (scope.position == 'bottom-center')
                            ) )
                            || (scope.position == 'bottom-right')
                        ) {
                            var thisNotify_height = $(thisNotify.element).outerHeight(),
                                spacer = (w.width() < 768) ? -6 : 8;
                            $('body').find('.md-fab-wrapper').css('margin-bottom',thisNotify_height + spacer);
                        }
                    };

                    $element.on("click", function(){
                        if($('body').find('.uk-notify-message').length) {
                            $('body').find('.uk-notify-message').click();
                            setTimeout(function() {
                                scope.showNotify()
                            },450)
                        } else {
                            scope.showNotify()
                        }
                    });

                }
            }
        }
    ])
;
angular
    .module('core')
        .directive('donutChart', ['$compile', '$window', '_', 'locale', function ($compile, $window, _, locale) {
            var counter = 0;
            var ID_PREFIX = "donut_cahrt_"
            var MODEL = 'model';
            var defaultConfig = {
                bindto: '#donut_cahrt_0',
                data: {
                    columns: [
                    ],
                    type: 'donut',
                    onclick: function (d, i) { console.log("onclick", d, i); },
                    onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                    onmouseout: function (d, i) { console.log("onmouseout", d, i); }
                },
                donut: {
                    title: "Iris Petal Width",
                    width: 40
                },
                color: {
                    pattern: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
                },
                legend_show: false
            }

            var controller = function ($scope, element, attrs, $compile, share_module_config, _) {
                var model = attrs.model;

                //#region define scope variables

                $scope.id = element.attr('id');

                //#endregion

                //#region configure form submit action and related properties
                /*
                *   this directive can get action in two model
                *   1. get action path in this pattern                                          => sh-form="controllerName.actionName"
                *   2. get instance of action that build in another parnet like page controller => sh-form="instanceOfAction"
                *   
                *   then i set actionPath property to scope for use with child scope directive to access them to schema
                */
                if (model.indexOf('.') == -1) {
                    $scope[MODEL] = $scope.$parent[model];
                    $scope.actionPath = {
                        controllerName: $scope[MODEL].options.context,
                        actionName: $scope[MODEL].options.actionName
                    };
                }
                else {
                    var actionPath = attrs.model.split('.');
                    $scope.actionPath = {
                        controllerName: actionPath[0],
                        actionName: actionPath[1]
                    };
                    debugger
                    $scope[MODEL] = $scope.$root.$$$api[actionPath[0]][actionPath[1]]();
                }

                //#endregion

                //#region build config

                //var config = _.extend(config, defaultConfig);
                //var defaultConfig 
                $scope.c3Config = defaultConfig;

                //#endregion


            };
            var compiling = function ($templateElement, $templateAttributes) {
                $templateElement[0].id = [ID_PREFIX, counter++].join('');
            };
            var pre = function ($scope, element, attrs, ctrls, $transclude) { };
            var post = function ($scope, element, attrs, ctrls, $transclude) {
                // donut chart
                var c3chart_donut_id = $scope.id;

                locale.ready(attrs.title.split('.')[0]).then(function () {
                });
                $scope.c3Config.bindto = '#' + c3chart_donut_id;
                $scope.c3Config.donut.title = locale.getString(attrs.title, {});
                debugger
                var c3chart_donut = c3.generate($scope.c3Config);
                var c3chart_donut_waypoint = new Waypoint({
                    element: document.getElementById(c3chart_donut_id),
                    handler: function () { },
                    offset: '80%'
                });

                $($window).on('debouncedresize', c3chart_donut.resize());
                $scope.$on('$destroy', function () {
                    $($window).off('debouncedresize', c3chart_donut.resize());
                    c3chart_donut_waypoint.destroy();
                });
                $scope.$watchCollection("$parent.searchAction", function (nv, ov) {
                    if (!nv || nv.$$status == "pending") return;
                    var loadingData = {
                        columns: []
                    };

                    locale.ready('common').then(function () {
                    });
                    _.each(_.spliteAndTrim(attrs.columns), function (item) {
                        var title = locale.getString('common.' + item, {})
                        loadingData.columns.push([title, nv.Result[item]]);
                    });
                    c3chart_donut.load(loadingData);

                    console.log(c3chart_donut_waypoint)
                });
            };


            //#region export directive

            var directive = {
                restrict: 'EA',
                priority: 1500,
                transclude: false,
                replace: true,
                templateUrl: './Client/core/directives/core_donut_chart.directive.html',
                require: [],
                scope: { config: '=' },
                controller: ['$scope', '$element', '$attrs', '$compile', 'share_module_config', "_", controller],
                compile: function CompilingFunction($templateElement, $templateAttributes) {
                    compiling($templateElement, $templateAttributes);
                    return {
                        pre: pre,
                        post: post
                    }
                }
            }

            return directive;

            //#endregion

        }]);
angular
    .module('core')
        .directive('snEditItemInModal', ['$compile', function ($compile) {
            var controller = function ($scope, element, attrs, $compile, share_module_config, _) { };
            var compiling = function ($templateElement, $templateAttributes) { };
            var pre = function ($scope, element, attrs, ctrls, $transclude) { };
            var post = function ($scope, element, attrs, ctrls, $transclude) {
                element.on('click', function () {
                    $scope.correctInfoAction.$update($scope.item);
                    $scope.$apply();
                    UIkit.modal("#" + attrs.modal).show();
                });
            };

            //#region export directive

            var directive = {
                restrict: 'EA',
                priority: 1500,
                transclude: false,
                replace: false,
                templateUrl: './Client/core/directives/core_edit_in_modal.directive.html',
                require: [],
                scope: false,
                controller: ['$scope', '$element', '$attrs', '$compile', 'share_module_config', "_", controller],
                compile: function CompilingFunction($templateElement, $templateAttributes) {
                    compiling($templateElement, $templateAttributes);
                    return {
                        pre: pre,
                        post: post
                    }
                }
            }

            return directive;

            //#endregion

        }]);
angular
    .module('share')
        .directive('snInfinite', ['$compile', function ($compile) {
            var directive = {
                restrict: 'EA',
                priority: 1000,
                transclude: false,
                require: [],
                scope: false,
                controller: ['$scope', '$element', '$attrs', '$compile', 'share_module_config', "_", function ($scope, element, attrs, $compile, share_module_config, _) {

                }],
                compile: function CompilingFunction($templateElement, $templateAttributes) {
                    return {
                        pre: function ($scope, element, attrs, ctrls, $transclude) {},
                        post: function ($scope, element, attrs, ctrls, $transclude) {}
                    }
                }
            }

            return directive;
        }]);
angular
    .module('share')
        .directive('shAction',
            function () {
                link = function (scope, element, attrs, ctrl, transclude) {
                    var actionPath = attrs.shAction.split('.');
                    //var modelName = [actionPath[1], "Model"].join("");
                    var modelName = 'model';
                    scope[modelName] = scope.$root.$$$api[actionPath[0]][actionPath[1]]();

                    scope[modelName].$invoke();

                    transclude(scope, function (clone, scope) {
                        element.append(clone);
                    });
                }

                return ({
                    link: link,
                    priority: 1500,
                    restrict: "A",
                    scope: {
                        xx: "="
                    },
                    terminal: true,
                    transclude: true
                });
            });
angular
    .module('share')
        .directive('shForm',
            [function () {
                var directive = {
                    restrict: 'EA',
                    priority: 1500,
                    transclude: true,
                    //template: '<ng-transclude></ng-transclude>',
                    scope: true,
                    controller: ['$scope', '$element', '$attrs', '$compile', 'share_module_config', "_", function ($scope, element, attrs, $compile, share_module_config, _) {
                        var $id_debugger = (share_module_config.show_$id) ? "inside form : {{$id}}" : '';

                        var MODEL = 'model';
                        var shForm = attrs.shForm;
                        $scope.readonly = (attrs.readonly) ? true : false;
                        if (share_module_config.debug_mode) {
                            $scope.form = shForm;
                            console.log('form ctrl', $scope.$id)
                        }

                        //#region configure form submit action and related properties
                        /*
                        *   this directive can get action in two model
                        *   1. get action path in this pattern                                          => sh-form="controllerName.actionName"
                        *   2. get instance of action that build in another parnet like page controller => sh-form="instanceOfAction"
                        *   
                        *   then i set actionPath property to scope for use with child scope directive to access them to schema
                        */
                        if (shForm.indexOf('.') == -1) {
                            $scope[MODEL] = $scope[shForm];
                            $scope.actionPath = {
                                controllerName: $scope[MODEL].options.context,
                                actionName: $scope[MODEL].options.actionName
                            };
                        }
                        else {
                            var actionPath = attrs.shForm.split('.');
                            $scope.actionPath = {
                                controllerName: actionPath[0],
                                actionName: actionPath[1]
                            };

                            $scope[MODEL] = $scope.$root.$$$api[actionPath[0]][actionPath[1]]();

                        }

                        //#endregion

                        if (share_module_config.show_$id) {
                            $scope.$watchCollection(shForm, function (n, v) { debugger })
                            $scope.$watchCollection(MODEL, function (n, v) { debugger })
                        }

                        element[0].addEventListener('reset', function () {
                            $scope[MODEL].$reset().$reset_virtuals().$invoke();
                        })
                        element
                            .parsley()
                            .on('form:validated', function () {
                                $scope.$apply();
                                if (element.parsley().validationResult) {
                                    $scope.model.$update({ "PagingInfo": {} }).$reset_virtuals().$invoke();
                                    //cs.model[actionPath[0]][actionPath[1]]($scope.model);
                                    //$scope.$parent[actionPath[1]].call($scope[MODEL], $scope[MODEL]);
                                }
                            })
                            .on('field:validated', function (parsleyField) {
                                if ($(parsleyField.$element).hasClass('md-input')) {
                                    $scope.$apply();
                                }
                            });
                    }],
                    
                    link: function (scope, element, attrs, ctrl, transclude) {
                        transclude(scope, function (clone, scope) {
                            element.append(clone);
                        });

                        //reset form on open and close

                        var modalContainer = element.closest('.uk-modal');
                        if (modalContainer) {
                            modalContainer.on({
                                'show.uk.modal': function () {
                                },
                                'hide.uk.modal': function () {
                                    element.parsley('reset');
                                    scope.model.$reset();
                                }
                            });
                        }
                    }
                };

                return directive;
            }]);
var _templateDom = '';
angular
    .module('share')
        .directive('shInput',
            ['$compile', 'locale', function ($compile, locale) {
                var select_config = {
                    //plugins: {
                    //    'remove_button': {
                    //        label: ''
                    //    }
                    //},
                    maxItems: 1,
                    valueField: 'origin',
                    labelField: 'locale',
                    //searchField: '',
                    placeholder: null,
                    create: false
                }

                var directive = {
                    restrict: 'AE',
                    priority: 1000,
                    replace: true,
                    scope: false,
                    require: ['^?ngModel', '^?shForm'],
                    controller: ['$scope', '$element', '$attrs', '$compile', 'share_module_config', '_', function ($scope, element, attrs, $compile, share_module_config, _) {
                        'use strict';

                        //#region define variable and abstract methods

                        //TODO : move to utility
                        if (share_module_config.debug_mode) {
                            console.log('input ctrl', $scope.$id)
                        }
                        function camelToDash(str) {
                            if (!str) return '';

                            return str.replace(/\W+/g, '-')
                                      .replace(/([a-z\d])([A-Z])/g, '$1-$2');
                        }
                        var removeDot = function (str) {
                            if (!str) return '';
                            return str.split('.').join('_');
                        }
                        var getModelName = function (str) {
                            if (!str) return '';

                            var temp = str.split('.');
                            return temp[temp.length - 1];
                        };
                        var map_type_to_html_type = function (type) {
                            var typesMap = {
                                "select": "select",
                                "mask": "text",
                                "number": "number",
                                "email": "email",
                                "string": "text",
                                "boolean": "radio"
                            }
                            var temp = '';
                            _.each(typesMap, function (value, key) {
                                if (key.indexOf(type.toLowerCase()) > -1) {
                                    temp = value;
                                }
                            });
                            return (temp == '') ? type : temp;
                        }
                        var map_by_name = function (name) {
                            var res,
                            typesMap = {
                                "email": "email",
                            }
                            _.each(typesMap, function (value, key) {
                                if (name.toLowerCase().indexOf(key) > -1) { res = value };
                            });

                            return res;
                        }
                        var get_type = function () {
                            var res;
                            var parnet_actionPath = $scope.actionPath;
                            var formActionSchema = $scope.$$$api[parnet_actionPath.controllerName][parnet_actionPath.actionName].$$instance.$$schema;

                            /*  when the input has ngModel the priority of types is equal
                            *   1. dom type attribute
                            *   2. schema input-type
                            *   3. schema type
                            *       if don't set schema type we use Default 'text' type
                            *
                            *   the priority of types is equal when the input is button
                            *   1. attribute type
                            *   
                            */
                            if ("ngModel" in attrs) {
                                var item_schema = _.getValue(formActionSchema, attrs.ngModel);

                                if ("type" in attrs) {
                                    $scope.primaryType = attrs.type;
                                    map_type_to_html_type(attrs.type);
                                }
                                else if (item_schema && "InputType" in item_schema) {
                                    $scope.primaryType = item_schema["InputType"];
                                    res = map_type_to_html_type(item_schema["InputType"]);
                                }
                                else if (item_schema && "Type" in item_schema) {
                                    $scope.primaryType = item_schema["Type"];
                                    res = map_type_to_html_type(item_schema["Type"]);
                                } else {
                                    var mapped = map_by_name(attrs.ngModel);
                                    $scope.primaryType = mapped || 'text';
                                    res = mapped || "text";
                                }
                            } else {
                                res = (attrs.type) ? attrs.type : "button";
                            }

                            return res;
                        },
                        getFormId = function () {
                            return element.closest('form').attr('id') || '';
                        },
                        get_i18n = function () {
                            var res = "";
                            var key = "";
                            if (attrs.ngModel) {
                                key = attrs.ngModel.split('.').pop();
                            } else if (attrs.i18n) {
                                key = attrs.i18n;
                            } else if (attrs.type) {
                                key = attrs.type;
                            }

                            res = [i18nPath, key].join('.');
                            return res;
                        };
                        var getModel = function () {
                            var container = (attrs.model) ? attrs.model : "model";
                            return [container, attrs.ngModel].join('.');
                        }

                        var i18nPath = attrs.i18nPath || 'common',
                            value = attrs.value,
                            customClass = attrs.class || '',
                            type = get_type(),
                            formId = getFormId(),
                            model = getModel(),
                            modelId = removeDot(model),
                            modelName = getModelName(model),
                            i18n_name = get_i18n(),
                            template = '',
                            $id_debugger = (share_module_config.show_$id) ? "sh_input directive : {{$id}}" : '';

                        var parnet_actionPath = $scope.actionPath,
                            formActionSchema = $scope.$$$api[parnet_actionPath.controllerName][parnet_actionPath.actionName].$$instance.$$schema;
                        if (attrs.ngModel)
                            $scope.item_schema = _.getValue(formActionSchema, attrs.ngModel);
                        //#endregion

                        //#region config from directive attribute and model schema

                        var configurableAttrs = { 'required': { schema: 'IsRequired' }, 'readonly': { schema: 'Readonly' }, 'min': { schema: 'Min' }, 'max': { schema: 'Max' }, 'maxlength': { schema: 'MaxLength' }, 'minlength': { schema: 'MinLength' }, 'parsleyPattern': { schema: 'Pattern', dataAttr: true }, 'inputmask': {}, 'inputmaskShowmaskonhover': {} },
                            configurableAttrsResult = '';

                        //#region setting that read from directive attribiute

                        for (var key in configurableAttrs) {
                            var dataAttr = (element.attr('data-' + camelToDash(key)) != undefined) ? 'data-' : '';
                            configurableAttrs[key] =
                                (key in attrs)
                                    ? dataAttr + camelToDash(key) + ((attrs[key] == "") ? "" : '="' + attrs[key] + '"')
                                    : configurableAttrs[key];
                        }

                        //#endregion

                        //#region setting that read from action schema

                        for (var key in configurableAttrs) {
                            if (!("ngModel" in attrs)) continue;
                            if (_.is.not.object(configurableAttrs[key])) continue;
                            if (!("schema" in configurableAttrs[key])) continue;
                            var model_schema = _.getValue(formActionSchema, attrs.ngModel);
                            if (!model_schema) continue;

                            var dataAttr = (configurableAttrs[key].dataAttr) ? 'data-' : '';

                            configurableAttrs[key] = (configurableAttrs[key].schema in model_schema)
                                ? dataAttr + camelToDash(key) + '=' + model_schema[configurableAttrs[key].schema]
                                : configurableAttrs[key]
                        }

                        if ($scope.readonly)
                            configurableAttrs.readonly = " readonly=true ";

                        //#endregion

                        for (var key in configurableAttrs)
                            configurableAttrsResult += (_.is.object(configurableAttrs[key])) ? " " : configurableAttrs[key] + " ";

                        var haveCharCount = (_.is.object(configurableAttrs.maxlength) && _.is.object(configurableAttrs.minlength)) ? '' : 'char-counter';

                        //#endregion

                        //#region build template according to type
                        $scope.optionsAction = {
                            Result: ["ss"]
                        }
                        if (type == 'select') {
                            $scope.select_config = select_config;
                            locale.ready(i18nPath).then((function (item_schema, modelId, i18nPath) {
                                return function () {
                                    $scope.options = $scope.options || {};
                                    $scope.options[modelId] = _.map(item_schema.options, function (item) {
                                        return {
                                            origin: item,
                                            locale: locale.getString([i18nPath, item].join('.'), {}),
                                        }
                                    });
                                }
                            })($scope.item_schema, modelId, i18nPath));
                            template =
                                '<div class="parsley-row uk-margin-medium-bottom">\
                                    '+ $id_debugger + '\
                                    <label class="uk-form-label uk-text-muted uk-text-small" data-i18n="' + i18n_name + '"></label>\
                                    <input selectize id="' + modelId + '" \
                                    ' + configurableAttrsResult + '\
                                    config="select_config" \
                                    position="bottom" \
                                    ng-disabled="disable"    \
                                    options="' + "options." + modelId + '" \
                                    ng-model="'+ model + '" /> \
                                </div>';
                        } else if (type == 'textarea') {
                            template = '';
                        } else if (type == "reset") {
                            var className = ("full" in attrs)
                                ? "md-btn md-btn-flat md-btn-mini md-btn-wave waves-effect waves-button"
                                : "md-btn md-btn-flat md-btn-flat-primary md-btn-wave waves-effect waves-button";
                            template = '<button type="reset" class="' + className + '"\
                                    id="' + formId + '-cancel"\
                                    data-i18n=\"' + i18n_name + '\" ></button>';
                        } else if (type == "cancel") {
                            var className = ("full" in attrs)
                                ? " uk-modal-close md-btn md-btn-flat md-btn-mini md-btn-wave waves-effect waves-button"
                                : " uk-modal-close md-btn md-btn-flat md-btn-flat-primary md-btn-wave waves-effect waves-button";
                            template = '<button type="button" class="' + className + '"\
                                    id="' + formId + '-cancel"\
                                    data-i18n=\"' + i18n_name + '\" ></button>';
                        } else if (type == "submit") {
                            var className = ("full" in attrs)
                                ? "md-btn md-btn-primary md-btn-block md-btn-wave-light waves-effect waves-button waves-light " + customClass
                                : "md-btn md-btn-primary  md-btn-wave-light waves-effect waves-button waves-light ng-scope uk-float-left " + customClass;

                            template = '<button type="submit" class="' + className + '"\
                                    id="' + formId + '-submit"\
                                    data-i18n=\"' + i18n_name + '\" ></button>';
                        } else if (type == "radio") {
                            template = '<span class="icheck-inline">\
                                        <input type="radio" name="'+ modelId + '" id="' + modelId + '" icheck ng-model="' + model + '" value="' + value + '" />\
                                        <label for="' + modelId + '" class="inline-label uk-badge ' + customClass + '" data-i18n="' + i18n_name + ':' + value + '"></label>\
                                    </span>';

                        } else {
                            template =
                                '<div class="parsley-row ' + ((haveCharCount == '') ? 'uk-margin-medium-bottom' : '') + '">\
                                '+ $id_debugger + '\
                                <label for="' + modelId + '" data-i18n="' + i18n_name + '"></label>\
                                <input ng-model="' + model + '" type="' + type + '"' + configurableAttrsResult + ' ' + haveCharCount + ' class="md-input" id="' + modelId + 'Field" name="' + modelId + '" md-input />\
                            </div>'
                        }

                        //#endregion

                        //#region add and compile template
                        locale.ready(attrs.i18nPath || 'common').then(function () {
                            var tempTemplateDom = document.createElement('div');
                            tempTemplateDom.innerHTML = template;
                            var templateDom = tempTemplateDom.querySelector('div') || tempTemplateDom.querySelector('span') || tempTemplateDom.querySelector('button');
                            element.replaceWith(templateDom)
                            _templateDom = templateDom;

                            $compile(_templateDom)($scope);
                            if ($scope.primaryType == 'mask') {
                                angular.element(templateDom).find('input').inputmask();
                                angular.element(templateDom).find('input').addClass('masked_input');
                            }
                        });
                        //#endregion

                        if (share_module_config.debug_mode) {
                            $scope[modelId] = modelId;
                        }
                    }],
                    compile: function CompilingFunction($templateElement, $templateAttributes) {
                        //if (share_module_config.debug_mode) {
                        //    console.log('input compile')
                        //}
                        return {
                            pre: function ($scope, element, attrs) {
                                //if (share_module_config.debug_mode) {
                                //    console.log('input pre', $scope.$id)
                                //}
                            },
                            post: function ($scope, element, attrs, ctrls) {
                                //if (share_module_config.debug_mode) {
                                //    console.log('input post', $scope.$id)
                                //}
                            }
                        }
                    },
                };

                return directive;
            }]);
angular
    .module('share')
        .directive('shModel',
            [function () {
                var directive = {
                    restrict: 'EA',
                    require: '^?ngModel',
                    //scope: { action: "@" },
                    controller: ['$scope', '$element', '$attrs', '$compile', function ($scope, element, attrs, $compile) {
                        debugger
                        element.attr("ng-model", "issueModel.VoucherCodePrefix");
                    }],
                    link: function (scope, iElement, iAttrs, ngModelCtrl) {
                        debugger;
                        ngModelCtrl.$formatters.push(function (modelValue) {
                            var colours = modelValue.split('');
                            return {
                                red: colours[0],
                                green: colours[1],
                                blue: colours[2]
                            };
                        });

                        ngModelCtrl.$render = function () {
                            debugger;
                            scope.red = ngModelCtrl.$viewValue.red;
                            scope.green = ngModelCtrl.$viewValue.green;
                            scope.blue = ngModelCtrl.$viewValue.blue;
                        };

                        scope.$watch('red + green + blue', function () {
                            debugger;
                            ngModelCtrl.$setViewValue({
                                red: scope.red,
                                green: scope.green,
                                blue: scope.blue
                            });
                        });

                        // add validation
                        ngModelCtrl.$parsers.push(function (viewValue) {
                            debugger;
                            var blueSelected = (viewValue.red === "0"
                                && viewValue.green === "0"
                                && viewValue.blue === "F");

                            ngModelCtrl.$setValidity(
                                iAttrs.ngModel + '_badColour',
                                !blueSelected
                            );

                            return viewValue;
                        });

                        ngModelCtrl.$parsers.push(function (viewValue) {
                            debugger;
                            return "#" + [viewValue.red, viewValue.green, viewValue.blue].join('');
                        });
                    }
                };

                return directive;
            }]);
angular
    .module('share')
    .directive('dropify',
        [function () {
            var directive = {
                restrict: 'C',
                priority: 1000,
                scope: false,
                require: 'ngModel',
                controller: ['$scope', '$element', '$parse', '$attrs', '$compile', 'share_module_config', '_', 'locale', function ($scope, element, $parse, attrs, $compile, share_module_config, _, locale) {
                    'use strict';


                }],
                compile: function CompilingFunction($templateElement, $templateAttributes) {
                    return {
                        pre: function ($scope, element, attrs) {
                        },
                        post: function ($scope, element, attrs, ngModelCtrl) {
                            $(element).dropify();
                            
                            element.on('change', function () {
                                var value = element.val();
                                if(!value) return;
                                
                                ngModelCtrl.$setViewValue(value);
                                ngModelCtrl.$render();
                            })

                        }
                    }
                },
            };

            return directive;
        }]);
angular
    .module('share')
        .directive('snOpenModal', ['$compile', function ($compile) {
            var controller = function ($scope, element, attrs, $compile, share_module_config, _) { };
            var compiling = function ($templateElement, $templateAttributes) { };
            var pre = function ($scope, element, attrs, ctrls, $transclude) { };
            var post = function ($scope, element, attrs, ctrls, $transclude) {
                $scope.modalId = "#" + attrs.modalId;

                $(element).on('click', function () {
                    //$scope.model.$reset();
                    //var modalEl = document.querySelector("#" + attrs.modalId);
                    //var formEl = modalEl.querySelector('form');
                    //$(formEl).parsley('reset');
                });
            };

            //#region export directive

            var directive = {
                restrict: 'EA',
                priority: 1500,
                replace: true,
                transclude: false,
                templateUrl: "client/core/directives/sn_open_modal.directive.html",
                require: [],
                scope: false,
                controller: ['$scope', '$element', '$attrs', '$compile', 'share_module_config', "_", controller],
                compile: function CompilingFunction($templateElement, $templateAttributes) {
                    compiling($templateElement, $templateAttributes);
                    return {
                        pre: pre,
                        post: post
                    }
                }
            }

            return directive;

            //#endregion

        }]);
angular
    .module('share')
        .directive('snSelect',
            [function () {
                var directive = {
                    restrict: 'AE',
                    priority: 1000,
                    replace: true,
                    scope: true,
                    require: ['^?ngModel', '^?shForm'],
                    controller: ['$scope', '$element', '$attrs', '$compile', 'share_module_config', '_', 'locale', function ($scope, element, attrs, $compile, share_module_config, _, locale) {
                        'use strict';
                        if (share_module_config.debug_mode) {
                            console.log('select ctrl')
                        }

                        //#region define constant & parameters & and abstract methods

                        var ADD_OPTION_ACTION_ATTR = "addOptionAction";
                        var PARENT_MODEL = "model";
                        var temp_for_added_options = {};
                        //TODO : move to utility
                        function camelToDash(str) {
                            if (!str) return '';

                            return str.replace(/\W+/g, '-')
                                      .replace(/([a-z\d])([A-Z])/g, '$1-$2');
                        }
                        var removeDot = function (str) {
                            if (!str) return '';
                            return str.split('.').join('_');
                        }
                        var getModelName = function (str) {
                            if (!str) return '';

                            var temp = str.split('.');
                            return temp[temp.length - 1];
                        },
                        getFormId = function () {
                            return element.closest('form').attr('id') || '';
                        }

                        var defult_config = {
                            plugins: {
                                'remove_button': {
                                    label: ''
                                }
                            },
                            maxItems: 1,
                            valueField: '',
                            labelField: '',
                            searchField: '',
                            placeholder: null,
                            create: false,
                            onOptionAdd: function () { },
                            onInitialize: function (element) {

                            }
                        }
                    
                        var i18nPath = attrs.i18nPath || 'common',
                            value = attrs.value,
                            customClass = attrs.class || '',
                            formId = getFormId(),
                            model = [PARENT_MODEL, attrs.ngModel].join('.'),
                            instance_id = 'selectize_config',
                            config = instance_id,
                            modelId = _.uniqueId(removeDot(model)),
                            position = '',
                            valueFieldname = "",
                            optionsPath = attrs.optionsPath || "Result.Items",
                            labelFieldname = "",
                            modelName = getModelName(model),
                            i18n_name = [i18nPath, modelName].join('.'),
                            required = '',
                        haveCharCount = ('maxlength' in attrs) ? 'char-counter' : '',
                        template = '',
                        $id_debugger = (share_module_config.show_$id) ? "inside row{{$id}}" : '';
                        $scope.modelId = modelId;
                        //#endregion

                        //#region config

                        locale.ready(i18nPath).then(function () {
                            $scope[instance_id].placeholder = locale.getString(i18n_name, {});
                        });
                        $scope[instance_id] = _.extend($scope[instance_id] || {}, defult_config);
                        if (attrs.action.indexOf('.') == -1) {
                            $scope[modelName] = $scope.$parent[attrs.action];
                        }
                        else {
                            var actionPath = attrs.action.split('.');

                            $scope.optionsAction =
                                $scope.$root.$$$api[actionPath[0]][actionPath[1]]
                                    .$init();
                            $scope.$root.$$$api[actionPath[0]][actionPath[1]]
                                .$promise
                                .then(function () {
                                    $scope.disable = false;
                                })
                            //.$update($scope.$parent.$parent.model);

                            //#region find required properties for invoke action

                            var required_properties_path = _.filter(_.report($scope.optionsAction.$$schema), function (item) {
                                return item.path.indexOf('IsRequired') > 1;
                            })
                            var required_properties = _.map(required_properties_path, function (item) {
                                var path = item.path.split('.');
                                path.pop();
                                path.unshift(PARENT_MODEL);
                                return path.join('.');
                            });
                            if (required_properties.length > 0) {
                                $scope.$watchGroup(required_properties, function (new_value) {
                                    var undefined_field = _.filter(new_value, function (i) { return _.is.undefined(i) });
                                    var empty_field = _.filter(new_value, function (i) { return !i || i.length === 0 });
                                    if (empty_field.length === 0 && undefined_field.length === 0) {
                                        $scope.optionsAction.$invoke();
                                    }
                                    else {
                                        var $selectize = $("#" + modelId)[0];
                                        $selectize && $selectize.selectize && $selectize.selectize.clear();
                                        $scope.disable = true;
                                    }
                                });
                            } else {
                                $scope.optionsAction.$invoke();
                                $scope.disable = false;
                            }

                            //#endregion
                        }


                        //#region set config.required

                        var parnet_actionPath = $scope.$parent.actionPath;
                        var formActionSchema = $scope.$$$api[parnet_actionPath.controllerName][parnet_actionPath.actionName].$$instance.$$schema;
                        required =
                            ((attrs.ngModel in formActionSchema)
                                && ("IsRequired" in formActionSchema[attrs.ngModel])
                                && formActionSchema[attrs.ngModel].IsRequired === true)
                                    ? ' required '
                                    : '';

                        //#endregion

                        var configurable_attribute = ['maxItems', 'valueField', 'searchFiled', 'labelField', 'create'];
                        _.each(configurable_attribute, function (key) {
                            if (!(key in attrs)) return;
                            $scope[instance_id][key] = attrs[key];
                        });

                        //use value field for search if search field not defined
                        if (attrs.labelField && !attrs.searchField)
                            $scope[instance_id].searchField = attrs.labelField;
                        if ($scope[instance_id].create)
                            position = "bottom";
                        //#endregion

                        valueFieldname = $scope[instance_id].valueField;
                        labelFieldname = $scope[instance_id].labelField;

                        //#region add action for opOptionAdd callback config

                        if (ADD_OPTION_ACTION_ATTR in attrs) {
                            var actionPath = attrs[ADD_OPTION_ACTION_ATTR].split('.');
                            $scope[ADD_OPTION_ACTION_ATTR] = $scope.$root.$$$api[actionPath[0]][actionPath[1]].$init();

                            $scope[instance_id].onOptionAdd = function (value, valueObject) {
                                if (valueObject[valueFieldname] != valueObject[labelFieldname]
                                    || value in temp_for_added_options) return;

                                temp_for_added_options[value] = true;
                                //TODO : if this action model and scope.model have same property data be destroyed
                                $scope[ADD_OPTION_ACTION_ATTR].$update($scope.model);
                                $scope[ADD_OPTION_ACTION_ATTR][labelFieldname] = value;
                                $scope[ADD_OPTION_ACTION_ATTR]
                                    .$promise
                                    .then(function (resp) {
                                        var $selectize = $("#" + modelId)[0]
                                        valueObject[valueFieldname] = resp.Result[valueFieldname];
                                        $selectize.selectize.updateOption(value, valueObject);
                                        $selectize.selectize.setValue(resp.Result[valueFieldname]);
                                    });
                                $scope[ADD_OPTION_ACTION_ATTR].$invoke();
                            }
                        }

                        //#endregion

                        //#region build template

                        var template =
                              '<div class="parsley-row uk-margin-medium-bottom">\
                               '+ $id_debugger + '\
                               <label class="uk-form-label uk-text-muted uk-text-small" data-i18n="' + i18n_name + '"></label>\
                               <input selectize id="' + modelId + '" \
                               '+ required + '\
                                ng-disabled="disable"    \
                                config="'+ config + '" \
                                position="' + position + '" \
                                options="' + "optionsAction." + optionsPath + '" \
                                ng-model="'+ model + '" /> \
                           </div>'

                        //#endregion

                        //#region add and compile template

                        var tempTemplateDom = document.createElement('div');
                        tempTemplateDom.innerHTML = template;
                        var templateDom = tempTemplateDom.querySelector('div') || tempTemplateDom.querySelector('span') || tempTemplateDom.querySelector('button');
                        element.replaceWith(templateDom)
                        $compile(templateDom)($scope);

                        //#endregion
                    }],
                    compile: function CompilingFunction($templateElement, $templateAttributes) {
                        //if (share_module_config.debug_mode) {
                        //    console.log('select compile')
                        //}

                        //$templateElement.replaceWith(this.template);
                        return {
                            pre: function ($scope, element, attrs) {
                                //if (share_module_config.debug_mode) {
                                //    console.log('select pre')
                                //}
                            },
                            post: function ($scope, element, attrs, ctrls) {
                                //if (share_module_config.debug_mode) {
                                //    console.log('select post')
                                //}
                                $scope.disable = true;
                            }
                        }
                    },
                };

                return directive;
            }]);
app
    .filter('multiSelectFilter', function () {
        return function (items, filterData) {
            if(filterData == undefined)
                return items;
            var keys = Object.keys(filterData);
            var filtered = [];
            var populate = true;

            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                populate = true;
                for(var j = 0; j < keys.length ; j++){
                    if(filterData[keys[j]] != undefined){
                        if(filterData[keys[j]].length == 0 || filterData[keys[j]].contains(item[keys[j]])){
                            populate = true;
                        } else {
                            populate = false;
                            break;
                        }
                    }
                }
                if(populate){
                    filtered.push(item);
                }
            }
            return filtered;
        };
    })
    .filter("jsonDate", function() {
        return function(x) {
            if(x) return new Date(x);
            else return null;
        };
    })
    .filter("momentDate", function() {
        return function(x,date_format_i,date_format_o) {
            if(x) {
                if(date_format_i) {
                    return moment(x, date_format_i).format(date_format_o)
                } else {
                    return moment(new Date(x)).format(date_format_o)
                }
            }
            else return null;
        };
    })
    .filter("initials", function() {
        return function(x) {
            if(x) {
                return x.split(' ').map(function (s) {
                    return s.charAt(0);
                }).join('');
            } else {
                return null;
            }
        };
    })
;
/*
 *  Admin angularjs
 *  controller
 */

angular
    .module('share')
    .controller('mainCtrl', [
        '$scope',
        '$rootScope',
        'scopeManager',
        'notifyService',
        'locale', 
        function ($scope, $rootScope, scopeManager, notifyService, shortcuts_service, locale) {
            $rootScope.$scopeManager = scopeManager;
            $rootScope.$$$notify = notifyService;
            $rootScope.$$$models = {};
            $rootScope.$$$debugMode = true;

        }
    ])
;

angular
    .module('main_sidebar')
        .service('main_sidebar_menu.service', ['_', function (_) {
            var sections = [];
            this.registerNewSection = function (menuItems) {
                menuItems = (angular.isArray(menuItems)) ? menuItems : [menuItems];
                for (var i = 0; i < menuItems.length; i++) {
                    if (menuItems[i].parent) {
                        var parentSection =_.filter(sections, function (item) { return item.title == menuItems[i].parent });
                        parentSection[0].submenu = parentSection[0].submenu || [];
                        parentSection[0].submenu.push(menuItems[i]);
                    } else {
                        sections.push(menuItems[i]);
                    }
                }
            }
            this.register_sub_menu = function (menuItems) {
                menuItems = (angular.isArray(menuItems)) ? menuItems : [menuItems];
                for (var i = 0; i < menuItems.length; i++) {
                    if (menuItems[i].parent) {
                    } else {
                        sections.push(menuItems[i]);
                    }
                }
            }
            this.getSections = function () {
                return sections;
            }
        }]);
angular
    .module('main_sidebar')
        .controller('main_sidebar.controller', [
            '$timeout',
            '$scope',
            '$rootScope',
            '$filter',
            '$rootScope',
            'main_sidebar_menu.service',
            'shortcuts.service',
            '$state',
            '_',
            'authentication',
            function ($timeout, $scope, $rootScope, $filter, $rootScope, main_sidebar_menu_service, shortcuts_service, $state, _, authentication) {

                $rootScope.sections = [];
                var sections = main_sidebar_menu_service.getSections();
                var state;
                var user = authentication.get_user();
                _.each(sections, function (section) {
                    state = $state.get(section.link);
                    if (!state.data || !state.data.roles || state.data.roles.length == 0 || authentication.is_in_any_role(state.data.roles))
                        $rootScope.sections.push(section);
                })

                $scope.shortcuts = shortcuts_service.getItems()

                $scope.$on('onLastRepeat', function (scope, element, attrs) {
                    $timeout(function () {
                        if (!$rootScope.miniSidebarActive) {
                            // activate current section
                            //$('#sidebar_main #menu_sections').find('.current_section > a').trigger('click');
                        } else {
                            // add tooltips to mini sidebar
                            var tooltip_elem = $('#sidebar_main').find('.menu_tooltip');
                            tooltip_elem.each(function () {
                                var $this = $(this);

                                $this.attr('title', $this.find('.menu_title').text());
                                UIkit.tooltip($this, {});
                            });
                        }
                    })
                });

                // language switcher
                $scope.langSwitcherModel = 'gb';
                var langData = $scope.langSwitcherOptions = [
                    { id: 1, title: 'English', value: 'gb' },
                    { id: 2, title: 'فارسی', value: 'fa' }
                ];
                $scope.langSwitcherConfig = {
                    maxItems: 1,
                    render: {
                        option: function (langData, escape) {
                            return '<div class="option">' +
                                '<i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i>' +
                                '<span>' + escape(langData.title) + '</span>' +
                                '</div>';
                        },
                        item: function (langData, escape) {
                            return '<div class="item"><i class="item-icon flag-' + escape(langData.value).toUpperCase() + '"></i></div>';
                        }
                    },
                    valueField: 'value',
                    labelField: 'title',
                    searchField: 'title',
                    create: false,
                    onInitialize: function (selectize) {
                        $('#lang_switcher').next().children('.selectize-input').find('input').attr('readonly', true);
                    }
                };

            }
        ])
/*
 *  Admin angularjs
 *  controller
 */

angular
    .module('share')
        .controller('main_header.controller', ['$timeout', '$scope', '$filter', '$window', 'authentication',
            function ($timeout, $scope, $filter, $window, $authentication) {
                $scope.logout = function () {
                    $authentication.logout();
                }

                $('#menu_top').children('[data-uk-dropdown]').on('show.uk.dropdown', function () {
                    $timeout(function () {
                        $($window).resize();
                    }, 280)
                });
            }])
;

/* ocLazyLoad config */

app
    .config([
        '$ocLazyLoadProvider',
        function($ocLazyLoadProvider) {
            $ocLazyLoadProvider.config({
                debug: false,
                events: false,
                modules: [
                    // ----------- UIKIT ------------------
                    {
                        name: 'lazy_uikit',
                        files: [
                            // uikit core
                            "bower_components/uikit/js/uikit.min.js",
                            // uikit components
                            "bower_components/uikit/js/components/accordion.min.js",
                            "bower_components/uikit/js/components/autocomplete.min.js",
                            "public/assets/js/custom/uikit_datepicker.min.js",
                            "bower_components/uikit/js/components/form-password.min.js",
                            "bower_components/uikit/js/components/form-select.min.js",
                            "bower_components/uikit/js/components/grid.min.js",
                            "bower_components/uikit/js/components/lightbox.min.js",
                            "bower_components/uikit/js/components/nestable.min.js",
                            "bower_components/uikit/js/components/notify.min.js",
                            "bower_components/uikit/js/components/slideshow.min.js",
                            "bower_components/uikit/js/components/sortable.min.js",
                            "bower_components/uikit/js/components/sticky.min.js",
                            "bower_components/uikit/js/components/tooltip.min.js",
                            "public/assets/js/custom/uikit_timepicker.min.js",
                            "bower_components/uikit/js/components/upload.min.js",
                            "public/assets/js/custom/uikit_beforeready.min.js"
                        ],
                        serie: true
                    },

                    // ----------- FORM ELEMENTS -----------
                    {
                        name: 'lazy_autosize',
                        files: [
                            'bower_components/autosize/dist/autosize.min.js',
                            'public/client/modules/angular-autosize.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_iCheck',
                        files: [
                            "bower_components/iCheck/icheck.min.js",
                            'public/client/modules/angular-icheck.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_selectizeJS',
                        files: [
                            'bower_components/selectize/dist/js/standalone/selectize.min.js',
                            'public/client/modules/angular-selectize.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_switchery',
                        files: [
                            'bower_components/switchery/dist/switchery.min.js',
                            'public/client/modules/angular-switchery.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_ionRangeSlider',
                        files: [
                            'bower_components/ion.rangeslider/js/ion.rangeSlider.min.js',
                            'public/client/modules/angular-ionRangeSlider.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_masked_inputs',
                        files: [
                             'bower_components/jquery.inputmask/dist/min/jquery.inputmask.bundle.min.js'
                        ]
                    },
                    {
                        name: 'lazy_character_counter',
                        files: [
                            'public/client/modules/angular-character-counter.js'
                        ]
                    },
                    {
                        name: 'lazy_parsleyjs',
                        files: [
                            'public/assets/js/custom/parsleyjs_config.min.js',
                            'bower_components/parsleyjs/dist/parsley.min.js',
                            'bower_components/parsleyjs/src/i18n/fa.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_wizard',
                        files: [
                            'bower_components/angular-wizard/dist/angular-wizard.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_ckeditor',
                        files: [
                            'bower_components/ckeditor/ckeditor.js',
                            'public/client/modules/angular-ckeditor.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_tinymce',
                        files: [
                            'bower_components/tinymce/tinymce.min.js',
                            'public/client/modules/angular-tinymce.js'
                        ],
                        serie: true
                    },

                    // ----------- CHARTS -----------
                    {
                        name: 'lazy_charts_chartist',
                        files: [
                            'bower_components/chartist/dist/chartist.min.css',
                            'bower_components/chartist/dist/chartist.min.js',
                            'public/client/modules/angular-chartist.js'
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },
                    {
                        name: 'lazy_charts_easypiechart',
                        files: [
                            'bower_components/jquery.easy-pie-chart/dist/angular.easypiechart.min.js'
                        ]
                    },
                    {
                        name: 'lazy_charts_metricsgraphics',
                        files: [
                            'bower_components/metrics-graphics/dist/metricsgraphics.css',
                            'bower_components/d3/d3.min.js',
                            'bower_components/metrics-graphics/dist/metricsgraphics.min.js',
                            'public/client/metrics_graphics/directives/metrics-graphics.js'
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },
                    {
                        name: 'lazy_charts_c3',
                        files: [
                            'bower_components/c3js-chart/c3.min.css',
                            'bower_components/d3/d3.min.js',
                            'bower_components/c3js-chart/c3.min.js',
                            'bower_components/c3-angular/c3-angular.min.js'
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },
                    {
                        name: 'lazy_charts_peity',
                        files: [
                            'bower_components/peity/jquery.peity.min.js',
                            'public/client/modules/angular-peity.js'
                        ],
                        serie: true
                    },

                    // ----------- COMPONENTS -----------
                    {
                        name: 'lazy_countUp',
                        files: [
                            'bower_components/countUp.js/dist/countUp.min.js',
                            'public/client/modules/angular-countUp.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_clndr',
                        files: [
                            'bower_components/clndr/clndr.min.js',
                            'bower_components/angular-clndr/angular-clndr.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_google_maps',
                        files: [
                            'bower_components/ngmap/build/scripts/ng-map.min.js',
                            'bower_components/ngmap/directives/places-auto-complete.js',
                            'bower_components/ngmap/directives/marker.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_weathericons',
                        files: [
                            'bower_components/weather-icons/css/weather-icons.min.css'
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },
                    {
                        name: 'lazy_prismJS',
                        files: [
                            "bower_components/prism/prism.js",
                            "bower_components/prism/components/prism-php.js",
                            "bower_components/prism/plugins/line-numbers/prism-line-numbers.js",
                            'public/client/modules/angular-prism.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_dragula',
                        files: [
                            'bower_components/angular-dragula/dist/angular-dragula.min.js'
                        ]
                    },
                    {
                        name: 'lazy_pagination',
                        files: [
                            'bower_components/angularUtils-pagination/dirPagination.js'
                        ]
                    },
                    {
                        name: 'lazy_diff',
                        files: [
                            'bower_components/jsdiff/diff.min.js'
                        ]
                    },

                    // ----------- PLUGINS -----------
                    {
                        name: 'lazy_fullcalendar',
                        files: [
                            'bower_components/fullcalendar/dist/fullcalendar.min.css',
                            'bower_components/fullcalendar/dist/fullcalendar.min.js',
                            'bower_components/fullcalendar/dist/gcal.js',
                            'bower_components/angular-ui-calendar/src/calendar.js'
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },
                    {
                        name: 'lazy_codemirror',
                        files: [
                            "bower_components/codemirror/lib/codemirror.css",
                            "public/assets/css/codemirror_themes.min.css",
                            "bower_components/codemirror/lib/codemirror.js",
                            "public/assets/js/custom/codemirror_fullscreen.min.js",
                            "bower_components/codemirror/addon/edit/matchtags.js",
                            "bower_components/codemirror/addon/edit/matchbrackets.js",
                            "bower_components/codemirror/addon/fold/xml-fold.js",
                            "bower_components/codemirror/mode/htmlmixed/htmlmixed.js",
                            "bower_components/codemirror/mode/xml/xml.js",
                            "bower_components/codemirror/mode/php/php.js",
                            "bower_components/codemirror/mode/clike/clike.js",
                            "bower_components/codemirror/mode/javascript/javascript.js",
                            "public/client/modules/angular-codemirror.js"
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },
                    {
                        name: 'lazy_datatables',
                        files: [
                            'bower_components/datatables/media/js/jquery.dataTables.min.js',
                            'bower_components/datatables-colvis/js/dataTables.colVis.js',
                            'bower_components/datatables-tabletools/js/dataTables.tableTools.js',
                            'bower_components/angular-datatables/dist/angular-datatables.js',
                            'public/assets/js/custom/jquery.dataTables.columnFilter.js',
                            'bower_components/angular-datatables/dist/plugins/columnfilter/angular-datatables.columnfilter.min.js',
                            'public/assets/js/custom/datatables_uikit.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_gantt_chart',
                        files: [
                            'bower_components/jquery-ui/ui/minified/core.min.js',
                        'bower_components/jquery-ui/ui/minified/widget.min.js',
                        'bower_components/jquery-ui/ui/minified/mouse.min.js',
                        'bower_components/jquery-ui/ui/minified/resizable.min.js',
                        'bower_components/jquery-ui/ui/minified/draggable.min.js',
                            'public/assets/js/custom/gantt_chart.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_tablesorter',
                        files: [
                            'bower_components/tablesorter/dist/js/jquery.tablesorter.min.js',
                            'bower_components/tablesorter/dist/js/jquery.tablesorter.widgets.min.js',
                            'bower_components/tablesorter/dist/js/widgets/widget-alignChar.min.js',
                            'bower_components/tablesorter/dist/js/widgets/widget-columnSelector.min.js',
                            'bower_components/tablesorter/dist/js/widgets/widget-print.min.js',
                            'bower_components/tablesorter/dist/js/extras/jquery.tablesorter.pager.min.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_vector_maps',
                        files: [
                            'bower_components/raphael/raphael-min.js',
                            'bower_components/jquery-mapael/js/jquery.mapael.js',
                            'bower_components/jquery-mapael/js/maps/world_countries.js',
                            'bower_components/jquery-mapael/js/maps/usa_states.js'
                        ],
                        serie: true
                    },
                    {
                        name: 'lazy_dropify',
                        files: [
                            'public/assets/skins/dropify/css/dropify.css',
                            'public/assets/js/custom/dropify/dist/js/dropify.min.js'
                        ],
                        insertBefore: '#main_stylesheet'
                    },
                    {
                        name: 'lazy_tree',
                        files: [
                            'public/assets/skins/jquery.fancytree/ui.fancytree.min.css',
                            'bower_components/jquery-ui/jquery-ui.min.js',
                            'bower_components/jquery.fancytree/dist/jquery.fancytree-all.min.js'
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },
                    {
                        name: 'lazy_idle_timeout',
                        files: [
                            'bower_components/ng-idle/angular-idle.min.js'
                        ]
                    },

                    // ----------- KENDOUI COMPONENTS -----------
                    {
                        name: 'lazy_KendoUI',
                        files: [
                            'bower_components/kendo-ui/js/kendo.core.min.js',
                            'bower_components/kendo-ui/styles/kendo.rtl.min.css',
                            'bower_components/kendo-ui/js/kendo.color.min.js',
                            'bower_components/kendo-ui/js/kendo.data.min.js',
                            'bower_components/kendo-ui/js/kendo.calendar.min.js',
                            'bower_components/kendo-ui/js/kendo.popup.min.js',
                            'bower_components/kendo-ui/js/kendo.datepicker.min.js',
                            'bower_components/kendo-ui/js/kendo.timepicker.min.js',
                            'bower_components/kendo-ui/js/kendo.datetimepicker.min.js',
                            'bower_components/kendo-ui/js/kendo.list.min.js',
                            'bower_components/kendo-ui/js/kendo.fx.min.js',
                            'bower_components/kendo-ui/js/kendo.userevents.min.js',
                            'bower_components/kendo-ui/js/kendo.menu.min.js',
                            'bower_components/kendo-ui/js/kendo.draganddrop.min.js',
                            'bower_components/kendo-ui/js/kendo.slider.min.js',
                            'bower_components/kendo-ui/js/kendo.mobile.scroller.min.js',
                            'bower_components/kendo-ui/js/kendo.autocomplete.min.js',
                            'bower_components/kendo-ui/js/kendo.combobox.min.js',
                            'bower_components/kendo-ui/js/kendo.dropdownlist.min.js',
                            'bower_components/kendo-ui/js/kendo.colorpicker.min.js',
                            'bower_components/kendo-ui/js/kendo.combobox.min.js',
                            'bower_components/kendo-ui/js/kendo.maskedtextbox.min.js',
                            'bower_components/kendo-ui/js/kendo.multiselect.min.js',
                            'bower_components/kendo-ui/js/kendo.numerictextbox.min.js',
                            'bower_components/kendo-ui/js/kendo.toolbar.min.js',
                            'bower_components/kendo-ui/js/kendo.panelbar.min.js',
                            'bower_components/kendo-ui/js/kendo.window.min.js',
                            'bower_components/kendo-ui/js/kendo.angular.min.js',
                            'bower_components/kendo-ui/styles/kendo.common-material.min.css',
                            'bower_components/kendo-ui/styles/kendo.material.min.css'
                        ],
                        insertBefore: '#main_stylesheet',
                        serie: true
                    },

                    // ----------- UIKIT HTMLEDITOR -----------
                    {
                        name: 'lazy_htmleditor',
                        files: [
                            "bower_components/codemirror/lib/codemirror.js",
                            "bower_components/codemirror/mode/markdown/markdown.js",
                            "bower_components/codemirror/addon/mode/overlay.js",
                            "bower_components/codemirror/mode/javascript/javascript.js",
                            "bower_components/codemirror/mode/php/php.js",
                            "bower_components/codemirror/mode/gfm/gfm.js",
                            "bower_components/codemirror/mode/xml/xml.js",
                            "bower_components/marked/lib/marked.js",
                            "bower_components/uikit/js/components/htmleditor.js"
                        ],
                        serie: true
                    },

                    // ----------- THEMES -------------------
                    {
                        name: 'lazy_themes',
                        files: [
                            "public/assets/css/themes/_theme_a.min.css",
                            "public/assets/css/themes/_theme_b.min.css",
                            "public/assets/css/themes/_theme_c.min.css",
                            "public/assets/css/themes/_theme_d.min.css",
                            "public/assets/css/themes/_theme_e.min.css",
                            "public/assets/css/themes/_theme_f.min.css",
                            "public/assets/css/themes/_theme_g.min.css",
                            "public/assets/css/themes/_theme_h.min.css",
                            "public/assets/css/themes/_theme_i.min.css"
                        ]
                    },

                    // ----------- STYLE SWITCHER -----------
                    {
                        name: 'lazy_style_switcher',
                        files: [
                            "public/assets/css/style_switcher.min.css",
                            "public/client/style_switcher/style_switcher.js"
                        ],
                        insertBefore: '#main_stylesheet',
                    }

                ]
            })
        }
    ]);