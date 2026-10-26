import { z } from "zod";

export const scoreRangeByTestType: Record<
  string,
  { min: number; max: number }
> = {
  IELTS: { min: 0, max: 9 },
  TOEFL: { min: 0, max: 120 },
  GRE: { min: 260, max: 340 },
  GMAT: { min: 200, max: 800 },
  OTHER: { min: 0, max: 100000 },
};

export const TestRecordZodSchema = z
  .object({
    testType: z.enum(["IELTS", "TOEFL", "GRE", "GMAT", "OTHER"], {
      message: "Please select a valid test type",
    }),
    overallScore: z.number().optional(),
    plannedDate: z.string().optional(),
    actualDate: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.overallScore !== undefined) {
      const range =
        scoreRangeByTestType[data.testType] ?? scoreRangeByTestType.OTHER;
      if (data.overallScore < range.min || data.overallScore > range.max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${data.testType} score must be between ${range.min} and ${range.max}`,
          path: ["overallScore"],
        });
      }
    }
  });

export type TestRecordFormValues = z.infer<typeof TestRecordZodSchema>;

export const TestRecordValidation = {
  TestRecordZodSchema,
  scoreRangeByTestType,
};
