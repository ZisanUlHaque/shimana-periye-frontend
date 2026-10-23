import apiClient from "@/lib/apiClient";
import type {
  ICreateProfessorPayload,
  IProfessorFilters,
  IUpdateProfessorParams,
} from "@/types/professor.type";

export function getAllProfessors(filters?: IProfessorFilters) {
  const params = new URLSearchParams();
  if (filters?.searchTerm) params.append("searchTerm", filters.searchTerm);
  if (filters?.universityId) params.append("universityId", filters.universityId);
  if (filters?.labId) params.append("labId", filters.labId);
  if (filters?.researchArea) params.append("researchArea", filters.researchArea);

  const query = params.toString();
  return apiClient(`/professors${query ? `?${query}` : ""}`);
}

export function getProfessorById(id: string) {
  return apiClient(`/professors/${id}`);
}

export function createProfessor(payload: ICreateProfessorPayload) {
  return apiClient("/professors", {
    method: "POST",
    body: payload,
  });
}

export function updateProfessor({ id, payload }: IUpdateProfessorParams) {
  return apiClient(`/professors/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteProfessor(id: string) {
  return apiClient(`/professors/${id}`, {
    method: "DELETE",
  });
}
