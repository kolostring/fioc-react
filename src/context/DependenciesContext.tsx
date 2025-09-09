/**
 * This module defines the React context for dependency injection.
 * It provides a way to access the container manager throughout the application.
 */
import { createContext } from "react";
import { DIManagerState } from "../common/types";

/**
 * React context for Dependency Injection (DI).
 * Provides access to the DI manager state and a method to update it.
 *
 * @typeParam managerState - The current state of the DI manager.
 * @typeParam setManagerState - A function to update the DI manager state.
 */
export const DependenciesContext = createContext<{
  managerState: DIManagerState;
  setManagerState: (managerState: DIManagerState) => void;
} | null>(null);
