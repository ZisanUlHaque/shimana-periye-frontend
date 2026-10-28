import apiClient from "@/lib/apiClient";
import type { IApiResponse } from "@/types/api.type";
import type {
  IApplyAsMentorPayload,
  IVerifyMentorEmailPayload,
  IMentorApplicationStatus,
  IApproveMentorPayload,
  IMentorProfile,
} from "@/types/mentor-profile.type";

export function applyAsMentor(payload: IApplyAsMentorPayload | FormData) {
  let body: any = payload;
  if (!(payload instanceof FormData) && (payload as IApplyAsMentorPayload).file) {
    const p = payload as IApplyAsMentorPayload;
    const formData = new FormData();
    formData.append("name", p.name);
    formData.append("email", p.email);
    if (p.institution) formData.append("institution", p.institution);
    if (p.designation) formData.append("designation", p.designation);
    if (p.contactNumber) formData.append("contactNumber", p.contactNumber);
    if (p.bio) formData.append("bio", p.bio);
    if (p.expertise) formData.append("expertise", JSON.stringify(p.expertise));
    if (p.file) formData.append("file", p.file);
    body = formData;
  }

  return apiClient<IApiResponse<any>>("/mentor-profile/apply", {
    method: "POST",
    body,
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
