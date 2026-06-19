// The core-loop action: lets an operator trigger one simulated micropayment from this
// agent to another, proving the treasury + ledger update end-to-end.
"use client";

import { useState } from "react";
import type { Agent } from "@/types/domain";
import { Button } from "@/components/ui/Button";
import { useAgentContext } from "@/lib/context/AgentContext";

export function PayAgentForm({ fromAgent, recipients }: { fromAgent: Agent; recipients: Agent[] }) {
  const { payAgent } = useAgentContext();
  const [toAgentId, setToAgentId] = useState(recipients[0]?.id ?? "");
  const [amount, setAmount] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (recipients.length === 0) {
    return <p className="text-sm text-muted">No other agents available to pay yet.</p>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await payAgent(fromAgent.id, toAgentId, amount, "Simulated agent-to-agent payment");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div>
        <label className="block text-xs text-muted">Pay to</label>
        <select
          value={toAgentId}
          onChange={(e) => setToAgentId(e.target.value)}
          className="mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-100"
        >
          {recipients.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs text-muted">Amount ({fromAgent.asset})</label>
        <input
          type="number"
          min={0.01}
          step={0.01}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="mt-1 w-32 rounded-md border border-border bg-background px-3 py-2 text-sm text-slate-100"
        />
      </div>
      <Button type="submit" disabled={isSubmitting || amount <= 0}>
        {isSubmitting ? "Sending…" : "Send Payment"}
      </Button>
    </form>
  );
}
