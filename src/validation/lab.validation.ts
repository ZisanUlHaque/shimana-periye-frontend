import { z } from "zod";

export const CreateLabZodSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(150),
  universityId: z.string().uuid("Invalid university selected"),
  focusAreas: z.array(z.string()).optional(),
});

export const UpdateLabZodSchema = z.object({
  name: z.string().min(2).max(150).optional(),
  focusAreas: z.array(z.string()).optional(),
});

export type LabFormValues = z.infer<typeof CreateLabZodSchema>;

export const LabValidation = {
  CreateLabZodSchema,
  UpdateLabZodSchema,
};
