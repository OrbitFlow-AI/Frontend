// Models linking a Smart Account Kit passkey credential to an agent treasury. Calls the
// mock smartAccountService boundary rather than a real passkey ceremony.
"use client";

import { useState } from "react";
import type { Agent } from "@/types/domain";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAgentContext } from "@/lib/context/AgentContext";

export function WalletConnectButton({ agent }: { agent: Agent }) {
  const { connectWallet } = useAgentContext();
  const [isConnecting, setIsConnecting] = useState(false);

  if (agent.walletConnected) {
    return <Badge tone="success">Wallet connected</Badge>;
  }

  async function handleConnect() {
    setIsConnecting(true);
    try {
      await connectWallet(agent.id);
    } finally {
      setIsConnecting(false);
    }
  }

  return (
    <Button variant="secondary" onClick={handleConnect} disabled={isConnecting} className="text-xs">
      {isConnecting ? "Connecting passkey…" : "Connect Smart Account passkey"}
    </Button>
  );
}
