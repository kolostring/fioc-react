import { createContext } from "react";
import { DIManagerState } from "../common/types";

export const DependenciesContext = createContext<{
  managerState: DIManagerState;
  setManagerState: (managerState: DIManagerState) => void;
} | null>(null);
