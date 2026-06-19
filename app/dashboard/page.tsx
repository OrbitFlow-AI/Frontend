// Dashboard route: lists every agent treasury the operator has provisioned.
"use client";

import { Topbar } from "@/components/layout/Topbar";
import { AgentCard } from "@/components/agents/AgentCard";
import { useAgentContext } from "@/lib/context/AgentContext";

export default function DashboardPage() {
  const { agents, isLoading, error } = useAgentContext();

  return (
    <>
      <Topbar title="Agent Treasuries" subtitle="Every agent provisioned on this network" />
      <main className="p-6">
        {isLoading ? (
          <p className="text-sm text-muted">Loading agents…</p>
        ) : error ? (
          <p className="text-sm text-danger">{error}</p>
        ) : agents.length === 0 ? (
          <p className="text-sm text-muted">No agents have been provisioned yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
