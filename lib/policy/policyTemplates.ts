// Preset spend policy caps an operator can apply as a starting point instead of hand-tuning
// max-per-transaction and daily-cap values from scratch.
export interface PolicyTemplate {
  id: string;
  name: string;
  description: string;
  maxPerTransaction: number;
  dailyCap: number;
}

export const policyTemplates: PolicyTemplate[] = [
  {
    id: "conservative",
    name: "Conservative",
    description: "Tight caps for agents handling small, frequent micropayments.",
    maxPerTransaction: 10,
    dailyCap: 50,
  },
  {
    id: "standard",
    name: "Standard",
    description: "Balanced caps suitable for most agent treasuries.",
    maxPerTransaction: 50,
    dailyCap: 200,
  },
  {
    id: "permissive",
    name: "Permissive",
    description: "Loose caps for high-volume or high-trust agents.",
    maxPerTransaction: 250,
    dailyCap: 1000,
  },
];
