import { useContext, useMemo } from "react";
import { DependenciesContext } from "./DependenciesContext";
import { buildManager } from "../common/utils";
import { DIManager } from "../common/types";

export default function useDependencies(): DIManager {
  const ctx = useContext(DependenciesContext);
  if (!ctx) throw new Error("Dependencies Provider not found");

  const { managerState, setManagerState } = ctx;

  const diManager: DIManager = useMemo(
    () => ({
      ...buildManager(managerState),
      setDefaultContainer: (key: string) => {
        const manager = buildManager(managerState).setDefaultContainer(key);
        setManagerState(manager.getState());

        return manager;
      },
    }),
    [managerState, setManagerState]
  );

  return diManager;
}
