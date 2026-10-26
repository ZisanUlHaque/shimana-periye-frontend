import { z } from "zod";

export const CreateRecommendationRequestZodSchema = z.object({
  applicationId: z
    .string()
    .uuid("Invalid Application ID")
    .optional()
    .or(z.literal("")),
  professorName: z
    .string()
    .min(2, "Professor name must be at least 2 characters")
    .max(150),
  professorEmail: z
    .string()
    .email("Invalid email")
    .optional()
    .or(z.literal("")),
  followUpAt: z.string().optional().or(z.literal("")),
});

export const UpdateRecommendationRequestZodSchema = z.object({
  professorName: z.string().min(2).max(150).optional(),
  professorEmail: z.string().email().optional().or(z.literal("")),
  followUpAt: z.string().nullable().optional(),
});

export const UpdateRecommendationStatusZodSchema = z.object({
  status: z.enum(["NOT_REQUESTED", "REQUESTED", "SUBMITTED", "DECLINED"]),
});

export type RecommendationRequestFormValues = z.infer<
  typeof CreateRecommendationRequestZodSchema
>;

export const RecommendationRequestValidation = {
  CreateRecommendationRequestZodSchema,
  UpdateRecommendationRequestZodSchema,
  UpdateRecommendationStatusZodSchema,
};
