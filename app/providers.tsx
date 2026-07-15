// Single composition point for all client-side context providers wrapping the app.
"use client";

import { AgentProvider } from "@/lib/context/AgentContext";
import { ToastProvider } from "@/lib/context/ToastContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AgentProvider>{children}</AgentProvider>
    </ToastProvider>
  );
}
