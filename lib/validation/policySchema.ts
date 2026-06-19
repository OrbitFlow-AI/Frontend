// Zod schema for the Spend Policy editor, ensuring caps are non-negative numbers before save.
import { z } from "zod";

export const policySchema = z.object({
  active: z.boolean(),
  maxPerTransaction: z.coerce.number().nonnegative("Must be zero or greater"),
  dailyCap: z.coerce.number().nonnegative("Must be zero or greater"),
});

export type PolicyFormValues = z.infer<typeof policySchema>;
