﻿angular
    .module('share')
        .directive('snSelect',
            [function () {
                var directive = {
                    restrict: 'AE',
                    priority: 1000,
                    replace: true,
                    scope: true,
                    require: ['^?ngModel', '^?shForm'],
                    controller: ['$scope', '$element', '$attrs', '$compile', 'share_module_config', '_', 'locale', function ($scope, element, attrs, $compile, share_module_config, _, locale) {
                        'use strict';
                        if (share_module_config.debug_mode) {
                            console.log('select ctrl')
                        }

                        //#region define constant & parameters & and abstract methods

                        var ADD_OPTION_ACTION_ATTR = "addOptionAction";
                        var PARENT_MODEL = "model";
                        var temp_for_added_options = {};
                        //TODO : move to utility
                        function camelToDash(str) {
                            if (!str) return '';

                            return str.replace(/\W+/g, '-')
                                      .replace(/([a-z\d])([A-Z])/g, '$1-$2');
                        }
                        var removeDot = function (str) {
                            if (!str) return '';
                            return str.split('.').join('_');
                        }
                        var getModelName = function (str) {
                            if (!str) return '';

                            var temp = str.split('.');
                            return temp[temp.length - 1];
                        },
                        getFormId = function () {
                            return element.closest('form').attr('id') || '';
                        }

                        var defult_config = {
                            plugins: {
                                'remove_button': {
                                    label: ''
                                }
                            },
                            maxItems: 1,
                            valueField: '',
                            labelField: '',
                            searchField: '',
                            placeholder: null,
                            create: false,
                            onOptionAdd: function () { },
                            onInitialize: function (element) {

                            }
                        }

                        var i18nPath = attrs.i18nPath || 'common',
                            value = attrs.value,
                            customClass = attrs.class || '',
                            formId = getFormId(),
                            model = [PARENT_MODEL, attrs.ngModel].join('.'),
                            instance_id = 'selectize_config',
                            config = instance_id,
                            modelId = _.uniqueId(removeDot(model)),
                            position = '',
                            valueFieldname = "",
                            optionsPath = attrs.optionsPath || "Result.Items",
                            labelFieldname = "",
                            modelName = getModelName(model),
                            i18n_name = [i18nPath, modelName].join('.'),
                            required = '',
                        haveCharCount = ('maxlength' in attrs) ? 'char-counter' : '',
                        template = '',
                        $id_debugger = (share_module_config.show_$id) ? "inside row{{$id}}" : '';
                        $scope.modelId = modelId;
                        $scope.disable = true;

                        //#endregion

                        //#region config

                        locale.ready(i18nPath).then(function () {
                            $scope[instance_id].placeholder = locale.getString(i18n_name, {});
                        });
                        $scope[instance_id] = _.extend($scope[instance_id] || {}, defult_config);
                        if (attrs.action.indexOf('.') == -1) {
                            $scope[modelName] = $scope.$parent[attrs.action];
                        }
                        else {
                            var actionPath = attrs.action.split('.');

                            $scope.optionsAction =
                                $scope.$root.$$$api[actionPath[0]][actionPath[1]]
                                    .$init();
                            $scope.$root.$$$api[actionPath[0]][actionPath[1]]
                                .$promise
                                .then(function () {
                                    $scope.disable = false;
                                }, $scope.$id)
                            //.$update($scope.$parent.$parent.model);

                            //#region find required properties for invoke action

                            var required_properties_path = _.filter(_.report($scope.optionsAction.$$schema), function (item) {
                                return item.path.indexOf('required') > 1;
                            })
                            if (actionPath[1] == "CitiesOfProvince") debugger;
                            var required_properties = _.map(required_properties_path, function (item) {
                                var path = item.path.split('.');
                                path.pop();

                                console.log($scope)
                                if ($scope.optionsAction.$$schema[path] && $scope.optionsAction.$$schema[path].source)
                                    path.unshift($scope.optionsAction.$$schema[path].source);
                                path.unshift(PARENT_MODEL);

                                return path.join('.');
                            });
                            if (required_properties.length > 0) {
                                $scope.$watchGroup(required_properties, function (new_value) {
                                    var undefined_field = _.filter(new_value, function (i) { return _.is.undefined(i) });
                                    var empty_field = _.filter(new_value, function (i) { return !i || i.length === 0 });
                                    if (empty_field.length === 0 && undefined_field.length === 0) {

                                        debugger;
                                        _.each(required_properties, function (item, idx) {
                                            var lastPartOfPath = item.split('.').pop();
                                                debugger
                                            if ($scope.optionsAction.$$schema[lastPartOfPath] && $scope.optionsAction.$$schema[lastPartOfPath].source) {
                                                var source = $scope.optionsAction.$$schema[lastPartOfPath].source;
                                                var newPath = item.substr(6);
                                                newPath = newPath.substr(source.length + 1);
                                                _.setValue($scope.optionsAction, new_value[idx], newPath);
                                            } else {
                                                _.setValue($scope.optionsAction, new_value[idx], item.substr(6));
                                            }


                                        });

                                        $scope.optionsAction.$invoke();
                                    }
                                    else {
                                        var $selectize = $("#" + modelId)[0];
                                        $selectize && $selectize.selectize && $selectize.selectize.clear();
                                        $scope.disable = true;
                                    }
                                });
                            } else {
                                $scope.optionsAction.$invoke();
                                $scope.disable = false;
                            }

                            //#endregion
                        }


                        //#region set config.required

                        var parnet_actionPath = $scope.$parent.actionPath;
                        var formActionSchema = $scope.$$$api[parnet_actionPath.controllerName][parnet_actionPath.actionName].$$instance.$$schema;
                        required =
                            ((attrs.ngModel in formActionSchema)
                                && ("required" in formActionSchema[attrs.ngModel])
                                && formActionSchema[attrs.ngModel].required === true)
                                    ? ' required '
                                    : '';

                        //#endregion

                        var configurable_attribute = ['maxItems', 'valueField', 'searchFiled', 'labelField', 'create'];
                        _.each(configurable_attribute, function (key) {
                            if (!(key in attrs)) return;
                            $scope[instance_id][key] = attrs[key];
                        });

                        //use value field for search if search field not defined
                        if (attrs.labelField && !attrs.searchField)
                            $scope[instance_id].searchField = attrs.labelField;
                        if ($scope[instance_id].create)
                            position = "bottom";
                        //#endregion

                        valueFieldname = $scope[instance_id].valueField;
                        labelFieldname = $scope[instance_id].labelField;

                        //#region add action for opOptionAdd callback config

                        if (ADD_OPTION_ACTION_ATTR in attrs) {
                            var actionPath = attrs[ADD_OPTION_ACTION_ATTR].split('.');
                            $scope[ADD_OPTION_ACTION_ATTR] = $scope.$root.$$$api[actionPath[0]][actionPath[1]].$init();

                            $scope[instance_id].onOptionAdd = function (value, valueObject) {
                                if (valueObject[valueFieldname] != valueObject[labelFieldname]
                                    || value in temp_for_added_options) return;

                                temp_for_added_options[value] = true;
                                //TODO : if this action model and scope.model have same property data be destroyed
                                $scope[ADD_OPTION_ACTION_ATTR].$update($scope.model);
                                $scope[ADD_OPTION_ACTION_ATTR][labelFieldname] = value;
                                $scope[ADD_OPTION_ACTION_ATTR]
                                    .$promise
                                    .then(function (resp) {
                                        var $selectize = $("#" + modelId)[0]
                                        valueObject[valueFieldname] = resp.Result[valueFieldname];
                                        $selectize.selectize.updateOption(value, valueObject);
                                        $selectize.selectize.setValue(resp.Result[valueFieldname]);
                                    });
                                $scope[ADD_OPTION_ACTION_ATTR].$invoke();
                            }
                        }

                        //#endregion

                        //#region build template

                        var template =
                              '<div class="parsley-row uk-margin-medium-bottom">\
                               '+ $id_debugger + '\
                               <label class="uk-form-label uk-text-muted uk-text-small" data-i18n="' + i18n_name + '"></label>\
                               <input selectize id="' + modelId + '" \
                               '+ required + '\
                                ng-disabled="disable"    \
                                config="'+ config + '" \
                                position="' + position + '" \
                                options="' + "optionsAction." + optionsPath + '" \
                                ng-model="'+ model + '" /> \
                           </div>'

                        //#endregion

                        //#region add and compile template

                        var tempTemplateDom = document.createElement('div');
                        tempTemplateDom.innerHTML = template;
                        var templateDom = tempTemplateDom.querySelector('div') || tempTemplateDom.querySelector('span') || tempTemplateDom.querySelector('button');
                        element.replaceWith(templateDom)
                        $compile(templateDom)($scope);

                        //#endregion
                    }],
                    compile: function CompilingFunction($templateElement, $templateAttributes) {
                        //if (share_module_config.debug_mode) {
                        //    console.log('select compile')
                        //}

                        //$templateElement.replaceWith(this.template);
                        return {
                            pre: function ($scope, element, attrs) {
                                //if (share_module_config.debug_mode) {
                                //    console.log('select pre')
                                //}
                            },
                            post: function ($scope, element, attrs, ctrls) {
                                //if (share_module_config.debug_mode) {
                                //    console.log('select post')
                                //}
                            }
                        }
                    },
                };

                return directive;
            }]);