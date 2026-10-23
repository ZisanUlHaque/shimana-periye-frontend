import apiClient from "@/lib/apiClient";

export function getMatchResult(opportunityId: string) {
  return apiClient(`/matching/${opportunityId}`);
}

export function recomputeMatchResult(opportunityId: string) {
  return apiClient(`/matching/${opportunityId}/recompute`, {
    method: "POST",
  });
}

export function getAiMatchExplanation(opportunityId: string) {
  return apiClient(`/matching/${opportunityId}/ai-explain`, {
    method: "POST",
  });
}
