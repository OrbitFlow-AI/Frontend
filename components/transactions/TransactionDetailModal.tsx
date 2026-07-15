// Full detail view for a single transaction: raw ids, timestamps, and the policy rule that
// authorized or blocked it — useful for the compliance/audit reviewer persona in the PRD.
"use client";

import type { Agent, Transaction } from "@/types/domain";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { formatAmount } from "@/lib/utils/format";

const statusTone: Record<Transaction["status"], "success" | "warning" | "danger"> = {
  settled: "success",
  pending: "warning",
  blocked: "danger",
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2 last:border-0">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-sm text-slate-200">{value}</span>
    </div>
  );
}

export function TransactionDetailModal({
  transaction,
  agentsById,
  onClose,
}: {
  transaction: Transaction | null;
  agentsById: Record<string, Agent | undefined>;
  onClose: () => void;
}) {
  if (!transaction) return null;

  return (
    <Modal open={Boolean(transaction)} onClose={onClose} title="Transaction Detail">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-xs text-muted">{transaction.id}</span>
        <Badge tone={statusTone[transaction.status]}>{transaction.status}</Badge>
      </div>
      <DetailRow label="From" value={agentsById[transaction.fromAgentId]?.name ?? transaction.fromAgentId} />
      <DetailRow label="To" value={agentsById[transaction.toAgentId]?.name ?? transaction.toAgentId} />
      <DetailRow label="Amount" value={formatAmount(transaction.amount, transaction.asset)} />
      <DetailRow label="Memo" value={transaction.memo || "—"} />
      <DetailRow label="Created" value={new Date(transaction.createdAt).toLocaleString()} />
      {transaction.violatedRule ? (
        <DetailRow label="Violated rule" value={transaction.violatedRule} />
      ) : null}
    </Modal>
  );
}
