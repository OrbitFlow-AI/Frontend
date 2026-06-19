// Ledger route: the full, filterable feed of every micropayment between agents.
"use client";

import { useMemo, useState } from "react";
import type { TransactionStatus } from "@/types/domain";
import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/Card";
import { LedgerFilters } from "@/components/transactions/LedgerFilters";
import { TransactionRow } from "@/components/transactions/TransactionRow";
import { useAgentContext } from "@/lib/context/AgentContext";

export default function LedgerPage() {
  const { agents, transactions, isLoading } = useAgentContext();
  const [agentFilter, setAgentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all">("all");

  const agentsById = useMemo(() => Object.fromEntries(agents.map((a) => [a.id, a])), [agents]);

  const filtered = transactions.filter((tx) => {
    const matchesAgent =
      agentFilter === "all" || tx.fromAgentId === agentFilter || tx.toAgentId === agentFilter;
    const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
    return matchesAgent && matchesStatus;
  });

  return (
    <>
      <Topbar title="Transaction Ledger" subtitle="Every micropayment between agents" />
      <main className="p-6">
        <LedgerFilters
          agents={agents}
          agentFilter={agentFilter}
          statusFilter={statusFilter}
          onAgentFilterChange={setAgentFilter}
          onStatusFilterChange={setStatusFilter}
        />
        <Card>
          {isLoading ? (
            <p className="text-sm text-muted">Loading transactions…</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted">No transactions match these filters.</p>
          ) : (
            filtered.map((tx) => (
              <TransactionRow key={tx.id} transaction={tx} agentsById={agentsById} />
            ))
          )}
        </Card>
      </main>
    </>
  );
}
