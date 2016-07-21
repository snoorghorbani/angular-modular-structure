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