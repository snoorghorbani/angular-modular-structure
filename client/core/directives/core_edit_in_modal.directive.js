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