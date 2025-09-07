export type DIToken<T> = symbol & { __type: T };
export type UnwrapToken<T> = T extends DIToken<infer U> ? U : never;

export type DIConsumerFactoryParams<Deps> = {
  [K in keyof Deps]: Deps[K] extends DIToken<infer U>
    ? U extends DIConsumer<any, any>
      ? ReturnType<U["factory"]>
      : U
    : never;
};

export type DIConsumer<
  Deps extends readonly DIToken<any>[],
  Params extends any[],
  Return = any
> = {
  token: DIToken<DIConsumer<Deps, Params, Return>>;
  dependencies: Deps;
  factory: (
    ...args: DIConsumerFactoryParams<Deps>
  ) => (...params: Params) => Return;
};

export type DIConsumerReturn<T> = T extends DIConsumer<any, any, infer R>
  ? R
  : never;

export type DIContainerState = Record<DIToken<unknown>, unknown>;
export type DIManagerState = {
  containers: Record<string, DIContainerState>;
  currentContainer: string;
};

export interface DIContainer {
  resolve<Deps extends readonly any[], Params extends any[], Return = any>(
    consumer: DIConsumer<Deps, Params, Return>
  ): (...params: Params) => Return;
  resolve<T>(token: DIToken<T>): T;
  getState(): DIContainerState;
}

export interface DIContainerBuilder {
  register<T>(token: DIToken<T>, value: T): DIContainerBuilder;
  registerConsumer(value: DIConsumer<any, any>): DIContainerBuilder;

  makeStatic(): DIContainer;
}

export interface DIManager {
  getContainer(key?: string): DIContainer;
  registerContainer(container: DIContainer, key?: string): DIManager;
  setDefaultContainer(key: string): DIManager;
  getState(): DIManagerState;
}
