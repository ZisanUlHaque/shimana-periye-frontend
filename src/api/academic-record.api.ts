import apiClient from "@/lib/apiClient";
import type {
  ICreateAcademicRecordPayload,
  IUpdateAcademicRecordParams,
} from "@/types/academic-record.type";

export function createAcademicRecord(payload: ICreateAcademicRecordPayload) {
  return apiClient("/academic-records", { method: "POST", body: payload });
}

export function getMyAcademicRecords() {
  return apiClient("/academic-records");
}

export function updateAcademicRecord({
  id,
  payload,
}: IUpdateAcademicRecordParams) {
  return apiClient(`/academic-records/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteAcademicRecord(id: string) {
  return apiClient(`/academic-records/${id}`, { method: "DELETE" });
}