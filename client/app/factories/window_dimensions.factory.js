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