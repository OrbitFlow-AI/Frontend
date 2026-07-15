// Single row in a transaction list: counterparties, amount, status, and relative time.
// Clicking a row opens its full detail in a modal.
"use client";

import { useState } from "react";
import type { Agent, Transaction } from "@/types/domain";
import { Badge } from "@/components/ui/Badge";
import { TransactionDetailModal } from "@/components/transactions/TransactionDetailModal";
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
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsDetailOpen(true)}
        className="flex w-full items-center justify-between border-b border-border py-3 text-left last:border-0 hover:bg-slate-800/40"
      >
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
      </button>

      {isDetailOpen ? (
        <TransactionDetailModal
          transaction={transaction}
          agentsById={agentsById}
          onClose={() => setIsDetailOpen(false)}
        />
      ) : null}
    </>
  );
}
