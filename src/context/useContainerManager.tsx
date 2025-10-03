/**
 * Hook to handle containers from the Dependency Injection (DI) manager.
 *
 * @returns The DI manager instance for handling containers.
 * @throws An error if the `DependenciesProvider` is not found in the component tree.
 */
import { useContext, useMemo } from "react";
import { DependenciesContext } from "./DependenciesContext";
import { buildDIContainerManager, DIManager } from "@fioc/core";

export function useContainerManager(): DIManager {
  const ctx = useContext(DependenciesContext);
  if (!ctx) throw new Error("Dependencies Provider not found");

  const { managerState, setManagerState } = ctx;

  const diManager: DIManager = useMemo(
    () => ({
      ...buildDIContainerManager(managerState).getResult(),
      setDefaultContainer: (key: string) => {
        const manager = buildDIContainerManager(managerState)
          .getResult()
          .setDefaultContainer(key);
        setManagerState(manager.getState());

        return manager;
      },
    }),
    [managerState, setManagerState]
  );

  return diManager;
}
