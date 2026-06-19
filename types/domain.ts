// Shared domain types for agents, treasuries, policies, transactions, and marketplace listings.

export type Network = "testnet" | "mainnet";

export type AgentStatus = "active" | "paused" | "over_limit";

export interface Agent {
  id: string;
  name: string;
  description: string;
  network: Network;
  asset: string;
  balance: number;
  budget: number;
  status: AgentStatus;
  walletConnected: boolean;
  createdAt: string;
}

export type PolicyRuleType = "max_per_transaction" | "daily_cap" | "allowed_counterparties";

export interface Policy {
  id: string;
  agentId: string;
  active: boolean;
  maxPerTransaction: number;
  dailyCap: number;
  allowedCounterpartyIds: string[] | null; // null means "any counterparty allowed"
}

export type TransactionStatus = "settled" | "blocked" | "pending";

export interface Transaction {
  id: string;
  fromAgentId: string;
  toAgentId: string;
  amount: number;
  asset: string;
  status: TransactionStatus;
  violatedRule?: PolicyRuleType;
  memo: string;
  createdAt: string;
}

export type ListingCategory = "api_access" | "dataset" | "compute";

export interface MarketplaceListing {
  id: string;
  providerAgentId: string;
  name: string;
  category: ListingCategory;
  pricePerCall: number;
  asset: string;
}
