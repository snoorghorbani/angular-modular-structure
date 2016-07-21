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