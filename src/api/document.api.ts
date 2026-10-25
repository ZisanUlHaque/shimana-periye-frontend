import apiClient from "@/lib/apiClient";
import type {
  ICreateDocumentPayload,
  IAddNewVersionPayload,
  IUpdateDocumentParams,
} from "@/types/document.type";

export function getMyDocuments() {
  return apiClient("/documents");
}

export function getDocumentById(id: string) {
  return apiClient(`/documents/${id}`);
}

export function createDocument(payload: ICreateDocumentPayload) {
  const formData = new FormData();
  formData.append("file", payload.file);
  formData.append("type", payload.type);

  if (payload.applicationId && payload.applicationId.trim() !== "") {
    formData.append("applicationId", payload.applicationId.trim());
  }

  return apiClient("/documents", {
    method: "POST",
    body: formData,
  });
}

export function addNewDocumentVersion(payload: IAddNewVersionPayload) {
  const formData = new FormData();
  formData.append("file", payload.file);

  return apiClient(`/documents/${payload.documentId}/versions`, {
    method: "POST",
    body: formData,
  });
}

export function updateDocument({ id, payload }: IUpdateDocumentParams) {
  return apiClient(`/documents/${id}`, {
    method: "PATCH",
    body: {
      body: payload,
      ...payload,
    },
  });
}

export function deleteDocument(id: string) {
  return apiClient(`/documents/${id}`, {
    method: "DELETE",
  });
}

export function getAiFeedbackForDocument(id: string) {
  return apiClient(`/documents/${id}/ai-feedback`, {
    method: "POST",
  });
}

export function getDocumentsForMentor(studentProfileId: string, applicationId?: string) {
  return apiClient(`/documents/student/${studentProfileId}${applicationId ? `?applicationId=${applicationId}` : ""}`);
}

export function updateVersionReviewStatus(versionId: string, reviewStatus: string) {
  return apiClient(`/documents/versions/${versionId}/review-status`, {
    method: "PATCH",
    body: { reviewStatus },
  });
}
