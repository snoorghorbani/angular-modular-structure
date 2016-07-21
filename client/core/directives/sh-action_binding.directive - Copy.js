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