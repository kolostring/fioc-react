/**
 * This module provides the `DependenciesProvider` component.
 * It wraps the application and supplies the container manager to the React context.
 */
import { useMemo, useState } from "react";
import { DIManager } from "fioc";
import { DependenciesContext } from "./DependenciesContext";

/**
 * Provides the Dependency Injection (DI) manager to the React context.
 * Wraps the application and supplies the DI manager to all child components.
 *
 * @param children - The React children components to be wrapped.
 * @param manager - The DI manager instance to provide.
 * @returns A React component that provides the DI manager context.
 */
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
