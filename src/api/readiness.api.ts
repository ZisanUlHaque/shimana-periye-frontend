import apiClient from "@/lib/apiClient";
import type { IApiResponse } from "@/types/api.type";
import type { IReadinessResult } from "@/types/readiness.type";

export function getMyReadiness() {
  return apiClient<IApiResponse<IReadinessResult>>("/readiness/me");
}

export function getReadinessForMentor(studentProfileId: string) {
  return apiClient<IApiResponse<IReadinessResult>>(`/readiness/student/${studentProfileId}`);
}
