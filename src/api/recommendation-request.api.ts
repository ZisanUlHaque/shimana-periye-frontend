import apiClient from "@/lib/apiClient";
import type {
  ICreateRecommendationRequestPayload,
  IUpdateRecommendationRequestParams,
  IUpdateRecommendationStatusParams,
} from "@/types/recommendation-request.type";

export function getMyRecommendationRequests() {
  return apiClient("/recommendation-requests");
}

export function createRecommendationRequest(
  payload: ICreateRecommendationRequestPayload,
) {
  const reqData: any = {
    professorName: payload.professorName,
  };
  if (payload.professorEmail && payload.professorEmail.trim() !== "") {
    reqData.professorEmail = payload.professorEmail.trim();
  }
  if (payload.applicationId && payload.applicationId.trim() !== "") {
    reqData.applicationId = payload.applicationId.trim();
  }
  if (payload.followUpAt && payload.followUpAt.trim() !== "") {
    reqData.followUpAt = new Date(payload.followUpAt).toISOString();
  }

  return apiClient("/recommendation-requests", {
    method: "POST",
    body: {
      body: reqData,
      ...reqData,
    },
  });
}

export function updateRecommendationRequest({
  id,
  payload,
}: IUpdateRecommendationRequestParams) {
  const reqData: any = {};
  if (payload.professorName) reqData.professorName = payload.professorName;
  if (payload.professorEmail !== undefined) {
    reqData.professorEmail = payload.professorEmail ? payload.professorEmail.trim() : undefined;
  }
  if (payload.followUpAt !== undefined) {
    reqData.followUpAt = payload.followUpAt ? new Date(payload.followUpAt).toISOString() : null;
  }

  return apiClient(`/recommendation-requests/${id}`, {
    method: "PATCH",
    body: {
      body: reqData,
      ...reqData,
    },
  });
}

export function updateRecommendationStatus({
  id,
  status,
}: IUpdateRecommendationStatusParams) {
  return apiClient(`/recommendation-requests/${id}/status`, {
    method: "PATCH",
    body: {
      body: { status },
      status,
    },
  });
}

export function deleteRecommendationRequest(id: string) {
  return apiClient(`/recommendation-requests/${id}`, {
    method: "DELETE",
  });
}
