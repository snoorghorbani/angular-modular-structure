var ApiGateway;
(function (ApiGateway_1) {
    var ApiGateway = (function () {
        function ApiGateway() {
        }
        return ApiGateway;
    }());
    ApiGateway_1.ApiGateway = ApiGateway;
    var Gateway = (function () {
        function Gateway(module_name, fn) {
            angular.module(module_name).run(["apiGateway", fn]);
        }
        return Gateway;
    }());
    ApiGateway_1.Gateway = Gateway;
})(ApiGateway || (ApiGateway = {}));
