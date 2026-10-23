import { z } from "zod";

export const RequirementTypeEnum = z.enum([
  "MIN_GPA",
  "DEGREE_LEVEL",
  "FIELD_OF_STUDY",
  "TEST_IELTS",
  "TEST_TOEFL",
  "TEST_GRE",
  "TEST_GMAT",
  "WORK_EXPERIENCE",
  "PUBLICATION_COUNT",
  "DOCUMENT_REQUIRED",
  "OTHER",
]);

export const CreateRequirementZodSchema = z.object({
  type: RequirementTypeEnum,
  detail: z.string().min(2, "Detail must be at least 2 characters").max(300),
  minValue: z.number().optional(),
});

export const UpdateRequirementZodSchema = z.object({
  type: RequirementTypeEnum.optional(),
  detail: z.string().min(2).max(300).optional(),
  minValue: z.number().optional(),
});

export type RequirementFormValues = z.infer<typeof CreateRequirementZodSchema>;

export const RequirementValidation = {
  RequirementTypeEnum,
  CreateRequirementZodSchema,
  UpdateRequirementZodSchema,
};
