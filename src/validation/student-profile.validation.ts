import { z } from "zod";

export const StudentProfileZodSchema = z.object({
  interests: z
    .array(z.string().min(1, "Interest cannot be empty").max(50))
    .max(20, "Maximum 20 interests allowed")
    .optional(),
  skills: z
    .array(z.string().min(1, "Skill cannot be empty").max(50))
    .max(20, "Maximum 20 skills allowed")
    .optional(),
});

export type StudentProfileFormValues = z.infer<typeof StudentProfileZodSchema>;

export const StudentProfileValidation = {
  StudentProfileZodSchema,
};
