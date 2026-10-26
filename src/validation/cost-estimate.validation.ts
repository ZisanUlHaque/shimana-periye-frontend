import { z } from "zod";

export const UpsertCostEstimateZodSchema = z.object({
  tuitionFee: z.number().min(0, "Tuition fee must be at least 0").optional(),
  livingCost: z.number().min(0, "Living cost must be at least 0").optional(),
  visaAndTravelFee: z
    .number()
    .min(0, "Visa & travel fee must be at least 0")
    .optional(),
  healthInsurance: z
    .number()
    .min(0, "Health insurance must be at least 0")
    .optional(),
  applicationFee: z
    .number()
    .min(0, "Application fee must be at least 0")
    .optional(),
  miscellaneousCost: z
    .number()
    .min(0, "Miscellaneous cost must be at least 0")
    .optional(),
  scholarshipOrWaiver: z
    .number()
    .min(0, "Scholarship / waiver must be at least 0")
    .optional(),
  currency: z.string().min(1, "Currency is required").max(10),
  notes: z.string().max(1000, "Notes cannot exceed 1000 characters").optional(),
});

export type CostEstimateFormValues = z.infer<
  typeof UpsertCostEstimateZodSchema
>;

export const CostEstimateValidation = {
  UpsertCostEstimateZodSchema,
};
