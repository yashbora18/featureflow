// Hook-only file — Vite Fast Refresh compatible (no component exports).
import { useContext } from "react";
import { EnvironmentContext } from "./environment-context-def";

export function useEnvironment() {
  const context = useContext(EnvironmentContext);
  if (context === undefined) {
    throw new Error("useEnvironment must be used within an EnvironmentProvider");
  }
  return context;
}
