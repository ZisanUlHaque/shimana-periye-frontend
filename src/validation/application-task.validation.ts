import { z } from "zod";

export const TASK_STATUS_OPTIONS = [
  "PENDING",
  "IN_PROGRESS",
  "DONE",
  "BLOCKED",
] as const;

const CreateApplicationTaskZodSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be at most 200 characters"),
  description: z
    .string()
    .max(1000, "Description must be at most 1000 characters")
    .optional()
    .or(z.literal("")),
  deadline: z.string().optional().or(z.literal("")),
  dependsOnId: z.string().uuid().optional().or(z.literal("")),
});

const UpdateApplicationTaskZodSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  description: z.string().max(1000).optional().or(z.literal("")),
  deadline: z.string().optional().or(z.literal("")),
  dependsOnId: z.string().uuid().nullable().optional(),
});

const UpdateTaskStatusZodSchema = z.object({
  status: z.enum(TASK_STATUS_OPTIONS),
});

export type ApplicationTaskFormValues = z.infer<
  typeof CreateApplicationTaskZodSchema
>;

export const ApplicationTaskValidation = {
  CreateApplicationTaskZodSchema,
  UpdateApplicationTaskZodSchema,
  UpdateTaskStatusZodSchema,
};
