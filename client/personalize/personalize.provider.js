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
