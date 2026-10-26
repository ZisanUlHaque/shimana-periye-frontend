import { z } from "zod";

export const CreateOutreachLogZodSchema = z.object({
  professorId: z
    .string()
    .uuid("Invalid Professor")
    .optional()
    .or(z.literal("")),
  opportunityId: z
    .string()
    .uuid("Invalid Opportunity")
    .optional()
    .or(z.literal("")),
  emailSentAt: z.string().optional().or(z.literal("")),
  followUpAt: z.string().optional().or(z.literal("")),
  notes: z.string().max(1000, "Notes are too long").optional(),
});

export const UpdateOutreachLogZodSchema = z.object({
  emailSentAt: z.string().nullable().optional(),
  followUpAt: z.string().nullable().optional(),
  notes: z.string().max(1000).optional(),
});

export const MarkReplyReceivedZodSchema = z.object({
  replyAt: z.string().optional(),
});

export type OutreachLogFormValues = z.infer<typeof CreateOutreachLogZodSchema>;

export const OutreachLogValidation = {
  CreateOutreachLogZodSchema,
  UpdateOutreachLogZodSchema,
  MarkReplyReceivedZodSchema,
};
