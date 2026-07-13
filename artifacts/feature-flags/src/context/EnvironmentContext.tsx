// Component-only file — only exports EnvironmentProvider (a React component).
// Context object lives in ./environment-context-def.ts so Vite Fast Refresh
// can handle this file cleanly.
import React, { useState, useEffect } from "react";
import { useListEnvironments } from "@workspace/api-client-react";
import { EnvironmentContext } from "./environment-context-def";

export function EnvironmentProvider({ children }: { children: React.ReactNode }) {
  const { data: environments = [], isLoading } = useListEnvironments();
  const [selectedEnvironmentId, setSelectedEnvironmentId] = useState<number | null>(null);

  useEffect(() => {
    if (environments.length > 0 && selectedEnvironmentId === null) {
      const defaultEnv = environments.find((e) => e.is_default) || environments[0];
      if (defaultEnv) {
        setSelectedEnvironmentId(defaultEnv.id);
      }
    }
  }, [environments, selectedEnvironmentId]);

  const selectedEnvironment = selectedEnvironmentId
    ? environments.find((e) => e.id === selectedEnvironmentId) || null
    : null;

  return (
    <EnvironmentContext.Provider
      value={{ selectedEnvironmentId, setSelectedEnvironmentId, environments, selectedEnvironment, isLoading }}
    >
      {children}
    </EnvironmentContext.Provider>
  );
}
