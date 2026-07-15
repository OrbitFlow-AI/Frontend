// Dashboard route: lists every agent treasury the operator has provisioned, with a Create
// Agent entry point.
"use client";

import { useState } from "react";
import type { AgentStatus } from "@/types/domain";
import { Topbar } from "@/components/layout/Topbar";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { AgentCard } from "@/components/agents/AgentCard";
import { CreateAgentForm } from "@/components/agents/CreateAgentForm";
import { AgentSearchBar } from "@/components/agents/AgentSearchBar";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { useAgentContext } from "@/lib/context/AgentContext";
import { filterAgents } from "@/lib/agents/filterAgents";

export default function DashboardPage() {
  const { agents, transactions, isLoading, error } = useAgentContext();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<AgentStatus | "all">("all");

  const filteredAgents = filterAgents(agents, searchText, statusFilter);
  const agentsById = Object.fromEntries(agents.map((a) => [a.id, a]));

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
          <>
            <AgentSearchBar
              searchText={searchText}
              statusFilter={statusFilter}
              onSearchTextChange={setSearchText}
              onStatusFilterChange={setStatusFilter}
            />
            {filteredAgents.length === 0 ? (
              <p className="text-sm text-muted">No agents match this search.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAgents.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            )}
            <div className="mt-6">
              <RecentActivity transactions={transactions} agentsById={agentsById} />
            </div>
          </>
        )}
      </main>

      <Modal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Agent">
        <CreateAgentForm onCreated={() => setIsCreateOpen(false)} />
      </Modal>
    </>
  );
}
