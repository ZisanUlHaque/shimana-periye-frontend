import apiClient from "@/lib/apiClient";
import type {
  ICreateLabPayload,
  ILabFilters,
  IUpdateLabParams,
} from "@/types/lab.type";

export function getAllLabs(filters?: ILabFilters) {
  const params = new URLSearchParams();
  if (filters?.searchTerm) params.append("searchTerm", filters.searchTerm);
  if (filters?.universityId) params.append("universityId", filters.universityId);
  if (filters?.focusArea) params.append("focusArea", filters.focusArea);

  const query = params.toString();
  return apiClient(`/labs${query ? `?${query}` : ""}`);
}

export function getLabById(id: string) {
  return apiClient(`/labs/${id}`);
}

export function createLab(payload: ICreateLabPayload) {
  return apiClient("/labs", {
    method: "POST",
    body: payload,
  });
}

export function updateLab({ id, payload }: IUpdateLabParams) {
  return apiClient(`/labs/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteLab(id: string) {
  return apiClient(`/labs/${id}`, {
    method: "DELETE",
  });
}
