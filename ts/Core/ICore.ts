module ICore {
    export interface IAngular {
        module(name: string): IModule;
    }
    export interface IModule {
        name: string;
        controller: IController;
        //Service: IService;
        //Config: IConfig;
        run: IRun;
    }
    export interface IRun {
        (params: [string, (fn: ApiGateway.ApiGateway) => void]): this;
    }

    export interface IConfig {

    }
    export interface IController {
        (cnName: string, params: any[]): this;

    }
    export interface IService {

    }
}