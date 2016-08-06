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