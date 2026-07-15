// Settings route: environment/network switch scoping which agents are visible app-wide.
"use client";

import { useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAgentContext } from "@/lib/context/AgentContext";
import { useToast } from "@/lib/context/ToastContext";
import type { Network } from "@/types/domain";

const networks: Network[] = ["testnet", "mainnet"];

export default function SettingsPage() {
  const { network, setNetwork, resetDemoData } = useAgentContext();
  const { notify } = useToast();
  const [isResetting, setIsResetting] = useState(false);

  async function handleReset() {
    setIsResetting(true);
    try {
      await resetDemoData();
      notify("Demo data reset to its seeded state.", "success");
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <>
      <Topbar title="Settings" subtitle="Environment and network configuration" />
      <main className="p-6">
        <Card className="max-w-md">
          <h2 className="mb-3 text-sm font-medium text-slate-200">Network</h2>
          <div className="flex gap-2">
            {networks.map((option) => (
              <button
                key={option}
                onClick={() => setNetwork(option)}
                className={`rounded-md border px-3 py-2 text-sm capitalize ${
                  network === option
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-slate-300 hover:bg-slate-800"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">
            Switching networks scopes the agents shown across the dashboard to that network.
          </p>
        </Card>

        <Card className="mt-4 max-w-md">
          <h2 className="mb-3 text-sm font-medium text-slate-200">Demo data</h2>
          <p className="mb-3 text-xs text-muted">
            Restore agents, transactions, policies, and marketplace listings to their original
            seeded state. This does not affect real data since none of it is persisted.
          </p>
          <Button variant="danger" onClick={handleReset} disabled={isResetting}>
            {isResetting ? "Resetting…" : "Reset demo data"}
          </Button>
        </Card>
      </main>
    </>
  );
}
