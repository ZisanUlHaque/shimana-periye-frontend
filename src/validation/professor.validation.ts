import { z } from "zod";

export const CreateProfessorZodSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  universityId: z.string().uuid("Invalid university selected"),
  labId: z.string().uuid("Invalid lab selected").optional().or(z.literal("")),
  researchAreas: z.array(z.string()).optional(),
});

export const UpdateProfessorZodSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional().or(z.literal("")),
  labId: z.string().uuid().nullable().optional().or(z.literal("")),
  researchAreas: z.array(z.string()).optional(),
});

export type ProfessorFormValues = z.infer<typeof CreateProfessorZodSchema>;

export const ProfessorValidation = {
  CreateProfessorZodSchema,
  UpdateProfessorZodSchema,
};
