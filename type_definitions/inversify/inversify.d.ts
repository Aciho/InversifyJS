// Type definitions for inversify 2.0.0-alpha.6
// Project: https://github.com/inversify/InversifyJS
// Definitions by: inversify <https://github.com/inversify>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/// <reference path="../bluebird/bluebird.d.ts" />
/// <reference path="../harmony-proxy/harmony-proxy.d.ts" />

declare namespace inversify {

    export interface IKernelConstructor {
        new(): IKernel;
    }

    interface IMiddleware extends Function {
        (next: (context: IContext) => any): (context: IContext) => any;
    }

    export interface IKernel {
        bind<T>(runtimeIdentifier: string): IBindingToSyntax<T>;
        unbind(runtimeIdentifier: string): void;
        unbindAll(): void;
        get<T>(runtimeIdentifier: string): T;
        getAll<T>(runtimeIdentifier: string): T[];
        load(...modules: IKernelModule[]): void;
        applyMiddleware(...middleware: IMiddleware[]): void;
    }

    export interface IKernelModule extends Function {
        (kernel: IKernel): void;
    }

    interface IBindingToSyntax<T> {
        to(constructor: { new(...args: any[]): T; }): IBindingInWhenOnSyntax<T>;
        toValue(value: T): IBindingInWhenOnSyntax<T>;
        toConstructor<T2>(constructor: INewable<T2>): IBindingInWhenOnSyntax<T>;
        toFactory<T2>(factory: IFactoryCreator<T2>): IBindingInWhenOnSyntax<T>;
        toAutoFactory<T2>(): IBindingInWhenOnSyntax<T>;
        toProvider<T2>(provider: IProviderCreator<T2>): IBindingInWhenOnSyntax<T>;
    }

    interface IBindingInWhenOnSyntax<T> {
        inSingletonScope(): IBindingInWhenOnSyntax<T>;
        when(constraint: (request: IRequest) => boolean): IBindingInWhenOnSyntax<T>;
        whenTargetNamed(name: string): IBindingInWhenOnSyntax<T>;
        whenTargetTagged(tag: string, value: any): IBindingInWhenOnSyntax<T>;
        onActivation(fn: (context: IContext, injectable: T) => T): IBindingInWhenOnSyntax<T>;
    }

    export interface IFactory<T> extends Function {
        (): T;
    }

    interface IFactoryCreator<T> extends Function {
        (context: IContext): IFactory<T>;
    }

    export interface INewable<T> {
        new(...args: any[]): T;
    }

    export interface IProvider<T> extends Function {
        (): Promise<T>;
    }

    interface IProviderCreator<T> extends Function {
        (context: IContext): IProvider<T>;
    }

    export interface IContext {
        kernel: IKernel;
        plan: IPlan;
        addPlan(plan: IPlan): void;
    }

    export interface IPlan {
        parentContext: IContext;
        rootRequest: IRequest;
    }

    export interface IRequest {
        service: string;
        parentContext: IContext;
        parentRequest: IRequest;
        childRequests: IRequest[];
        target: ITarget;
        bindings: IBinding<any>[];
        addChildRequest(
            service: string,
            bindings: (IBinding<any>|IBinding<any>[]),
            target: ITarget): IRequest;
    }

    export interface IBinding<T> {
        runtimeIdentifier: string;
        implementationType: INewable<T>;
        factory: IFactoryCreator<any>;
        provider: IProviderCreator<any>;
        constraint: (request: IRequest) => boolean;
        proxyMaker: (injectable: T) => T;
        cache: T;
        scope: number; // BindingScope
        type: number; // BindingType
    }

    export interface ITarget {
        service: IQueryableString;
        name: IQueryableString;
        metadata: Array<IMetadata>;
        isArray(): boolean;
        isNamed(): boolean;
        isTagged(): boolean;
        matchesName(name: string): boolean;
        matchesTag(name: IMetadata): boolean;
    }

    export interface IQueryableString {
        startsWith(searchString: string): boolean;
        endsWith(searchString: string): boolean;
        contains(searchString: string): boolean;
        equals(compareString: string): boolean;
        value(): string;
    }

    export interface IMetadata {
        key: string;
        value: any;
    }

    export var Kernel: IKernelConstructor;
    export var decorate: any;
    export function injectable(...typeIdentifiers: string[]): (typeConstructor: any) => void;
    export var tagged: any;
    export var named: any;
    export var paramNames: any;
}

declare module "inversify" {
  export = inversify;
}
