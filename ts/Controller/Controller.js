var Share;
(function (Share) {
    var Controller = (function () {
        function Controller(Module_Name, cn_name, params) {
            angular.module(Module_Name).controller(cn_name, params);
        }
        return Controller;
    }());
    Share.Controller = Controller;
})(Share || (Share = {}));
