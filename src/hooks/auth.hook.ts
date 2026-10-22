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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useLogin() {
  return useMutation({
    mutationFn: userLogin,
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
      // 1. Immediately clear the user data from React Query cache
      queryClient.setQueryData(["user"], null);
      queryClient.invalidateQueries({ queryKey: ["user"] });
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