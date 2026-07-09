import React from "react";
import { Sidebar } from "./sidebar";
import { EnvironmentSwitcher } from "./environment-switcher";
import { EnvironmentProvider } from "../../context/EnvironmentContext";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <EnvironmentProvider>
      <div className="flex h-screen overflow-hidden bg-background font-sans text-foreground">
        <Sidebar />
        
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <h1 className="text-sm font-mono font-medium text-muted-foreground hidden sm:block">
                // SYSTEM_ACTIVE
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <EnvironmentSwitcher />
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto bg-background p-6">
            <div className="mx-auto max-w-6xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </EnvironmentProvider>
  );
}
