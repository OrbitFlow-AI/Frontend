// Zod schema for the Create Listing form — the single source of truth for valid marketplace
// listing input, mirroring the pattern used by createAgentSchema.
import { z } from "zod";

export const createListingSchema = z.object({
  providerAgentId: z.string().min(1, "Provider agent is required"),
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  category: z.enum(["api_access", "dataset", "compute"]),
  pricePerCall: z.coerce.number().positive("Price per call must be greater than zero"),
  asset: z.string().trim().min(1, "Asset is required"),
});

export type CreateListingFormValues = z.infer<typeof createListingSchema>;
