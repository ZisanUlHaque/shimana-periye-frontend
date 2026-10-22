import { z } from "zod";

const currentYear = new Date().getFullYear();

/** Converts empty string / undefined → undefined, otherwise → Number */
const optionalNumber = (min: number, max: number, label: string) =>
  z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined ? undefined : Number(val),
    z
      .number()
      .min(min, `${label} must be at least ${min}`)
      .max(max, `${label} must be at most ${max}`)
      .optional(),
  );

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
    gpa: optionalNumber(0, 5, "GPA"),
    startYear: optionalNumber(1950, currentYear + 1, "Start year"),
    endYear: optionalNumber(1950, currentYear + 10, "End year"),
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