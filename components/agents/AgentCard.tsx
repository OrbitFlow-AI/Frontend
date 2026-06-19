// Summary card for one agent treasury: balance, budget, network, and status badge.
// Memoized since dashboard grids re-render this for every agent on each context refresh.
import { memo } from "react";
import Link from "next/link";
import type { Agent } from "@/types/domain";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatAmount } from "@/lib/utils/format";

const statusTone: Record<Agent["status"], "success" | "warning" | "danger"> = {
  active: "success",
  paused: "warning",
  over_limit: "danger",
};

const statusLabel: Record<Agent["status"], string> = {
  active: "Active",
  paused: "Paused",
  over_limit: "Over limit",
};

export const AgentCard = memo(function AgentCard({ agent }: { agent: Agent }) {
  const budgetUsedPct = Math.min(100, Math.round(((agent.budget - agent.balance) / agent.budget) * 100));

  return (
    <Link href={`/dashboard/agents/${agent.id}`}>
      <Card className="transition-colors hover:border-primary/60">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-slate-100">{agent.name}</h3>
            <p className="mt-1 text-sm text-muted">{agent.description}</p>
          </div>
          <Badge tone={statusTone[agent.status]}>{statusLabel[agent.status]}</Badge>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xs text-muted">Balance</p>
            <p className="text-lg font-semibold text-slate-100">
              {formatAmount(agent.balance, agent.asset)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted">Budget used</p>
            <p className="text-sm text-slate-300">{budgetUsedPct}%</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-muted">
          <span className="uppercase">{agent.network}</span>
          <span>·</span>
          <span>{agent.walletConnected ? "Wallet connected" : "Wallet not connected"}</span>
        </div>
      </Card>
    </Link>
  );
});
