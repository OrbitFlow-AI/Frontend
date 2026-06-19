// Settings route: environment/network switch scoping which agents are visible app-wide.
"use client";

import { Topbar } from "@/components/layout/Topbar";
import { Card } from "@/components/ui/Card";
import { useAgentContext } from "@/lib/context/AgentContext";
import type { Network } from "@/types/domain";

const networks: Network[] = ["testnet", "mainnet"];

export default function SettingsPage() {
  const { network, setNetwork } = useAgentContext();

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
      </main>
    </>
  );
}
