// Dashboard route: lists every agent treasury the operator has provisioned, with a Create
// Agent entry point.
"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { AgentCard } from "@/components/agents/AgentCard";
import { CreateAgentForm } from "@/components/agents/CreateAgentForm";
import { useAgentContext } from "@/lib/context/AgentContext";

export default function DashboardPage() {
  const { agents, isLoading, error } = useAgentContext();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <>
      <Topbar
        title="Agent Treasuries"
        subtitle="Every agent provisioned on this network"
        actions={<Button onClick={() => setIsCreateOpen(true)}>Create Agent</Button>}
      />
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

      <Modal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Agent">
        <CreateAgentForm onCreated={() => setIsCreateOpen(false)} />
      </Modal>
    </>
  );
}
