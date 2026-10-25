import apiClient from "@/lib/apiClient";
import type { IApiResponse } from "@/types/api.type";
import type {
  IFunding,
  ICreateFundingPayload,
  IUpdateFundingPayload,
  IUpdateFundingStatusPayload,
} from "@/types/funding.type";

export function getMyFundings() {
  return apiClient<IApiResponse<IFunding[]>>("/fundings");
}

export function createFunding(payload: ICreateFundingPayload) {
  return apiClient<IApiResponse<IFunding>>("/fundings", {
    method: "POST",
    body: payload,
  });
}

export function updateFunding(id: string, payload: IUpdateFundingPayload) {
  return apiClient<IApiResponse<IFunding>>(`/fundings/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function updateFundingStatus(id: string, payload: IUpdateFundingStatusPayload) {
  return apiClient<IApiResponse<IFunding>>(`/fundings/${id}/status`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteFunding(id: string) {
  return apiClient<IApiResponse<null>>(`/fundings/${id}`, {
    method: "DELETE",
  });
}

export function getFundingsForMentor(studentProfileId: string) {
  return apiClient<IApiResponse<IFunding[]>>(`/fundings/student/${studentProfileId}`);
}

export function getCatalogFundingsForOpportunity(opportunityId: string) {
  return apiClient<IApiResponse<IFunding[]>>(`/fundings/opportunity/${opportunityId}`);
}
