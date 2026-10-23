import apiClient from "@/lib/apiClient";
import type {
  ICreateRequirementPayload,
  IUpdateRequirementParams,
} from "@/types/requirement.type";

export function getRequirementsByOpportunity(opportunityId: string) {
  return apiClient(`/opportunities/${opportunityId}/requirements`);
}

export function getRequirementById(opportunityId: string, requirementId: string) {
  return apiClient(`/opportunities/${opportunityId}/requirements/${requirementId}`);
}

export function createRequirement(
  opportunityId: string,
  payload: ICreateRequirementPayload,
) {
  return apiClient(`/opportunities/${opportunityId}/requirements`, {
    method: "POST",
    body: payload,
  });
}

export function updateRequirement({
  opportunityId,
  requirementId,
  payload,
}: IUpdateRequirementParams) {
  return apiClient(`/opportunities/${opportunityId}/requirements/${requirementId}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteRequirement(opportunityId: string, requirementId: string) {
  return apiClient(`/opportunities/${opportunityId}/requirements/${requirementId}`, {
    method: "DELETE",
  });
}
