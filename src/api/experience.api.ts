import apiClient from "@/lib/apiClient";
import type {
  ICreateExperiencePayload,
  IUpdateExperienceParams,
} from "@/types/experience.type";

export function getMyExperiences() {
  return apiClient("/experiences");
}

export function createExperience(payload: ICreateExperiencePayload) {
  return apiClient("/experiences", {
    method: "POST",
    body: payload,
  });
}

export function updateExperience({ id, payload }: IUpdateExperienceParams) {
  return apiClient(`/experiences/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteExperience(id: string) {
  return apiClient(`/experiences/${id}`, {
    method: "DELETE",
  });
}
