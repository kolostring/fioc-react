/**
 * Hook to resolve dependencies from the Dependency Injection (DI) manager.
 *
 * @param containerKey The key of the container to resolve dependencies from.
 * @returns The DI Container instance for resolving dependencies.
 * @throws An error if the `DependenciesProvider` is not found in the component tree.
 * @throws An error if the container is not found in the DI manager.
 */
import { useContext } from "react";
import { DependenciesContext } from "./DependenciesContext";
import { buildDIContainer, DIContainer } from "fioc";

export default function useDependencies(containerKey?: string): DIContainer {
  const ctx = useContext(DependenciesContext);
  if (!ctx) throw new Error("Dependencies Provider not found");

  const { managerState } = ctx;

  if (managerState.containers[containerKey ?? "default"] === undefined) {
    throw new Error(`Container ${containerKey ?? "default"} not found`);
  }

  return buildDIContainer(
    managerState.containers[containerKey ?? "default"]
  ).getResult();
}
