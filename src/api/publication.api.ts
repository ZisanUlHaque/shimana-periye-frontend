import apiClient from "@/lib/apiClient";
import type {
  ICreatePublicationPayload,
  IUpdatePublicationParams,
} from "@/types/publication.type";

export function getMyPublications() {
  return apiClient("/publications");
}

export function createPublication(payload: ICreatePublicationPayload) {
  return apiClient("/publications", {
    method: "POST",
    body: payload,
  });
}

export function updatePublication({ id, payload }: IUpdatePublicationParams) {
  return apiClient(`/publications/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deletePublication(id: string) {
  return apiClient(`/publications/${id}`, {
    method: "DELETE",
  });
}
