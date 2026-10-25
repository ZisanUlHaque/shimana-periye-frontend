import { z } from "zod";

export const FundingZodSchema = z.object({
  opportunityId: z.string().optional(),
  name: z.string().min(2, "Funding name must be at least 2 characters").max(200),
  amount: z.number().nonnegative("Amount must be 0 or positive"),
  currency: z
    .string()
    .length(3, "Currency must be a 3-letter code (e.g. USD, EUR, GBP)")
    .toUpperCase(),
});

export type FundingFormValues = z.infer<typeof FundingZodSchema>;
