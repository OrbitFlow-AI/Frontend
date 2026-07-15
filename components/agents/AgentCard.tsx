// Summary card for one agent treasury: balance, budget, network, and status badge.
// Memoized since dashboard grids re-render this for every agent on each context refresh.
"use client";

import { memo, useState } from "react";
import Link from "next/link";
import type { Agent } from "@/types/domain";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatAmount } from "@/lib/utils/format";
import { useAgentContext } from "@/lib/context/AgentContext";
import { useToast } from "@/lib/context/ToastContext";

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
  const { pauseAgent, resumeAgent } = useAgentContext();
  const { notify } = useToast();
  const [isToggling, setIsToggling] = useState(false);
  const budgetUsedPct = Math.min(100, Math.round(((agent.budget - agent.balance) / agent.budget) * 100));

  async function handleToggleStatus(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsToggling(true);
    try {
      if (agent.status === "paused") {
        await resumeAgent(agent.id);
        notify(`${agent.name} resumed.`, "success");
      } else {
        await pauseAgent(agent.id);
        notify(`${agent.name} paused.`, "warning");
      }
    } finally {
      setIsToggling(false);
    }
  }

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

        <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted">
          <div className="flex items-center gap-2">
            <span className="uppercase">{agent.network}</span>
            <span>·</span>
            <span>{agent.walletConnected ? "Wallet connected" : "Wallet not connected"}</span>
          </div>
          {agent.status !== "over_limit" ? (
            <Button
              variant="secondary"
              onClick={handleToggleStatus}
              disabled={isToggling}
              className="px-2 py-1 text-xs"
            >
              {agent.status === "paused" ? "Resume" : "Pause"}
            </Button>
          ) : null}
        </div>
      </Card>
    </Link>
  );
});
