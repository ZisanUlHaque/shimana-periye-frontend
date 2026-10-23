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

  const bodyData: any = {
    type: payload.type,
  };
  if (payload.applicationId && payload.applicationId.trim() !== "") {
    bodyData.applicationId = payload.applicationId.trim();
  }

  // Support both body JSON field and direct form fields
  formData.append("body", JSON.stringify(bodyData));
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
