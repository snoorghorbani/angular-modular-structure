var Core;
(function (Core) {
    var Angular = (function () {
        function Angular() {
        }
        Angular.prototype.module = function (name) { return new Module(name); };
        ;
        return Angular;
    }());
    Core.Angular = Angular;
    ;
    var Module = (function () {
        function Module(name) {
            this.controller = Controller;
            this.run = Run;
            this.name = name;
        }
        return Module;
    }());
    Core.Module = Module;
    var Controller = function (cnName, params) {
        return this;
    };
    var Service = (function () {
        function Service() {
        }
        return Service;
    }());
    var Config = (function () {
        function Config() {
        }
        return Config;
    }());
    var Run = function (params) {
        return this;
    };
})(Core || (Core = {}));
