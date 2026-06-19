// Agent detail route: balance, the core-loop pay action, and this agent's own transactions.
"use client";

import { notFound, useParams } from "next/navigation";
import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/Card";
import { PayAgentForm } from "@/components/agents/PayAgentForm";
import { PolicyEditor } from "@/components/agents/PolicyEditor";
import { WalletConnectButton } from "@/components/agents/WalletConnectButton";
import { TransactionRow } from "@/components/transactions/TransactionRow";
import { useAgentContext } from "@/lib/context/AgentContext";
import { formatAmount } from "@/lib/utils/format";

export default function AgentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { agents, transactions, isLoading } = useAgentContext();

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
          <div className="mt-3">
            <WalletConnectButton agent={agent} />
          </div>
        </Card>

        <Card className="lg:col-span-2">
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
