module Core {
    export class Angular implements ICore.IAngular {
        module(name: string): Module { return new Module(name); };


    };
    export class Module implements ICore.IModule {
        constructor(name: string) {
            this.name = name
        }
        name: string;
        controller = Controller;
        //Service = new Service();
        //Config = new Config();
        run = Run;
    }
    let Controller: ICore.IController = function (cnName: string,
        params: any[]) {
        //angular.module(cnName).controller()
        return this;
    }
    //class controller implements ICore.IController { }
    class Service implements ICore.IService { }
    class Config implements ICore.IConfig { }
    let Run: ICore.IRun = function (params: [string,
        (fn: ApiGateway.ApiGateway) => void]) {
        return this;
    }
}