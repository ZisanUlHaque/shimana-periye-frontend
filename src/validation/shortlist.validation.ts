import z from "zod";

const CreateShortlistZodSchema = z.object({
  opportunityId: z.uuid("Invalid Opportunity ID"),
  notes: z.string().max(2000).optional(),
});

const UpdateShortlistZodSchema = z.object({
  notes: z.string().max(2000).optional(),
});

export const ShortlistValidation = {
  CreateShortlistZodSchema,
  UpdateShortlistZodSchema,
};