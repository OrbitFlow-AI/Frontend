// Filter controls for the transaction ledger: by agent and by status.
import type { Agent, TransactionStatus } from "@/types/domain";

const statusOptions: Array<TransactionStatus | "all"> = ["all", "settled", "blocked", "pending"];

export function LedgerFilters({
  agents,
  agentFilter,
  statusFilter,
  onAgentFilterChange,
  onStatusFilterChange,
}: {
  agents: Agent[];
  agentFilter: string;
  statusFilter: TransactionStatus | "all";
  onAgentFilterChange: (value: string) => void;
  onStatusFilterChange: (value: TransactionStatus | "all") => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-3">
      <select
        value={agentFilter}
        onChange={(e) => onAgentFilterChange(e.target.value)}
        className="rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-100"
      >
        <option value="all">All agents</option>
        {agents.map((agent) => (
          <option key={agent.id} value={agent.id}>
            {agent.name}
          </option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value as TransactionStatus | "all")}
        className="rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-100"
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status === "all" ? "All statuses" : status}
          </option>
        ))}
      </select>
    </div>
  );
}
