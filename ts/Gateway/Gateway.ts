module ApiGateway {
    export class ApiGateway {
        context: (name: string) => this;
        action: (name: string) => this;
        type: (name: string) => this;
        route: (path: string) => this;
        cache: (value: string) => this;
        virtual: (path: string, defultvalue: any) => this;
        schema: (schema: any) => this;
        setter: (path: string, deformer: (value: any) => any) => this;
        getter: (path: string, deformer: (value: any) => any) => this;
        notification: (name: string) => this;
        pause_before_send: () => this;
        requester: (fn : ()=>any) => this;
        done: () => this;
        lazy_model: () => this;

    }
    export class Gateway implements IGateway.IGateway {
        constructor(module_name: string, fn: (fn: ApiGateway, ...services:any[]) => void) {
            angular.module(module_name).run(["apiGateway", fn]);
        }
    }
}