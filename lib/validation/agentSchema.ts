// Zod schema for the Create Agent form — the single source of truth for valid agent input,
// shared between the form's inline validation and (eventually) any server-side check.
import { z } from "zod";

export const createAgentSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(40),
  description: z.string().trim().max(160, "Description must be 160 characters or fewer"),
  network: z.enum(["testnet", "mainnet"]),
  asset: z.string().trim().min(1, "Asset is required"),
  budget: z.coerce.number().positive("Budget must be greater than zero"),
});

export type CreateAgentFormValues = z.infer<typeof createAgentSchema>;
