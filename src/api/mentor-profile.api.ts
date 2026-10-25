import apiClient from "@/lib/apiClient";
import type { IApiResponse } from "@/types/api.type";
import type {
  IApplyAsMentorPayload,
  IVerifyMentorEmailPayload,
  IMentorApplicationStatus,
  IApproveMentorPayload,
  IMentorProfile,
} from "@/types/mentor-profile.type";

export function applyAsMentor(payload: IApplyAsMentorPayload) {
  return apiClient<IApiResponse<any>>("/mentor-profile/apply", {
    method: "POST",
    body: payload,
  });
}

export function verifyMentorEmail(payload: IVerifyMentorEmailPayload) {
  return apiClient<IApiResponse<any>>("/mentor-profile/apply/verify-email", {
    method: "POST",
    body: payload,
  });
}

export function getMentorApplicationStatus(email: string) {
  return apiClient<IApiResponse<IMentorApplicationStatus>>(
    `/mentor-profile/apply/status/${encodeURIComponent(email)}`
  );
}

export function approveMentor(payload: IApproveMentorPayload) {
  return apiClient<IApiResponse<IMentorProfile>>("/mentor-profile/approve", {
    method: "POST",
    body: payload,
  });
}

export function getAllMentors(params?: Record<string, any>) {
  return apiClient<IApiResponse<IMentorProfile[]>>("/mentor-profile", {
    params,
  });
}

export function getMyMentorProfile() {
  return apiClient<IApiResponse<IMentorProfile>>("/mentor-profile/me");
}

export function updateMyMentorProfile(payload: { bio?: string; expertise?: string[] }) {
  return apiClient<IApiResponse<IMentorProfile>>("/mentor-profile/me", {
    method: "PATCH",
    body: payload,
  });
}
