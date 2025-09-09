/**
 * This module provides utility functions for creating tokens, defining consumers,
 * and building dependency injection containers and managers.
 */
import { produce } from "immer";
import {
  DIContainerBuilder,
  DIContainerState,
  DIManager,
  DIManagerState,
  DIToken,
  DIConsumer,
  DIConsumerFactoryParams,
  DIContainer,
  DIConsumerDependencies,
  DIConsumerParams,
} from "./types";

/**
 * Creates a Dependency Injection (DI) token.
 * Tokens are unique symbols used to identify dependencies in the DI container carrying a type for casting purposes.
 *
 * @param desc - A description for the token, useful for debugging.
 * @returns A unique symbol representing the DI token carrying a type for casting purposes.
 */
export function createDIToken<T>(desc: string): DIToken<T> {
  return Symbol(desc) as DIToken<T>;
}

/**
 * Defines a Dependency Injection (DI) consumer.
 * Consumers/Use Cases are function factories that depend on interfaces or other consumers.
 *
 * @param def - An object containing:
 *   - `dependencies`: An array of tokens representing the dependencies.
 *   - `factory`: A function that takes recursively resolved dependencies and returns the consumer function.
 *   - `description`: An optional description for the consumer.
 * @returns A DI consumer object with a unique token.
 */
export function defineDIConsumer<
  const Deps extends DIConsumerDependencies,
  Params extends DIConsumerParams,
  Return = unknown
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

/**
 * Builder of a Dependency Injection (DI) container.
 * The container allows registering and resolving dependencies.
 *
 * @param containerState - The initial state of the container (optional).
 * @returns A DI container builder for registering dependencies and creating a static container.
 */
export function buildContainer(
  containerState: DIContainerState = {}
): DIContainerBuilder {
  const diContainer: DIContainerBuilder = {
    register<T>(token: DIToken<T>, value: T): DIContainerBuilder {
      const newState = produce(containerState, (draft) => {
        draft[token] = value;
        return draft;
      });

      return buildContainer(newState);
    },
    registerConsumer(value): DIContainerBuilder {
      const newState = produce(containerState, (draft) => {
        draft[value.token] = value;
        return draft;
      });

      return buildContainer(newState);
    },
    makeStatic(): DIContainer {
      const diContainer: DIContainer = {
        getState: () => containerState,
        resolve: (
          consumer:
            | DIConsumer<DIConsumerDependencies, DIConsumerParams, unknown>
            | DIToken<unknown>
        ) => {
          if (typeof consumer === "symbol") {
            const token = consumer;

            if (!(token in containerState))
              throw new Error(`Token Symbol(${token.description}) not found`);
            const state = containerState[token];

            if (!(state as DIConsumer).dependencies) {
              return state as () => unknown;
            }

            return (state as DIConsumer).factory(
              ...(state as DIConsumer).dependencies.map(
                (dep: DIToken<unknown>) => diContainer.resolve(dep)
              )
            );
          } else {
            return consumer.factory(
              ...consumer.dependencies.map((dep: DIToken<unknown>) =>
                diContainer.resolve(dep)
              )
            );
          }
        },
      };

      return diContainer;
    },
  };

  return diContainer;
}

/**
 * Builds a Dependency Injection (DI) manager.
 * The manager allows managing multiple containers and switching between them.
 *
 * @param containerManagerState - The initial state of the manager (optional).
 * @returns A DI manager for managing containers and their states.
 */
export function buildManager(
  containerManagerState: DIManagerState = {
    containers: {},
    currentContainer: "default",
  }
): DIManager {
  const { containers, currentContainer } = containerManagerState;

  const diManager: DIManager = {
    getContainer(key: string | undefined) {
      if (!containers[key ?? currentContainer])
        throw new Error("Container not found");
      return buildContainer(containers[key ?? currentContainer]).makeStatic();
    },
    registerContainer(container, key: string = "default") {
      if (containers[key]) throw new Error(`Container ${key} already exists`);
      const newContainersState = produce(containers, (draft) => {
        draft[key] = container.getState();
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
