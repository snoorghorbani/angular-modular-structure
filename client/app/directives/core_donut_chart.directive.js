angular
    .module('share')
        .directive('donutChart', ['$compile', '$window', '_', 'locale', function ($compile, $window, _, locale) {
            var counter = 0;
            var ID_PREFIX = "donut_cahrt_"
            var MODEL = 'model';
            var defaultConfig = {
                bindto: '#donut_cahrt_0',
                data: {
                    columns: [
                    ],
                    type: 'donut',
                    onclick: function (d, i) { console.log("onclick", d, i); },
                    onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                    onmouseout: function (d, i) { console.log("onmouseout", d, i); }
                },
                donut: {
                    title: "Iris Petal Width",
                    width: 40
                },
                color: {
                    pattern: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
                },
                legend_show: false
            }

            var controller = function ($scope, element, attrs, $compile, share_module_config, _) {
                var model = attrs.model;

                //#region define scope variables

                $scope.id = element.attr('id');

                //#endregion

                //#region configure form submit action and related properties
                /*
                *   this directive can get action in two model
                *   1. get action path in this pattern                                          => sh-form="controllerName.actionName"
                *   2. get instance of action that build in another parnet like page controller => sh-form="instanceOfAction"
                *   
                *   then i set actionPath property to scope for use with child scope directive to access them to schema
                */
                if (model.indexOf('.') == -1) {
                    $scope[MODEL] = $scope.$parent[model];
                    $scope.actionPath = {
                        controllerName: $scope[MODEL].options.context,
                        actionName: $scope[MODEL].options.actionName
                    };
                }
                else {
                    var actionPath = attrs.model.split('.');
                    $scope.actionPath = {
                        controllerName: actionPath[0],
                        actionName: actionPath[1]
                    };
                    debugger
                    $scope[MODEL] = $scope.$root.$$$api[actionPath[0]][actionPath[1]]();
                }

                //#endregion

                //#region build config

                //var config = _.extend(config, defaultConfig);
                //var defaultConfig 
                $scope.c3Config = defaultConfig;

                //#endregion


            };
            var compiling = function ($templateElement, $templateAttributes) {
                $templateElement[0].id = [ID_PREFIX, counter++].join('');
            };
            var pre = function ($scope, element, attrs, ctrls, $transclude) { };
            var post = function ($scope, element, attrs, ctrls, $transclude) {
                // donut chart
                var c3chart_donut_id = $scope.id;

                locale.ready(attrs.title.split('.')[0]).then(function () {
                });
                $scope.c3Config.bindto = '#' + c3chart_donut_id;
                $scope.c3Config.donut.title = locale.getString(attrs.title, {});
                debugger
                var c3chart_donut = c3.generate($scope.c3Config);
                var c3chart_donut_waypoint = new Waypoint({
                    element: document.getElementById(c3chart_donut_id),
                    handler: function () { },
                    offset: '80%'
                });

                $($window).on('debouncedresize', c3chart_donut.resize());
                $scope.$on('$destroy', function () {
                    $($window).off('debouncedresize', c3chart_donut.resize());
                    c3chart_donut_waypoint.destroy();
                });
                $scope.$watchCollection("$parent.searchAction", function (nv, ov) {
                    if (!nv || nv.$$status == "pending") return;
                    var loadingData = {
                        columns: []
                    };

                    locale.ready('common').then(function () {
                    });
                    _.each(_.spliteAndTrim(attrs.columns), function (item) {
                        var title = locale.getString('common.' + item, {})
                        loadingData.columns.push([title, nv.Result[item]]);
                    });
                    c3chart_donut.load(loadingData);

                    console.log(c3chart_donut_waypoint)
                });
            };


            //#region export directive

            var directive = {
                restrict: 'EA',
                priority: 1500,
                transclude: false,
                replace: true,
                templateUrl: 'public/core_donut_chart.directive.html',
                require: [],
                scope: { config: '=' },
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