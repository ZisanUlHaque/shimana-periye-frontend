import { z } from "zod";

const currentYear = new Date().getFullYear();

export const PublicationZodSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(300, "Title must be at most 300 characters"),
  venue: z.string().max(200, "Venue is too long").optional(),
  year: z
    .number()
    .int()
    .min(1950, "Year must be at least 1950")
    .max(currentYear + 1, "Year cannot be in the future")
    .optional(),
  link: z.string().url("Invalid URL format").or(z.literal("")).optional(),
});

export type PublicationFormValues = z.infer<typeof PublicationZodSchema>;

export const PublicationValidation = {
  PublicationZodSchema,
};
