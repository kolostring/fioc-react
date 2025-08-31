import { produce } from "immer";
import {
  DIContainer,
  DIContainerState,
  DIManager,
  DIManagerState,
  DIToken,
  DIConsumer,
  DIConsumerFactoryParams,
} from "./types";

export function createDIToken<T>(desc: string): DIToken<T> {
  return Symbol(desc) as DIToken<T>;
}

export function defineDIConsumer<
  const Deps extends readonly DIToken<any>[],
  Params extends any[],
  Return = any
>(def: {
  dependencies: Deps;
  factory: (
    ...args: DIConsumerFactoryParams<Deps>
  ) => (...params: Params) => Return;
  description?: string;
}): DIConsumer<Deps, Params, Return> {
  return {
    ...def,
    token: createDIToken<DIConsumer<Deps, Params, Return>>(
      def.description ?? "DIConsumer"
    ),
  };
}

export function buildContainer(
  containerState: DIContainerState = {}
): DIContainer {
  const diContainer: DIContainer = {
    register<T>(token: DIToken<T>, value: T): DIContainer {
      const newState = produce(containerState, (draft) => {
        draft[token] = value;
        return draft;
      });

      return buildContainer(newState);
    },
    registerConsumer(value): DIContainer {
      const newState = produce(containerState, (draft) => {
        draft[value.token] = value;
        return draft;
      });

      return buildContainer(newState);
    },
    resolve(...args: [any, ...any[]]): any {
      if (args.length === 1) {
        const token = args[0];
        if (!(token in containerState))
          throw new Error(`Token Symbol(${token.description}) not found`);
        return containerState[token] as any;
      }

      return args.map((token) => {
        if (!(token in containerState))
          throw new Error(`Token Symbol(${token.description}) not found`);
        return containerState[token];
      });
    },
    resolveConsumer(token: DIToken<DIConsumer<any, any, any>> | DIToken<any>) {
      if (!(token in containerState))
        throw new Error(`Token Symbol(${token.description}) not found`);
      const state = containerState[token] as any;

      if (!state.dependencies) {
        return state;
      }

      return state.factory(
        ...state.dependencies.map((dep: DIToken<any>) =>
          diContainer.resolveConsumer(dep)
        )
      );
    },
    resolveAll(): DIContainerState {
      return containerState;
    },
  };

  return diContainer;
}

export function buildManager(
  containerManagerState: DIManagerState = {
    containers: {},
    currentContainer: "default",
  }
): DIManager {
  const { containers, currentContainer } = containerManagerState;

  const diManager: DIManager = {
    getContainer(key: string | undefined): DIContainer {
      if (!containers[key ?? currentContainer])
        throw new Error("Container not found");
      return buildContainer(containers[key ?? currentContainer]);
    },
    registerContainer(container: DIContainer, key: string = "default") {
      if (containers[key]) throw new Error(`Container ${key} already exists`);
      const newContainersState = produce(containers, (draft) => {
        draft[key] = container.resolveAll();
        return draft;
      });
      return buildManager({ containers: newContainersState, currentContainer });
    },
    setDefaultContainer(key: string) {
      if (!(key in containers)) {
        throw new Error(`Container ${key} not found`);
      }

      return buildManager({ ...containerManagerState, currentContainer: key });
    },
    getState() {
      return containerManagerState;
    },
  };

  return diManager;
}
