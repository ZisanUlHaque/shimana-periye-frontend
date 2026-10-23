import apiClient from "@/lib/apiClient";
import type {
  ICreateUniversityPayload,
  IUniversityListParams,
  IUpdateUniversityPayload,
} from "@/types/university.type";

function buildQueryString(params?: IUniversityListParams) {
  if (!params) return "";
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });

  const result = query.toString();
  return result ? `?${result}` : "";
}

export function createUniversity(payload: ICreateUniversityPayload) {
  return apiClient("/universities", { method: "POST", body: payload });
}

export function getAllUniversities(params?: IUniversityListParams) {
  return apiClient(`/universities${buildQueryString(params)}`);
}

export function getUniversityById(id: string) {
  return apiClient(`/universities/${id}`);
}

export function updateUniversity(id: string, payload: IUpdateUniversityPayload) {
  return apiClient(`/universities/${id}`, { method: "PATCH", body: payload });
}

export function deleteUniversity(id: string) {
  return apiClient(`/universities/${id}`, { method: "DELETE" });
}