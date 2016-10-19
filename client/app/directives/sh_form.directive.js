;
angular
    .module('share')
        .directive('shForm',
            ['$parse', function ($parse) {
                var directive = {
                    restrict: 'EA',
                    priority: 999,
                    transclude: true,
                    //template: '<ng-transclude></ng-transclude>',
                    scope: true,
                    controller: ['$scope', '$element', '$attrs', '$compile', 'share_module_config', "_",
                        function ($scope, element, attrs, $compile, share_module_config, _) {
                            var $id_debugger = (share_module_config.show_$id) ? "inside form : {{$id}}" : '';

                            var MODEL = 'model';
                            var shForm = attrs.shForm;
                            $scope.readonly = (attrs.readonly) ? true : false;
                            if (share_module_config.debug_mode) {
                                $scope.form = shForm;
                                console.log('form ctrl', $scope.$id)
                            }

                            //#region configure form submit action and related properties
                            /*
                            *   this directive can get action in two model
                            *   1. get action path in this pattern                                          => sh-form="controllerName.actionName"
                            *   2. get instance of action that build in another parnet like page controller => sh-form="instanceOfAction"
                            *   
                            *   then i set actionPath property to scope for use with child scope directive to access them to schema
                            */
                            if (shForm.indexOf('.') == -1) {
                                $scope[MODEL] = $scope[shForm];
                                $scope.actionPath = {
                                    controllerName: $scope[MODEL].options.context,
                                    actionName: $scope[MODEL].options.actionName
                                };
                                if (attrs.model) {
                                    var model_getter = $parse(attrs.model);
                                    _.extend($scope[MODEL], model_getter($scope));
                                }
                            }
                            else {
                                var actionPath = attrs.shForm.split('.');
                                $scope.actionPath = {
                                    controllerName: actionPath[0],
                                    actionName: actionPath[1]
                                };

                                $scope[MODEL] = $scope.$root.$$$api[actionPath[0]][actionPath[1]]();
                                if (attrs.model) {
                                    var model_getter = $parse(attrs.model);
                                    _.extend($scope[MODEL], model_getter($scope));
                                }
                            }

                            //#endregion

                            if (share_module_config.show_$id) {
                                $scope.$watchCollection(shForm, function (n, v) { debugger })
                                $scope.$watchCollection(MODEL, function (n, v) { debugger })
                            }

                            element[0].addEventListener('reset', function () {
                                $scope[MODEL].$reset().$reset_virtuals().$invoke();
                            })
                            element
                                .parsley()
                                .on('form:validated', function () {
                                    $scope.$apply();
                                    if (element.parsley().validationResult) {
                                        $scope.model.$update({ "PagingInfo": {} }).$reset_virtuals().$invoke();
                                        //cs.model[actionPath[0]][actionPath[1]]($scope.model);
                                        //$scope.$parent[actionPath[1]].call($scope[MODEL], $scope[MODEL]);
                                    }
                                })
                                .on('field:validated', function (parsleyField) {
                                    if ($(parsleyField.$element).hasClass('md-input')) {
                                        $scope.$apply();
                                    }
                                });


                            //#region AddNoteToRequest

                            var AddNoteToRequest = $$$api.request.AddNoteToRequest.$init();
                            $$$api.request.AddNoteToRequest.$promise
                                .catch(function (respose) {
                                    var requestId = respose.config.data.RequestId;

                                    UIkit.notify({
                                        message: ["یاداشت  برای درخواست", requestId, "ثبت گردید"].join(" "),
                                        status: "success",
                                        timeout: 1000,
                                        pos: 'bottom-left',
                                    })
                                });

                            $scope.$on('save new note', function () {
                                debugger
                                $scope.model.Note = $scope.model.NewNote;
                                AddNoteToRequest.$update($scope.model);
                                AddNoteToRequest.$invoke();
                            })

                            //#endregion
                        }],

                    link: function (scope, element, attrs, ctrl, transclude) {
                        transclude(scope, function (clone, scope) {
                            element.append(clone);
                        });

                        //reset form on open and close

                        var modalContainer = element.closest('.uk-modal');
                        if (modalContainer) {
                            modalContainer.on({
                                'show.uk.modal': function () {
                                },
                                'hide.uk.modal': function () {
                                    element.parsley('reset');
                                    scope.model.$reset();
                                }
                            });
                        }
                    }
                };

                return directive;
            }])
;