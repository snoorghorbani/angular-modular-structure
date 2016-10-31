(function () {
    angular
        .module('app')
            .directive('fields', ['$compile', '$templateRequest', '_', function ($compile, $templateRequest, _) {
                var controller = ['$scope', '$element', '$attrs', '$compile', 'share_module_config', "_",
                        function ($scope, element, attrs, $compile, share_module_config, _) {
                            var that = this;
                            this.element = element;

                            var build_template = function (dataIterator) {
                                var res = '';
                                var fileds = dataIterator.get_row();

                                res += '<form sh-form="request.ConfirmRequest" data-model="dataModel">';

                                correct_schema(dataIterator);
                                var arrayLikeModel = [];
                                call_on_schema_item(dataIterator.schema, function (item, key, path) {
                                    if (item.Hidden) return;
                                    if (item.Readonly) return;
                                    var template;
                                    var type = item.type;
                                    debugger
                                    if (item.type == 'uploader') {
                                        template = '<ams:uploader></ams:uploader>';
                                    } else {
                                        template = '<sh:input type=' + type + ' ng-model="' + path + '" data-i18n-path="common" />'
                                    }


                                    arrayLikeModel.push({
                                        name: key,
                                        data: item,
                                        //template: '<sh:input type=' + item.type + ' ng-model="' + key + '" data-i18n-path="common" />'
                                        template: template
                                    });
                                });

                                _.array.sort(arrayLikeModel, 'data.order');

                                res += in_grid(arrayLikeModel);

                                res += '<sh:input type="submit" data-i18n="approve request" />';
                                //res += '<sh:input type="cancel"  class="_disabled"  data-i18n="reject request" ng-click="rejectRequest()"/>';

                                res += '<button type="button" class="uk-modal-close md-btn md-btn-flat md-btn-flat-primary md-btn-wave waves-effect waves-button" ng-click="rejectRequest()" data-i18n="common.reject request"></button>';
                                res += '<button type="button" class="uk-modal-close md-btn md-btn-flat md-btn-flat-primary md-btn-wave waves-effect waves-button" ng-click="addNoteToRequest()" data-i18n="common.submit note"></button>';
                                res += '<button type="button" class="uk-modal-close md-btn md-btn-flat md-btn-flat-primary md-btn-wave waves-effect waves-button" ng-click="attach_file()" data-i18n="common.attach"></button>';
                                //res += "<div sn-open-modal data-modal-id='test'></div>";
                                res += "<div id='test'></div>";
                                res += '</form>';

                                return res;
                            }
                            var compile_view = function (response) {
                                //set action schema from respose
                                shape_schema_item(response.Result.RequestFields, function (item) {
                                    _.each(item, function (value, key) {
                                        item[(key[0].toLowerCase() + key.substr(1, key.lenght))] = value;
                                        //delete item[key];
                                        //delete item.ExtensionData;
                                    });
                                });


                                //var res = shape_schema_item(response.Result.RequestFields, function (item, key) {
                                //    item.Readonly = false;
                                //    item.readonly = false;
                                //    item.Hidden = false;
                                //    item.hidden = false;
                                //    return item;
                                //})
                                var res = shape_schema_item(response.Result.RequestFields, function (item, key) {
                                    if (_.is.string(item.value) && item.value.search(/\/[Date()]+\d+[)]+\//) > -1) {
                                        item.type = 'date';
                                        return item;
                                    }

                                    if (_.is.string(item.value) && item.value.search(/\d+/) > -1) {
                                        item.type = 'number';
                                        return item;
                                    }
                                    if (key.toLowerCase() == "newnote") {
                                        item.type = 'textarea';
                                        item.width = 1;
                                        return item;
                                    }

                                    if (_.is.array(item.Options)) {
                                        item.type = 'select';
                                        item.options = item.Options;
                                        return item;
                                    }

                                    if (key.toLowerCase() == "newattachments") {
                                        item.type = 'uploader';
                                        item.width = 1;
                                        return item;
                                    }

                                    item.type = "string";


                                    if (_.is.string(item.value) && item.value.search(/\d+/) > -1) {
                                        item.value = item.Value = parseInt(item.value);
                                        return item;
                                    }

                                    return item;
                                })

                                //convert response data to directive structure
                                //var data = $scope.data = convertFielsdToArray(response.model);
                                //create iterator for manipulate and traverse on data
                                var iterator = new fields_iterator(response.Result);

                                $$$api.request.FieldsOfRequest.$$instance.__proto__.options.schema = response.Result.RequestFields;
                                $$$api.request.FieldsOfRequest.$$instance.__proto__.$$schema = response.Result.RequestFields;


                                $$$api.request.FieldsOfRequest.$$instance.$$$$deform_with_getter(iterator.model, response.Result.RequestFields);
                                _.update(iterator.model, $$$api.request.FieldsOfRequest.$$instance);
                                //use iterator and create template according to data 
                                var template = build_template(iterator);

                                $scope.dataModel = iterator.model;

                                //#region compile html with scope
                                template = angular.element(template);
                                that.element.empty();
                                that.element.append(template);
                                debugger
                                $compile(template)($scope);

                                //#endregion


                                //$scope.$root.$broadcast('uodate_flow_fields', response);
                                $scope.$root.$broadcast('update_list_according_fields');

                                //$scope.$root.$broadcast('update_list_according_fields', shape_to_list_model(iterator));
                            }

                            //#region inernal methods

                            var get_ordered_model = function (dataIterator) {
                                //zz = _.sortBy(dataIterator.schema, 'number', 'data.order');
                            };
                            var correct_schema = function (dataIterator) {
                                call_on_schema_item(dataIterator.schema, function (schemaItem, name) {
                                    schemaItem.order = schemaItem.order || 10000;
                                });
                            }
                            var convertFielsdToArray = function (fieldsObject) {
                                var res = [];
                                for (var i in fieldsObject) {
                                    var item = fieldsObject[i];
                                    item.name = i;
                                    res.push(item);
                                }
                                return res;
                            }
                            var get_model = function (schema) {
                                var property_model = function () {
                                    this.name = '';
                                    this.default = '';
                                    //this.type = "string";
                                    this.required = false;
                                }
                                var isModelItemType = function (obj) {
                                    var result = false;

                                    return !isObjectType(obj) && _.is.not.array(obj);
                                }
                                var isObjectType = function (obj) {
                                    var result = false;

                                    if (_.is.object(obj))
                                        //for (var i in obj)
                                        if (!('Default' in obj) && !('Value' in obj))
                                            result = true;

                                    return result;
                                }
                                var interperate = function (schema, name) {
                                    var res = {};

                                    if (isModelItemType(schema)) {
                                        return res = schema.value || schema.default || schema.Value || schema.Default || "";
                                    }
                                    if (_.is.array(schema)) {
                                        var sample = schema[0] || new property_model;
                                        res = [];
                                        res.push(interperate(sample, name));
                                        return res;
                                    }
                                    for (var k in schema) {
                                        if (k == "ExtensionData") continue;

                                        res[k] = interperate(schema[k], k);
                                    }

                                    return res;
                                }

                                return model = interperate(schema);
                            }
                            var fields_iterator = function (data) {
                                this.model = get_model(data.RequestFields)
                                this.schema = data.RequestFields;
                                this.isFinished = false;
                                this.get_row = function () { }
                                //this.get_schema_items_strunture = function () {
                                //    var res = call_on_schema_item(this.schema, function (item) {
                                //        return this
                                //    })
                                //}
                            };
                            var shape_schema_item = function (schema, fn) {

                                var isModelItemType = function (obj) {
                                    var result = false;

                                    return !isObjectType(obj) && _.is.not.array(obj);
                                }
                                var isObjectType = function (obj) {
                                    var result = false;

                                    if (_.is.object(obj))
                                        //for (var i in obj)
                                        if (!('Default' in obj) && !('Value' in obj))
                                            result = true;

                                    return result;
                                }
                                var interperate = function (schema, name) {
                                    var res = {};

                                    if (isModelItemType(schema)) {
                                        return res = fn(schema, name);
                                    }
                                    if (_.is.array(schema)) {
                                        var sample = schema[0] || new property_model;
                                        res = [];
                                        res.push(interperate(sample, name));
                                        return res;
                                    }
                                    for (var k in schema) {
                                        res[k] = interperate(schema[k], k);
                                    }

                                    return res;
                                }

                                return interperate(schema);
                            }
                            var call_on_schema_item = function (schema, fn) {

                                var isModelItemType = function (obj) {
                                    var result = false;

                                    return !isObjectType(obj) && _.is.not.array(obj);
                                }
                                var isObjectType = function (obj) {
                                    var result = false;

                                    if (_.is.object(obj))
                                        //for (var i in obj)
                                        if (!('Default' in obj) && !('Value' in obj))
                                            result = true;

                                    return result;
                                }
                                var interperate = function (schema, name, path) {
                                    var paths = [];
                                    path = path || "";
                                    if (isModelItemType(schema)) {
                                        return fn(schema, name, path);
                                    }
                                    if (_.is.array(schema)) {
                                        var sample = schema[0] || new property_model;
                                        if (path != "") paths.push(path);
                                        if (name != undefined) paths.push(name);

                                        return interperate(sample, name, paths.join('.'));
                                    }
                                    for (var k in schema) {
                                        paths = [];
                                        if (path != "") paths.push(path);
                                        if (k != undefined) paths.push(k);
                                        interperate(schema[k], k, paths.join('.'));
                                    }
                                }

                                interperate(schema);
                            }
                            var add_row = function (fields, gridPositions) { }
                            var in_grid = function (items) {
                                var res = '';
                                res += '<div class="uk-grid" data-uk-grid-margin>';
                                _.each(items, function (item, idx) {
                                    res += '<div class="uk-width-medium-1-' + (items[idx].data.width || 2) + '">' + items[idx].template + '</div>'
                                });

                                res += '</div>';

                                return res;

                                //return positions
                            }
                            var add_field = function (fieldSchema) { }
                            var shape_to_list_model = function (dataIterator) {
                                String.prototype.endsWith = function (suffix) {
                                    return this.indexOf(suffix, this.length - suffix.length) !== -1;
                                };
                                var get_value = function (item, itemKey) {
                                    var haveCodeOrIdProperty = false;
                                    var res = item;
                                    _.each(item, function (value, key) {
                                        if (key.endsWith('Id') || key.endsWith('Code'))
                                            haveCodeOrIdProperty = key;
                                    });
                                    if (haveCodeOrIdProperty) {
                                        _.each(item, function (value, key) {
                                            if (key != haveCodeOrIdProperty && key != "ExtensionData")
                                                res = value;
                                        });
                                    } else {
                                        _.each(item, function (value, key) {
                                            if (key.toLowerCase() == 'value' || key.toLowerCase() == 'fullname') {
                                                res = value;
                                            }
                                            if (key.toLowerCase() == 'amount') {
                                                res = value;
                                            }
                                        });
                                    }

                                    return res;
                                }
                                var res = {};
                                call_on_schema_item(dataIterator.schema, function (item, key) {
                                    if (item.Hidden) return;
                                    if (!item.Readonly) return;
                                    if (_.is.not.defined(item.value)) return;
                                    if (item.value === "" || item.value === null || item.value === undefined) return;



                                    res[key] = {
                                        name: key,
                                        value: get_value(dataIterator.model[key],key),
                                    };
                                });

                                return res;
                            }

                            //#endregion

                            $$$api.request.FieldsOfRequest.$init(invoke_on_init = true);
                            $$$api.request.FieldsOfRequest
                                .$promise
                                .then(compile_view);
                            debugger
                            $scope.rejectRequest = function () {
                                debugger
                                $scope.$emit('request rejected', $scope.dataModel);
                            };

                            $scope.addNoteToRequest = function () {
                                $scope.$broadcast('save new note')
                            }
                            $scope.attach_file = function () {
                                debugger;
                                //UIkit.modal("#test").show();
                                //$rootScope.secondarySidebarActive = true;
                                $('#sidebar_secondary .uk-tab-grid >li').get(3).click();

                            }

                        }];

                return {
                    restrict: 'EA',
                    priority: 1500,
                    transclude: false,
                    template: '',
                    require: [],
                    scope: {},
                    controller: controller,
                    compile: function CompilingFunction($templateElement, $templateAttributes) {
                        return {
                            pre: function ($scope, element, attrs, ctrls, $transclude) { },
                            post: function ($scope, element, attrs, ctrls, $transclude) { }
                        }
                    }
                }
            }])
    ;

})();
