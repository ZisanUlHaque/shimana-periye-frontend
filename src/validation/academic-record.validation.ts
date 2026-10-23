import { z } from "zod";

const currentYear = new Date().getFullYear();

export const AcademicRecordZodSchema = z
  .object({
    degree: z
      .string()
      .min(2, "Degree must be at least 2 characters")
      .max(150, "Degree must be at most 150 characters"),
    institution: z
      .string()
      .min(2, "Institution must be at least 2 characters")
      .max(200, "Institution must be at most 200 characters"),
    fieldOfStudy: z
      .string()
      .min(2, "Field of study must be at least 2 characters")
      .max(150, "Field of study must be at most 150 characters"),
    gpa: z
      .number()
      .min(0, "GPA must be at least 0")
      .max(5, "GPA must be at most 5")
      .optional(),
    startYear: z
      .number()
      .int()
      .min(1950, "Start year must be at least 1950")
      .max(currentYear + 1, "Start year cannot be in the future")
      .optional(),
    endYear: z
      .number()
      .int()
      .min(1950, "End year must be at least 1950")
      .max(currentYear + 10, "End year is too far in future")
      .optional(),
  })
  .refine(
    (data) =>
      !data.startYear || !data.endYear || data.endYear >= data.startYear,
    {
      message: "End year must be the same as or after start year",
      path: ["endYear"],
    },
  );

export type AcademicRecordFormValues = z.infer<typeof AcademicRecordZodSchema>;

export const AcademicRecordValidation = {
  AcademicRecordZodSchema,
};
