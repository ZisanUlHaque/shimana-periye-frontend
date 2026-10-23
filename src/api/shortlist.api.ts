import apiClient from "@/lib/apiClient";
import type {
  ICreateShortlistPayload,
  IUpdateShortlistPayload,
} from "@/types/shortlist.type";

export function addToShortlist(payload: ICreateShortlistPayload) {
  return apiClient("/shortlist", { method: "POST", body: payload });
}

export function getMyShortlist() {
  return apiClient("/shortlist");
}

export function compareShortlistItems(ids: string[]) {
  const query = ids.join(",");
  return apiClient(`/shortlist/compare?ids=${encodeURIComponent(query)}`);
}

export function updateShortlistNotes(id: string, payload: IUpdateShortlistPayload) {
  return apiClient(`/shortlist/${id}`, { method: "PATCH", body: payload });
}

export function removeFromShortlist(id: string) {
  return apiClient(`/shortlist/${id}`, { method: "DELETE" });
}

export function getStudentShortlistForMentor(studentProfileId: string) {
  return apiClient(`/shortlist/student/${studentProfileId}`);
}