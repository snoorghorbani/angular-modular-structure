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