module Share {
    export class Controller {
        constructor(Module_Name: string, cn_name: string, params: any[]) {
            angular.module(Module_Name).controller(cn_name, params);
        }
    }
}