import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  forgotPassword,
  getMe,
  googleLogin,
  refreshToken,
  registerStudent,
  resetPassword,
  userLogin,
  userLogout,
  verifyStudentEmail,
} from "@/api/auth.api";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userLogin,
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useVerifyStudentEmail() {
  return useMutation({
    mutationFn: verifyStudentEmail,
  });
}

export function useRegisterStudent() {
  return useMutation({
    mutationFn: registerStudent,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userLogout,
    onSuccess: () => {
      // 1. Clear all user session and cached queries to prevent data leaking across accounts
      queryClient.setQueryData(["user"], null);
      queryClient.clear();
    },
  });
}

export function useGetMe() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    retry: false,
  });
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: refreshToken,
  });
}

export function useGoogleLogin() {
  return useMutation({
    mutationFn: googleLogin,
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  });
}

// Backward-compatibility aliases
export const useRegistration = useRegisterStudent;
export const useVerifyAccount = useVerifyStudentEmail;
export const useGoogleOAuth = useGoogleLogin;
