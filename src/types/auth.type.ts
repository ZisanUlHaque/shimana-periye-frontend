import type { Role } from "./role.enum";

export interface ILoginUserPayload {
  email: string;
  password: string;
}

export interface IRegisterStudentPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
  student?: {
    interests?: string[];
    skills?: string[];
  };
}

export interface IVerifyEmailPayload {
  email: string;
  otp: string;
}

export interface IRequestUser {
  userId: string;
  email: string;
  name: string;
  role: Role;
}

export interface IGoogleLoginPayload {
  idToken: string;
}

export interface IForgotPasswordPayload {
  email: string;
}

export interface IResetPasswordPayload {
  email: string;
  newPassword: string;
  otp: string;
}

// Backward-compatible aliases for existing components
export type LoginPayload = ILoginUserPayload;
export type RegistrationPayload = IRegisterStudentPayload;
export type VerifyAccountPayload = IVerifyEmailPayload;
export type ForgotPasswordPayload = IForgotPasswordPayload;
export type ResetPasswordPayload = IResetPasswordPayload;
