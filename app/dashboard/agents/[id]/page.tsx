// Agent detail route: balance, the core-loop pay action, and this agent's own transactions.
"use client";

import { notFound, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PayAgentForm } from "@/components/agents/PayAgentForm";
import { PolicyEditor } from "@/components/agents/PolicyEditor";
import { WalletConnectButton } from "@/components/agents/WalletConnectButton";
import { TransactionRow } from "@/components/transactions/TransactionRow";
import { useAgentContext } from "@/lib/context/AgentContext";
import { useToast } from "@/lib/context/ToastContext";
import { formatAmount } from "@/lib/utils/format";

const BalanceHistoryChart = dynamic(() => import("@/components/agents/BalanceHistoryChart"), {
  ssr: false,
  loading: () => <p className="text-sm text-muted">Loading chart…</p>,
});

export default function AgentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { agents, transactions, isLoading, pauseAgent, resumeAgent } = useAgentContext();
  const { notify } = useToast();

  if (isLoading) {
    return <p className="p-6 text-sm text-muted">Loading agent…</p>;
  }

  const agent = agents.find((a) => a.id === id);
  if (!agent) {
    notFound();
  }

  const agentsById = Object.fromEntries(agents.map((a) => [a.id, a]));
  const ownTransactions = transactions.filter(
    (tx) => tx.fromAgentId === agent.id || tx.toAgentId === agent.id,
  );
  const recipients = agents.filter((a) => a.id !== agent.id);
  const agentId = agent.id;
  const agentName = agent.name;
  const agentStatus = agent.status;

  async function handleToggleStatus() {
    if (agentStatus === "paused") {
      await resumeAgent(agentId);
      notify(`${agentName} resumed.`, "success");
    } else {
      await pauseAgent(agentId);
      notify(`${agentName} paused.`, "warning");
    }
  }

  return (
    <>
      <Topbar title={agent.name} subtitle={agent.description} />
      <main className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <p className="text-xs text-muted">Balance</p>
          <p className="text-2xl font-semibold text-slate-100">
            {formatAmount(agent.balance, agent.asset)}
          </p>
          <p className="mt-2 text-xs text-muted">Budget: {formatAmount(agent.budget, agent.asset)}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <WalletConnectButton agent={agent} />
            {agent.status === "over_limit" ? (
              <Badge tone="danger">Over limit</Badge>
            ) : (
              <Button variant="secondary" onClick={handleToggleStatus} className="text-xs">
                {agent.status === "paused" ? "Resume agent" : "Pause agent"}
              </Button>
            )}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-medium text-slate-200">Balance history</h2>
          <BalanceHistoryChart currentBalance={agent.balance} />
        </Card>

        <Card className="lg:col-span-3">
          <h2 className="mb-3 text-sm font-medium text-slate-200">Send a payment</h2>
          <PayAgentForm fromAgent={agent} recipients={recipients} />
        </Card>

        <Card className="lg:col-span-3">
          <h2 className="mb-3 text-sm font-medium text-slate-200">Spend policy</h2>
          <PolicyEditor agentId={agent.id} />
        </Card>

        <Card className="lg:col-span-3">
          <h2 className="mb-2 text-sm font-medium text-slate-200">Recent transactions</h2>
          {ownTransactions.length === 0 ? (
            <p className="text-sm text-muted">No transactions for this agent yet.</p>
          ) : (
            ownTransactions.map((tx) => (
              <TransactionRow key={tx.id} transaction={tx} agentsById={agentsById} />
            ))
          )}
        </Card>
      </main>
    </>
  );
}
