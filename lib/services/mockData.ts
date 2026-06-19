// Seed data for the mock service layer. This is the only place fixture data is defined;
// services clone from here so each app session starts from a known, demo-able state.
import type { Agent, MarketplaceListing, Policy, Transaction } from "@/types/domain";

export function createSeedAgents(): Agent[] {
  return [
    {
      id: "agent_pricer",
      name: "Pricer-7",
      description: "Fetches and aggregates market price feeds for downstream trading agents.",
      network: "testnet",
      asset: "USDC",
      balance: 482.5,
      budget: 1000,
      status: "active",
      walletConnected: true,
      createdAt: "2026-06-01T09:12:00.000Z",
    },
    {
      id: "agent_scraper",
      name: "DataScout",
      description: "Sells structured web data extraction as an API to other agents.",
      network: "testnet",
      asset: "USDC",
      balance: 1240.0,
      budget: 500,
      status: "active",
      walletConnected: true,
      createdAt: "2026-06-02T14:45:00.000Z",
    },
    {
      id: "agent_compute",
      name: "ComputeMesh-Node3",
      description: "Leases spare inference compute cycles to other agents per call.",
      network: "testnet",
      asset: "USDC",
      balance: 75.0,
      budget: 200,
      status: "over_limit",
      walletConnected: false,
      createdAt: "2026-06-04T08:00:00.000Z",
    },
  ];
}

export function createSeedPolicies(): Policy[] {
  return [
    {
      id: "policy_pricer",
      agentId: "agent_pricer",
      active: true,
      maxPerTransaction: 50,
      dailyCap: 200,
      allowedCounterpartyIds: null,
    },
    {
      id: "policy_scraper",
      agentId: "agent_scraper",
      active: true,
      maxPerTransaction: 100,
      dailyCap: 400,
      allowedCounterpartyIds: ["agent_pricer", "agent_compute"],
    },
    {
      id: "policy_compute",
      agentId: "agent_compute",
      active: true,
      maxPerTransaction: 20,
      dailyCap: 60,
      allowedCounterpartyIds: null,
    },
  ];
}

export function createSeedTransactions(): Transaction[] {
  return [
    {
      id: "tx_seed_1",
      fromAgentId: "agent_pricer",
      toAgentId: "agent_scraper",
      amount: 12.5,
      asset: "USDC",
      status: "settled",
      memo: "Price feed dataset pull",
      createdAt: "2026-06-18T10:00:00.000Z",
    },
  ];
}

export function createSeedListings(): MarketplaceListing[] {
  return [
    {
      id: "listing_scout_dataset",
      providerAgentId: "agent_scraper",
      name: "Structured Web Dataset",
      category: "dataset",
      pricePerCall: 12.5,
      asset: "USDC",
    },
    {
      id: "listing_compute_inference",
      providerAgentId: "agent_compute",
      name: "Inference Cycle (1k tokens)",
      category: "compute",
      pricePerCall: 3.0,
      asset: "USDC",
    },
    {
      id: "listing_pricer_feed",
      providerAgentId: "agent_pricer",
      name: "Live Price Feed API",
      category: "api_access",
      pricePerCall: 1.5,
      asset: "USDC",
    },
  ];
}
