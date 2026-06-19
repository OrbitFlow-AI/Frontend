// Single row in a transaction list: counterparties, amount, status, and relative time.
import type { Agent, Transaction } from "@/types/domain";
import { Badge } from "@/components/ui/Badge";
import { formatAmount, formatRelativeTime } from "@/lib/utils/format";

const statusTone: Record<Transaction["status"], "success" | "warning" | "danger"> = {
  settled: "success",
  pending: "warning",
  blocked: "danger",
};

export function TransactionRow({
  transaction,
  agentsById,
}: {
  transaction: Transaction;
  agentsById: Record<string, Agent | undefined>;
}) {
  const fromName = agentsById[transaction.fromAgentId]?.name ?? transaction.fromAgentId;
  const toName = agentsById[transaction.toAgentId]?.name ?? transaction.toAgentId;

  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-0">
      <div>
        <p className="text-sm text-slate-200">
          {fromName} <span className="text-muted">→</span> {toName}
        </p>
        <p className="mt-0.5 text-xs text-muted">
          {transaction.memo} · {formatRelativeTime(transaction.createdAt)}
        </p>
        {transaction.violatedRule ? (
          <p className="mt-0.5 text-xs text-danger">Blocked by rule: {transaction.violatedRule}</p>
        ) : null}
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-slate-100">
          {formatAmount(transaction.amount, transaction.asset)}
        </p>
        <Badge tone={statusTone[transaction.status]} className="mt-1">
          {transaction.status}
        </Badge>
      </div>
    </div>
  );
}
