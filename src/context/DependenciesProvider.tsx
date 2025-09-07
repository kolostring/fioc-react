import { useMemo, useState } from "react";
import { DIManager } from "../common/types";
import { DependenciesContext } from "./DependenciesContext";

export default function DependenciesProvider({
  children,
  manager,
}: {
  children: React.ReactNode;
  manager: DIManager;
}) {
  const [managerState, setManagerState] = useState(manager.getState());

  const ctxValue = useMemo(
    () => ({
      managerState,
      setManagerState,
    }),
    [managerState]
  );

  return (
    <DependenciesContext.Provider value={ctxValue}>
      {children}
    </DependenciesContext.Provider>
  );
}
