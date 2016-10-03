var _templateDom = '';
angular
    .module('share')
        .directive('shInput',
            ['$compile', 'locale', function ($compile, locale) {
                var select_config = {
                    //plugins: {
                    //    'remove_button': {
                    //        label: ''
                    //    }
                    //},
                    maxItems: 1,
                    valueField: 'origin',
                    labelField: 'locale',
                    //searchField: '',
                    placeholder: null,
                    create: false
                }

                var directive = {
                    restrict: 'AE',
                    priority: 999,
                    replace: true,
                    scope: true,
                    require: ['^?ngModel', '^?shForm'],
                    controller: ['$scope', '$element', '$attrs', '$compile', 'share_module_config', '_',
                        function ($scope, element, attrs, $compile, share_module_config, _) {
                            'use strict';

                            //#region define variable and abstract methods

                            //TODO : move to utility
                            if (share_module_config.debug_mode) {
                                console.log('input ctrl', $scope.$id)
                            }
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
                            };
                            var map_type_to_html_type = function (type) {
                                var typesMap = {
                                    "select": "select",
                                    "mask": "text",
                                    "number": "number",
                                    "email": "email",
                                    "string": "text",
                                    "boolean": "radio"
                                }
                                var temp = '';
                                _.each(typesMap, function (value, key) {
                                    if (key.indexOf(type.toLowerCase()) > -1) {
                                        temp = value;
                                    }
                                });
                                return (temp == '') ? type : temp;
                            }
                            var map_by_name = function (name) {
                                var res,
                                typesMap = {
                                    "email": "email",
                                }
                                _.each(typesMap, function (value, key) {
                                    if (name.toLowerCase().indexOf(key) > -1) { res = value };
                                });

                                return res;
                            }
                            var get_type = function () {
                                var res;
                                var parnet_actionPath = $scope.actionPath;
                                var formActionSchema = $$$api[parnet_actionPath.controllerName][parnet_actionPath.actionName].$$instance.$$schema;

                                /*  when the input has ngModel the priority of types is equal
                                *   1. dom type attribute
                                *   2. schema input-type
                                *   3. schema type
                                *       if don't set schema type we use Default 'text' type
                                *
                                *   the priority of types is equal when the input is button
                                *   1. attribute type
                                *   
                                */
                                if ("ngModel" in attrs) {
                                    var item_schema = _.getValue(formActionSchema, attrs.ngModel);

                                    if ("type" in attrs) {
                                        $scope.primaryType = attrs.type;
                                        res = map_type_to_html_type(attrs.type);
                                    }
                                    else if (item_schema && "inputType" in item_schema) {
                                        $scope.primaryType = item_schema["inputType"];
                                        res = map_type_to_html_type(item_schema["inputType"]);
                                    }
                                    else if (item_schema && "type" in item_schema) {
                                        $scope.primaryType = item_schema["type"];
                                        res = map_type_to_html_type(item_schema["type"]);
                                    } else {
                                        var mapped = map_by_name(attrs.ngModel);
                                        $scope.primaryType = mapped || 'text';
                                        res = mapped || "text";
                                    }
                                } else {
                                    res = (attrs.type) ? attrs.type : "button";
                                }

                                return res;
                            },
                            getFormId = function () {
                                return element.closest('form').attr('id') || '';
                            },
                            get_i18n = function () {
                                var res = "";
                                var key = "";
                                if (attrs.ngModel) {
                                    key = attrs.ngModel.split('.').pop();
                                } else if (attrs.i18n) {
                                    key = attrs.i18n;
                                } else if (attrs.type) {
                                    key = attrs.type;
                                }

                                res = [i18nPath, key].join('.');
                                return res;
                            };
                            var getModel = function () {
                                var container = (attrs.model) ? attrs.model : "model";
                                return [container, attrs.ngModel].join('.');
                            }

                            var i18nPath = attrs.i18nPath || 'common',
                                value = attrs.value,
                                customClass = attrs.class || '',
                                type = get_type(),
                                formId = getFormId(),
                                model = getModel(),
                                modelId = removeDot(model),
                                modelName = getModelName(model),
                                i18n_name = get_i18n(),
                                template = '',
                                $id_debugger = (share_module_config.show_$id) ? "sh_input directive : {{$id}}" : '';

                            var parnet_actionPath = $scope.actionPath,
                                formActionSchema = $$$api[parnet_actionPath.controllerName][parnet_actionPath.actionName].$$instance.$$schema;
                            if (attrs.ngModel)
                                $scope.item_schema = _.getValue(formActionSchema, attrs.ngModel);
                            //#endregion

                            //#region config from directive attribute and model schema

                            var configurableAttrs = { 'required': { schema: 'required' }, 'readonly': { schema: 'readonly' }, 'min': { schema: 'min' }, 'max': { schema: 'max' }, 'maxlength': { schema: 'maxLength' }, 'minlength': { schema: 'minLength' }, 'parsleyPattern': { schema: 'pattern', dataAttr: true }, 'inputmask': { schema: 'inputmask', dataAttr: true }, 'inputmaskShowmaskonhover': { schema: 'inputmaskShowmaskonhover', dataAttr: true } },
                                configurableAttrsResult = '';

                            //#region setting that read from directive attribiute

                            for (var key in configurableAttrs) {
                                var dataAttr = (element.attr('data-' + camelToDash(key)) != undefined) ? 'data-' : '';
                                configurableAttrs[key] =
                                    (key in attrs)
                                        ? dataAttr + camelToDash(key) + ((attrs[key] == "") ? "" : '="' + attrs[key] + '"')
                                        : configurableAttrs[key];
                            }

                            //#endregion

                            //#region setting that read from action schema

                            for (var key in configurableAttrs) {
                                if (!("ngModel" in attrs)) continue;
                                if (_.is.not.object(configurableAttrs[key])) continue;
                                if (!("schema" in configurableAttrs[key])) continue;
                                var model_schema = _.getValue(formActionSchema, attrs.ngModel);
                                if (!model_schema) continue;

                                var dataAttr = (configurableAttrs[key].dataAttr) ? 'data-' : '';
                                //if (key == 'inputmask' && configurableAttrs[key].schema in model_schema) debugger

                                //remove 'readonly from schema if that value is equal false'
                                if (model_schema.readonly === false) {
                                    delete model_schema.readonly;
                                }

                                configurableAttrs[key] = (configurableAttrs[key].schema in model_schema)
                                    ? dataAttr + camelToDash(key) + '=' + model_schema[configurableAttrs[key].schema]
                                    : configurableAttrs[key]
                            }

                            if ($scope.readonly)
                                configurableAttrs.readonly = " readonly=true ";

                            //#endregion

                            for (var key in configurableAttrs)
                                configurableAttrsResult += (_.is.object(configurableAttrs[key])) ? " " : configurableAttrs[key] + " ";

                            var haveCharCount = (_.is.object(configurableAttrs.maxlength) && _.is.object(configurableAttrs.minlength)) ? '' : 'char-counter';

                            //#endregion

                            //#region build template according to type
                            $scope.optionsAction = {
                                Result: ["ss"]
                            }
                            if (type == 'select') {
                                $scope.select_config = select_config;
                                locale.ready(i18nPath).then((function (item_schema, modelId, i18nPath) {
                                    return function () {
                                        $scope.options = $scope.options || {};
                                        $scope.options[modelId] = _.map(item_schema.options, function (item) {
                                            return {
                                                origin: item,
                                                locale: locale.getString([i18nPath, item].join('.'), {}),
                                            }
                                        });
                                    }
                                })($scope.item_schema, modelId, i18nPath));
                                template =
                                    '<div class="parsley-row uk-margin-medium-bottom">\
                                    '+ $id_debugger + '\
                                    <label class="uk-form-label uk-text-muted uk-text-small" data-i18n="' + i18n_name + '"></label>\
                                    <input selectize id="' + modelId + '" \
                                    ' + configurableAttrsResult + '\
                                    config="select_config" \
                                    position="bottom" \
                                    ng-disabled="disable"    \
                                    options="' + "options." + modelId + '" \
                                    ng-model="'+ model + '" /> \
                                </div>';
                            } else if (type == 'textarea') {
                                template =
                                    '<div class="parsley-row ' + ((haveCharCount == '') ? 'uk-margin-medium-bottom' : '') + '">\
                                    '+ $id_debugger + '\
                                        <label for="' + modelId + '" data-i18n="' + i18n_name + '"></label>\
                                        <textarea rows="4" cols="3" ng-model="' + model + '"' + configurableAttrsResult + ' ' + haveCharCount + ' class="md-input" id="' + modelId + 'Field" name="' + modelId + '" md-input />\
                                    </div>';

                            } else if (type == "reset") {
                                var className = ("full" in attrs)
                                    ? "md-btn md-btn-flat md-btn-mini md-btn-wave waves-effect waves-button " + customClass
                                    : "md-btn md-btn-flat md-btn-flat-primary md-btn-wave waves-effect waves-button " + customClass;
                                template = '<button type="reset" class="' + className + '"\
                                    id="' + formId + '-cancel"\
                                    data-i18n=\"' + i18n_name + '\" ></button>';
                            } else if (type == "cancel") {
                                var className = ("full" in attrs)
                                    ? " uk-modal-close md-btn md-btn-flat md-btn-mini md-btn-wave waves-effect waves-button " + customClass
                                    : " uk-modal-close md-btn md-btn-flat md-btn-flat-primary md-btn-wave waves-effect waves-button " + customClass;
                                template = '<button type="button" class="' + className + '"\
                                    id="' + formId + '-cancel"\
                                    data-i18n=\"' + i18n_name + '\" ></button>';
                            } else if (type == "submit") {
                                var className = ("full" in attrs)
                                    ? "md-btn md-btn-primary md-btn-block md-btn-wave-light waves-effect waves-button waves-light " + customClass
                                    : "md-btn md-btn-primary  md-btn-wave-light waves-effect waves-button waves-light ng-scope uk-float-left " + customClass;

                                template = '<button type="submit" class="' + className + '"\
                                    id="' + formId + '-submit"\
                                    data-i18n=\"' + i18n_name + '\" ></button>';
                            } else if (type == "radio") {
                                template = '<span class="icheck-inline">\
                                        <input type="radio" name="'+ modelId + '" id="' + modelId + '" icheck ng-model="' + model + '" value="' + value + '" />\
                                        <label for="' + modelId + '" class="inline-label uk-badge ' + customClass + '" data-i18n="' + i18n_name + ':' + value + '"></label>\
                                    </span>';

                            } else {
                                template =
                                    '<div class="parsley-row ' + ((haveCharCount == '') ? 'uk-margin-medium-bottom' : '') + '">\
                                '+ $id_debugger + '\
                                <label for="' + modelId + '" data-i18n="' + i18n_name + '"></label>\
                                <input ng-model="' + model + '" type="' + type + '"' + configurableAttrsResult + ' ' + haveCharCount + ' class="md-input" id="' + modelId + 'Field" name="' + modelId + '" md-input />\
                            </div>'
                            }

                            //#endregion

                            //#region add and compile template
                            locale.ready(attrs.i18nPath || 'common').then(function () {
                                var tempTemplateDom = document.createElement('div');
                                tempTemplateDom.innerHTML = template;
                                var templateDom = tempTemplateDom.querySelector('div') || tempTemplateDom.querySelector('span') || tempTemplateDom.querySelector('button');
                                element.replaceWith(templateDom)
                                _templateDom = templateDom;

                                $compile(_templateDom)($scope);
                                if ($scope.primaryType == 'mask') {
                                    angular.element(templateDom).find('input').inputmask();
                                    angular.element(templateDom).find('input').addClass('masked_input');
                                }
                            });
                            //#endregion

                            if (share_module_config.debug_mode) {
                                $scope[modelId] = modelId;
                            }
                        }],
                    compile: function CompilingFunction($templateElement, $templateAttributes) {
                        //if (share_module_config.debug_mode) {
                        //    console.log('input compile')
                        //}
                        return {
                            pre: function ($scope, element, attrs) {
                                //if (share_module_config.debug_mode) {
                                //    console.log('input pre', $scope.$id)
                                //}
                            },
                            post: function ($scope, element, attrs, ctrls) {
                                //if (share_module_config.debug_mode) {
                                //    console.log('input post', $scope.$id)
                                //}
                            }
                        }
                    },
                };

                return directive;
            }]);