import { z } from "zod";

export const StudentRegistrationZodSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters long!")
      .max(100, "Name must be at most 100 characters long!"),
    email: z.string().email("Not a valid email!"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
      .regex(/[0-9]/, "Password must contain at least 1 number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least 1 special character",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    student: z
      .object({
        interests: z.array(z.string()).optional(),
        skills: z.array(z.string()).optional(),
      })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const StudentEmailVerifyZodSchema = z.object({
  email: z.string().email("Not a valid email!"),
  otp: z.string().length(6, "OTP must be exactly 6 digits!"),
});

export const LoginZodSchema = z.object({
  email: z.string().email("Not a valid email!"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[0-9]/, "Password must contain at least 1 number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least 1 special character",
    ),
});

export const ResetPasswordZodSchema = z.object({
  email: z.string().email("Not a valid email!"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[0-9]/, "Password must contain at least 1 number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least 1 special character",
    ),
  otp: z.string().length(6, "OTP must be exactly 6 digits!"),
});

export const ForgotPasswordZodSchema = z.object({
  email: z.string().email("Not a valid email!"),
});

export const UserValidation = {
  StudentRegistrationZodSchema,
  StudentEmailVerifyZodSchema,
  LoginZodSchema,
  ResetPasswordZodSchema,
  ForgotPasswordZodSchema,
};

// Aliases for compatibility
export const RegistrationZodSchema = StudentRegistrationZodSchema;
export const VerifyEmailZodSchema = StudentEmailVerifyZodSchema;
