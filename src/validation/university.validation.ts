import z from "zod";

const CreateUniversityZodSchema = z.object({
  name: z.string().min(2, "Name is required").max(200),
  country: z.string().min(2, "Country is required").max(100),
  website: z.string().url("Invalid URL").or(z.literal("")),
  imageUrl: z.string().url("Invalid image URL").or(z.literal("")).optional(),
});

const UpdateUniversityZodSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  country: z.string().min(2).max(100).optional(),
  website: z.string().url("Invalid URL").or(z.literal("")),
  imageUrl: z.string().url("Invalid image URL").or(z.literal("")).optional(),
});

export const UniversityValidation = {
  CreateUniversityZodSchema,
  UpdateUniversityZodSchema,
};
