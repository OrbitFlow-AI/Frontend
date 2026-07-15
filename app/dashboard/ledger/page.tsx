// Ledger route: the full, filterable feed of every micropayment between agents.
"use client";

import { useMemo, useState } from "react";
import type { TransactionStatus } from "@/types/domain";
import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/Card";
import { LedgerFilters } from "@/components/transactions/LedgerFilters";
import { TransactionRow } from "@/components/transactions/TransactionRow";
import { ExportLedgerButton } from "@/components/transactions/ExportLedgerButton";
import { Pagination } from "@/components/ui/Pagination";
import { useAgentContext } from "@/lib/context/AgentContext";
import { filterTransactions } from "@/lib/transactions/filterTransactions";
import { paginate } from "@/lib/utils/paginate";

const PAGE_SIZE = 10;

export default function LedgerPage() {
  const { agents, transactions, isLoading } = useAgentContext();
  const [agentFilter, setAgentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all">("all");
  const [page, setPage] = useState(1);

  const agentsById = useMemo(() => Object.fromEntries(agents.map((a) => [a.id, a])), [agents]);

  const filtered = filterTransactions(transactions, agentFilter, statusFilter);
  const paginated = paginate(filtered, page, PAGE_SIZE);

  function handleAgentFilterChange(value: string) {
    setAgentFilter(value);
    setPage(1);
  }

  function handleStatusFilterChange(value: TransactionStatus | "all") {
    setStatusFilter(value);
    setPage(1);
  }

  return (
    <>
      <Topbar
        title="Transaction Ledger"
        subtitle="Every micropayment between agents"
        actions={<ExportLedgerButton transactions={filtered} agentsById={agentsById} />}
      />
      <main className="p-6">
        <LedgerFilters
          agents={agents}
          agentFilter={agentFilter}
          statusFilter={statusFilter}
          onAgentFilterChange={handleAgentFilterChange}
          onStatusFilterChange={handleStatusFilterChange}
        />
        <Card>
          {isLoading ? (
            <p className="text-sm text-muted">Loading transactions…</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted">No transactions match these filters.</p>
          ) : (
            paginated.items.map((tx) => (
              <TransactionRow key={tx.id} transaction={tx} agentsById={agentsById} />
            ))
          )}
        </Card>
        {!isLoading && filtered.length > 0 ? (
          <Pagination page={paginated.page} totalPages={paginated.totalPages} onPageChange={setPage} />
        ) : null}
      </main>
    </>
  );
}
