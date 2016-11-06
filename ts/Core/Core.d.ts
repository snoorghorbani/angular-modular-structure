declare module Core {
    class Angular implements ICore.IAngular {
        module(name: string): Module;
    }
    class Module implements ICore.IModule {
        constructor(name: string);
        name: string;
        controller: ICore.IController;
        run: ICore.IRun;
    }
}
