import apiClient from "@/lib/apiClient";
import type {
  ICreateTestRecordPayload,
  IUpdateTestRecordParams,
} from "@/types/test-record.type";

export function getMyTestRecords() {
  return apiClient("/test-records");
}

export function createTestRecord(payload: ICreateTestRecordPayload) {
  return apiClient("/test-records", {
    method: "POST",
    body: payload,
  });
}

export function updateTestRecord({ id, payload }: IUpdateTestRecordParams) {
  return apiClient(`/test-records/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteTestRecord(id: string) {
  return apiClient(`/test-records/${id}`, {
    method: "DELETE",
  });
}
