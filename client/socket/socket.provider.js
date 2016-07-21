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