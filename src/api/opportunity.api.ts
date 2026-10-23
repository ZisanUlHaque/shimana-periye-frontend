import apiClient from "@/lib/apiClient";
import type {
  IOpportunity,
  ICreateOpportunityPayload,
  IUpdateOpportunityParams,
  IOpportunityFilters,
  IDeadlineChangeLog,
} from "@/types/opportunity.type";

function buildQueryString(filters?: IOpportunityFilters) {
  if (!filters) return "";
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function createOpportunity(payload: ICreateOpportunityPayload) {
  return apiClient<{ success: boolean; data: IOpportunity }>("/opportunities", {
    method: "POST",
    body: payload,
  });
}

export function getAllOpportunities(filters?: IOpportunityFilters) {
  return apiClient<{ success: boolean; data: IOpportunity[] }>(
    `/opportunities${buildQueryString(filters)}`
  );
}

export function getOpportunityById(id: string) {
  return apiClient<{ success: boolean; data: IOpportunity }>(`/opportunities/${id}`);
}

export function updateOpportunity({ id, payload }: IUpdateOpportunityParams) {
  return apiClient<{ success: boolean; data: IOpportunity }>(`/opportunities/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteOpportunity(id: string) {
  return apiClient<{ success: boolean; data: null }>(`/opportunities/${id}`, {
    method: "DELETE",
  });
}

export function getDeadlineChangeLogs(id: string) {
  return apiClient<{ success: boolean; data: IDeadlineChangeLog[] }>(
    `/opportunities/${id}/deadline-logs`
  );
}
