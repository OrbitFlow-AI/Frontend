// Single composition point for all client-side context providers wrapping the app.
"use client";

import { AgentProvider } from "@/lib/context/AgentContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AgentProvider>{children}</AgentProvider>;
}
