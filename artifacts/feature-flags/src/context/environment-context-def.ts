// Plain .ts file — no JSX, no components.
// Keeps the context object isolated so EnvironmentContext.tsx and
// useEnvironment.ts can both be pure Fast-Refresh-compatible files.
import { createContext } from "react";
import type { Environment } from "@workspace/api-client-react";

export interface EnvironmentContextType {
  selectedEnvironmentId: number | null;
  setSelectedEnvironmentId: (id: number | null) => void;
  environments: Environment[];
  selectedEnvironment: Environment | null;
  isLoading: boolean;
}

export const EnvironmentContext = createContext<EnvironmentContextType | undefined>(undefined);
