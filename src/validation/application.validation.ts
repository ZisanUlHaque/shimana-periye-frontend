import { z } from "zod";
import { ApplicationStatus, Decision } from "@/types/application.type";

const StartApplicationZodSchema = z.object({
  opportunityId: z.string().uuid("Invalid Opportunity ID"),
});

const UpdateApplicationStatusZodSchema = z.object({
  status: z.nativeEnum(ApplicationStatus),
});

const RecordDecisionZodSchema = z
  .object({
    decision: z.nativeEnum(Decision),
    offerResponseDeadline: z.string().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.decision === "ACCEPTED" && !data.offerResponseDeadline) {
      ctx.addIssue({
        code: "custom",
        message: "Offer response deadline is required when decision is Accepted",
        path: ["offerResponseDeadline"],
      });
    }
  });

const RecordInterviewZodSchema = z.object({
  interviewDate: z.string().min(1, "Interview date is required"),
});

export type StartApplicationFormValues = z.infer<typeof StartApplicationZodSchema>;
export type UpdateApplicationStatusFormValues = z.infer<typeof UpdateApplicationStatusZodSchema>;
export type RecordDecisionFormValues = z.infer<typeof RecordDecisionZodSchema>;
export type RecordInterviewFormValues = z.infer<typeof RecordInterviewZodSchema>;

export const ApplicationValidation = {
  StartApplicationZodSchema,
  UpdateApplicationStatusZodSchema,
  RecordDecisionZodSchema,
  RecordInterviewZodSchema,
};