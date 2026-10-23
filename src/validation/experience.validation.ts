import { z } from "zod";

export const ExperienceZodSchema = z
  .object({
    role: z
      .string()
      .min(2, "Role must be at least 2 characters")
      .max(100, "Role must be at most 100 characters"),
    organization: z
      .string()
      .min(2, "Organization must be at least 2 characters")
      .max(150, "Organization must be at most 150 characters"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    description: z.string().max(2000, "Description is too long").optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.endDate) >= new Date(data.startDate);
      }
      return true;
    },
    {
      message: "End date must be after or equal to start date",
      path: ["endDate"],
    },
  );

export type ExperienceFormValues = z.infer<typeof ExperienceZodSchema>;

export const ExperienceValidation = {
  ExperienceZodSchema,
};
