import apiClient from "@/lib/apiClient";
import type {
  IForgotPasswordPayload,
  IGoogleLoginPayload,
  ILoginUserPayload,
  IRegisterStudentPayload,
  IResetPasswordPayload,
  IVerifyEmailPayload,
} from "@/types/auth.type";

export function userLogin(payload: ILoginUserPayload) {
  return apiClient("/auth/login", { method: "POST", body: payload });
}

export function registerStudent(payload: IRegisterStudentPayload) {
  return apiClient("/auth/register", { method: "POST", body: payload });
}

export function verifyStudentEmail(payload: IVerifyEmailPayload) {
  return apiClient("/auth/verify-email", { method: "POST", body: payload });
}

export function userLogout() {
  return apiClient("/auth/logout", { method: "POST" });
}

export function getMe() {
  return apiClient("/auth/me");
}

export function refreshToken() {
  return apiClient("/auth/refresh-token", { method: "POST" });
}

export function googleLogin(payload: IGoogleLoginPayload) {
  return apiClient("/auth/google", { method: "POST", body: payload });
}

export function forgotPassword(payload: IForgotPasswordPayload) {
  return apiClient("/auth/forgot-password", {
    method: "POST",
    body: payload,
  });
}

export function resetPassword(payload: IResetPasswordPayload) {
  return apiClient("/auth/reset-password", {
    method: "POST",
    body: payload,
  });
}

// Backward-compatibility aliases
export const userRegistration = registerStudent;
export const verifyAccount = verifyStudentEmail;
export const googleOAuth = googleLogin;
