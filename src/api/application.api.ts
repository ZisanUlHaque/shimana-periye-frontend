import apiClient from "@/lib/apiClient";
import type {
  IApplication,
  IStartApplicationPayload,
  IUpdateApplicationStatusParams,
  IRecordDecisionParams,
  IRecordInterviewParams,
} from "@/types/application.type";

export function startApplication(payload: IStartApplicationPayload) {
  return apiClient<{ success: boolean; data: IApplication }>("/applications", {
    method: "POST",
    body: payload,
  });
}

export function getMyApplications() {
  return apiClient<{ success: boolean; data: IApplication[] }>("/applications");
}

export function getApplicationById(id: string) {
  return apiClient<{ success: boolean; data: IApplication }>(`/applications/${id}`);
}

export function updateApplicationStatus({ id, payload }: IUpdateApplicationStatusParams) {
  return apiClient<{ success: boolean; data: IApplication }>(`/applications/${id}/status`, {
    method: "PATCH",
    body: payload,
  });
}

export function recordInterview({ id, payload }: IRecordInterviewParams) {
  return apiClient<{ success: boolean; data: IApplication }>(`/applications/${id}/interview`, {
    method: "PATCH",
    body: payload,
  });
}

export function recordDecision({ id, payload }: IRecordDecisionParams) {
  return apiClient<{ success: boolean; data: IApplication }>(`/applications/${id}/decision`, {
    method: "PATCH",
    body: payload,
  });
}

export function getApplicationForMentor(id: string) {
  return apiClient<{ success: boolean; data: IApplication }>(`/applications/mentor/${id}`);
}
