import apiClient from "@/lib/apiClient";
import type { IUpdateStudentProfilePayload } from "@/types/student-profile.type";

export function getMyStudentProfile() {
  return apiClient("/student-profile/me");
}

export function updateMyStudentProfile(payload: IUpdateStudentProfilePayload) {
  return apiClient("/student-profile/me", {
    method: "PATCH",
    body: payload,
  });
}

export function getMyStudentProfileCompleteness() {
  return apiClient("/student-profile/me/completeness");
}

export function getStudentProfileForMentor(studentProfileId: string) {
  return apiClient(`/student-profile/${studentProfileId}`);
}
