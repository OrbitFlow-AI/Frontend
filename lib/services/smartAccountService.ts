// Mock boundary for Stellar's Smart Account Kit (passkey-based smart wallets). A real
// integration would call the actual SDK here to create/register a passkey credential and
// return its public key; this stub only simulates the round trip and shape of that response.
import { mockDelay } from "./mockLatency";

export interface PasskeyCredential {
  credentialId: string;
  publicKey: string;
  appId: string;
}

export async function connectPasskey(agentId: string): Promise<PasskeyCredential> {
  const credential: PasskeyCredential = {
    credentialId: `cred_${agentId}_${crypto.randomUUID().slice(0, 6)}`,
    publicKey: `GMOCK${crypto.randomUUID().replace(/-/g, "").slice(0, 50).toUpperCase()}`,
    appId: process.env.NEXT_PUBLIC_SMART_ACCOUNT_KIT_APP_ID ?? "orbitflow-dev",
  };
  return mockDelay(credential);
}
