import apiClient from "@/lib/apiClient";
import type { IApiListResponse, IApiResponse } from "@/types/api.type";
import type {
  ICreateOpportunityPayload,
  IDeadlineChangeLog,
  IOpportunity,
  IOpportunityDetail,
  IOpportunityListParams,
  IUpdateOpportunityPayload,
} from "@/types/opportunity.type";

const buildQueryString = (params?: Record<string, unknown>) => {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
};

const createOpportunity = (payload: ICreateOpportunityPayload) =>
  apiClient<IApiResponse<IOpportunity>>("/opportunities", {
    method: "POST",
    body: payload,
  });

const getAllOpportunities = (params?: IOpportunityListParams) =>
  apiClient<IApiListResponse<IOpportunity>>(
    `/opportunities${buildQueryString(params as Record<string, unknown>)}`,
  );

const getOpportunityById = (id: string) =>
  apiClient<IApiResponse<IOpportunityDetail>>(`/opportunities/${id}`);

const updateOpportunity = (id: string, payload: IUpdateOpportunityPayload) =>
  apiClient<IApiResponse<IOpportunity>>(`/opportunities/${id}`, {
    method: "PATCH",
    body: payload,
  });

const deleteOpportunity = (id: string) =>
  apiClient<IApiResponse<null>>(`/opportunities/${id}`, { method: "DELETE" });

const getDeadlineChangeLogs = (opportunityId: string) =>
  apiClient<IApiResponse<IDeadlineChangeLog[]>>(
    `/opportunities/${opportunityId}/deadline-logs`,
  );

export const OpportunityApi = {
  createOpportunity,
  getAllOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  getDeadlineChangeLogs,
};