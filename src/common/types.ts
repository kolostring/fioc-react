export type DIToken<T> = symbol & { __type: T };
export type UnwrapToken<T> = T extends DIToken<infer U> ? U : never;

export type DIConsumerDependencies = readonly DIToken<unknown>[];
export type DIConsumerParams = unknown[];

export type DIConsumerFactoryParams<Deps> = {
  [K in keyof Deps]: Deps[K] extends DIToken<infer U>
    ? U extends DIConsumer<infer Deps, infer Params, infer Return>
      ? Deps extends never
        ? never
        : (...args: Params) => Return
      : U
    : never;
};

export type DIConsumer<
  Deps extends DIConsumerDependencies = DIConsumerDependencies,
  Params extends DIConsumerParams = DIConsumerParams,
  Return = unknown
> = {
  token: DIToken<DIConsumer<Deps, Params, Return>>;
  dependencies: Deps;
  factory: (
    ...args: DIConsumerFactoryParams<Deps>
  ) => (...params: Params) => Return;
};

export type DIContainerState = Record<DIToken<unknown>, unknown>;
export type DIManagerState = {
  containers: Record<string, DIContainerState>;
  currentContainer: string;
};

export interface DIContainer {
  resolve<
    Deps extends DIConsumerDependencies,
    Params extends DIConsumerParams,
    Return = unknown
  >(
    consumer: DIConsumer<Deps, Params, Return>
  ): (...params: Params) => Return;
  resolve<T>(token: DIToken<T>): T;
  getState(): DIContainerState;
}

export interface DIContainerBuilder {
  register<T>(token: DIToken<T>, value: T): DIContainerBuilder;
  registerConsumer<
    Deps extends DIConsumerDependencies,
    Params extends DIConsumerParams
  >(
    value: DIConsumer<Deps, Params>
  ): DIContainerBuilder;

  makeStatic(): DIContainer;
}

export interface DIManager {
  getContainer(key?: string): DIContainer;
  registerContainer(container: DIContainer, key?: string): DIManager;
  setDefaultContainer(key: string): DIManager;
  getState(): DIManagerState;
}
