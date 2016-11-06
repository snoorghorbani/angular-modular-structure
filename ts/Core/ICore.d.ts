declare module ICore {
    interface IAngular {
        module(name: string): IModule;
    }
    interface IModule {
        name: string;
        controller: IController;
        run: IRun;
    }
    interface IRun {
        (params: [string, (fn: ApiGateway.ApiGateway) => void]): this;
    }
    interface IConfig {
    }
    interface IController {
        (cnName: string, params: any[]): this;
    }
    interface IService {
    }
}
