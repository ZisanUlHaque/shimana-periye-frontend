import { z } from "zod";

export const DocumentTypeEnum = z.enum([
  "SOP",
  "CV",
  "RESEARCH_STATEMENT",
  "TRANSCRIPT",
  "OTHER",
]);

export const CreateDocumentZodSchema = z.object({
  type: DocumentTypeEnum,
  applicationId: z
    .string()
    .uuid("Invalid application ID")
    .optional()
    .or(z.literal("")),
});

export const UpdateDocumentZodSchema = z.object({
  type: DocumentTypeEnum.optional(),
  applicationId: z.string().uuid().nullable().optional().or(z.literal("")),
});

export type DocumentFormValues = z.infer<typeof CreateDocumentZodSchema>;

export const DocumentValidation = {
  DocumentTypeEnum,
  CreateDocumentZodSchema,
  UpdateDocumentZodSchema,
};
