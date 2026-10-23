import { z } from "zod";
import { OpportunityType } from "@/types/opportunity.type";

const TYPE_VALUES = Object.values(OpportunityType) as [OpportunityType, ...OpportunityType[]];

const CreateOpportunityZodSchema = z.object({
  type: z.enum(TYPE_VALUES),
  title: z.string().min(3, "Title must be at least 3 characters").max(300),
  universityId: z.string().uuid("Invalid University ID"),
  professorId: z.string().uuid("Invalid Professor ID").optional().or(z.literal("")),
  labId: z.string().uuid("Invalid Lab ID").optional().or(z.literal("")),
  fieldOfStudy: z.string().min(2).max(150),
  deadline: z.string().optional().or(z.literal("")),
  source: z.string().min(3, "Source must be at least 3 characters").max(500),
  lastCheckedAt: z.string().min(1, "Last checked date is required"),
});

const UpdateOpportunityZodSchema = z.object({
  type: z.enum(TYPE_VALUES).optional(),
  title: z.string().min(3).max(300).optional(),
  professorId: z.string().uuid().nullable().optional(),
  labId: z.string().uuid().nullable().optional(),
  fieldOfStudy: z.string().min(2).max(150).optional(),
  deadline: z.string().nullable().optional(),
  source: z.string().min(3).max(500).optional(),
  lastCheckedAt: z.string().optional(),
});

export type OpportunityFormValues = z.infer<typeof CreateOpportunityZodSchema>;

export const OpportunityValidation = {
  CreateOpportunityZodSchema,
  UpdateOpportunityZodSchema,
};