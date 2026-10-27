import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addNewDocumentVersion,
  createDocument,
  deleteDocument,
  getAiFeedbackForDocument,
  getDocumentById,
  getDocumentsForMentor,
  getMyDocuments,
  updateDocument,
  updateVersionReviewStatus,
} from "@/api/document.api";
import { toast } from "@/components/ui/toast";
import { STUDENT_COMPLETENESS_QUERY_KEY } from "./student-profile.hook";

export const DOCUMENTS_QUERY_KEY = ["documents"];

export function useGetMyDocuments() {
  return useQuery({
    queryKey: DOCUMENTS_QUERY_KEY,
    queryFn: getMyDocuments,
  });
}

export function useGetDocument(id: string) {
  return useQuery({
    queryKey: [...DOCUMENTS_QUERY_KEY, id],
    queryFn: () => getDocumentById(id),
    enabled: Boolean(id),
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: STUDENT_COMPLETENESS_QUERY_KEY,
      });
      queryClient.invalidateQueries({ queryKey: ["readiness"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.add({
        title: "Document uploaded",
        description: "Your document file has been uploaded.",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Upload failed",
        description: error?.message ?? "Failed to upload document file.",
        type: "error",
      });
    },
  });
}

export function useAddNewDocumentVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addNewDocumentVersion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY });
      toast.add({
        title: "New version added",
        description: "Document version updated successfully.",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Version upload failed",
        description: error?.message ?? "Failed to upload new version.",
        type: "error",
      });
    },
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY });
      toast.add({
        title: "Document updated",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to update document",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: STUDENT_COMPLETENESS_QUERY_KEY,
      });
      toast.add({
        title: "Document deleted",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to delete document",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}

export function useGetAiFeedback() {
  return useMutation({
    mutationFn: (id: string) => getAiFeedbackForDocument(id),
    onError: (error: any) => {
      toast.add({
        title: "AI Review failed",
        description: error?.message ?? "Could not generate feedback.",
        type: "error",
      });
    },
  });
}

export function useGetDocumentsForMentor(
  studentProfileId?: string,
  applicationId?: string,
) {
  return useQuery({
    queryKey: [
      ...DOCUMENTS_QUERY_KEY,
      "mentor",
      studentProfileId,
      applicationId,
    ],
    queryFn: () =>
      getDocumentsForMentor(studentProfileId as string, applicationId),
    enabled: Boolean(studentProfileId),
  });
}

export function useUpdateVersionReviewStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      versionId,
      reviewStatus,
    }: {
      versionId: string;
      reviewStatus: string;
    }) => updateVersionReviewStatus(versionId, reviewStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "mentor"] });
      toast.add({
        title: "Review status updated",
        description: "Student has been notified of your review decision.",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to update review status",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}
