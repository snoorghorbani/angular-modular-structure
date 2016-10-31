angular
    .module('share')
        .directive('amsEditItemInModal', ['$compile', function ($compile) {
            var controller = function ($scope, element, attrs, $compile, share_module_config, _) { };
            var compiling = function ($templateElement, $templateAttributes) { };
            var pre = function ($scope, element, attrs, ctrls, $transclude) { };
            var post = function ($scope, element, attrs, ctrls, $transclude) {
                var that = this;
                debugger;

                if (attrs.action.indexOf('.') != -1) {
                    var actionDefinition = {
                        context: attrs.action.split('.')[0],
                        action: attrs.action.split('.')[1]
                    }
                    this.action = $$$api[actionDefinition.context][actionDefinition.action].$init(true);
                } else {
                    this.action = $scope[attrs.action];
                }
                this.saveAction = $scope[attrs.saveAction];

                this.action.$promise.then(function (res) {
                    that.saveAction.$update(res.Result);
                });
                element.on('click', function () {
                    debugger
                    that.action.$update($scope.item).$invoke();
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
                templateUrl: 'public/core_edit_in_modal.directive.html',
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

        }])
;