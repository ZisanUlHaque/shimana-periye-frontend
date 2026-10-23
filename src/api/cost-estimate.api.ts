import apiClient from "@/lib/apiClient";
import type { IUpsertCostEstimatePayload } from "@/types/cost-estimate.type";

export function getCostEstimate(applicationId: string) {
  return apiClient(`/cost-estimates/${applicationId}`);
}

export function upsertCostEstimate(
  applicationId: string,
  payload: IUpsertCostEstimatePayload,
) {
  return apiClient(`/cost-estimates/${applicationId}`, {
    method: "PUT",
    body: {
      body: payload,
      ...payload,
    },
  });
}
