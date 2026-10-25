import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import {
  applyAsMentor,
  verifyMentorEmail,
  getMentorApplicationStatus,
  approveMentor,
  getAllMentors,
  getMyMentorProfile,
  updateMyMentorProfile,
} from "@/api/mentor-profile.api";
import type {
  IApplyAsMentorPayload,
  IVerifyMentorEmailPayload,
  IApproveMentorPayload,
} from "@/types/mentor-profile.type";
import { DASHBOARD_KEYS } from "./dashboard.hook";

export const MENTOR_PROFILE_KEYS = {
  all: ["mentor-profiles"] as const,
  list: (params?: Record<string, any>) => ["mentor-profiles", "list", params] as const,
  me: ["mentor-profiles", "me"] as const,
  status: (email: string) => ["mentor-profiles", "status", email] as const,
};

export function useApplyAsMentor() {
  return useMutation({
    mutationFn: (payload: IApplyAsMentorPayload) => applyAsMentor(payload),
    onError: (err: any) => {
      toast.add({
        title: "Application submission failed",
        description: err?.message ?? "Please check your inputs and try again.",
        type: "error",
      });
    },
  });
}

export function useVerifyMentorEmail() {
  return useMutation({
    mutationFn: (payload: IVerifyMentorEmailPayload) => verifyMentorEmail(payload),
    onError: (err: any) => {
      toast.add({
        title: "Verification failed",
        description: err?.message ?? "Invalid or expired OTP code.",
        type: "error",
      });
    },
  });
}

export function useMentorApplicationStatus(email: string) {
  return useQuery({
    queryKey: MENTOR_PROFILE_KEYS.status(email),
    queryFn: () => getMentorApplicationStatus(email),
    enabled: Boolean(email && email.includes("@")),
  });
}

export function useApproveMentor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IApproveMentorPayload) => approveMentor(payload),
    onSuccess: (_, variables) => {
      toast.add({
        title:
          variables.verificationStatus === "APPROVED"
            ? "Mentor approved successfully"
            : "Mentor application rejected",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: MENTOR_PROFILE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEYS.admin });
    },
    onError: (err: any) => {
      toast.add({
        title: "Action failed",
        description: err?.message,
        type: "error",
      });
    },
  });
}

export function useAllMentors(params?: Record<string, any>) {
  return useQuery({
    queryKey: MENTOR_PROFILE_KEYS.list(params),
    queryFn: () => getAllMentors(params),
  });
}

export function useMyMentorProfile() {
  return useQuery({
    queryKey: MENTOR_PROFILE_KEYS.me,
    queryFn: getMyMentorProfile,
  });
}

export function useUpdateMyMentorProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { bio?: string; expertise?: string[] }) =>
      updateMyMentorProfile(payload),
    onSuccess: () => {
      toast.add({ title: "Profile updated successfully", type: "success" });
      queryClient.invalidateQueries({ queryKey: MENTOR_PROFILE_KEYS.me });
    },
    onError: (err: any) => {
      toast.add({
        title: "Update failed",
        description: err?.message,
        type: "error",
      });
    },
  });
}
