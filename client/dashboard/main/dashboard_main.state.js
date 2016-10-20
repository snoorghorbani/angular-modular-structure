/*
 *	view template   :   Resource Management
 */
angular.module('dashboard')
    .config(
        function ($stateProvider, $urlRouterProvider) {
            $stateProvider
				.state("restricted.dashboard.main", {
					url: "/main",
					templateUrl: 'public/dashboard_main.template.html',
					controller: 'dashboard_main.controller',
					resolve: {
						deps: ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load([
                                'lazy_countUp',
                                'lazy_charts_peity',
                                'lazy_charts_easypiechart',
                                'lazy_charts_metricsgraphics',
                                'lazy_charts_chartist',
                                'lazy_weathericons',
                                'lazy_google_maps',
                                'lazy_clndr',
                                'public/dashboard_main.controller.js'
							], { serie: true });
						}],
						sale_chart_data: function($http){
                            return $http({method: 'GET', url: 'public/data/mg_dashboard_chart.min.json'})
                                .then(function (data) {
                                    return data.data;
                                });
                        },
                        user_data: function($http){
                            return $http({ method: 'GET', url: 'public/data/user_data.json' })
                                .then(function (data) {
                                    return data.data;
                                });
                        }
					},
					data: {
					    pageTitle: 'dashboard main',
					    roles: []
					}

				})
			})
;