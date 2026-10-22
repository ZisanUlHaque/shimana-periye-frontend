import {
  createAcademicRecord,
  deleteAcademicRecord,
  getMyAcademicRecords,
  updateAcademicRecord,
} from "@/api/academic-record.api";
import { toast } from "@/components/ui/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const ACADEMIC_RECORDS_QUERY_KEY = ["academic-records"];

export function useGetMyAcademicRecords() {
  return useQuery({
    queryKey: ACADEMIC_RECORDS_QUERY_KEY,
    queryFn: getMyAcademicRecords,
  });
}

export function useCreateAcademicRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAcademicRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACADEMIC_RECORDS_QUERY_KEY });
      toast.add({
        title: "Record added",
        description: "Your academic record has been saved.",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to add record",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}

export function useUpdateAcademicRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAcademicRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACADEMIC_RECORDS_QUERY_KEY });
      toast.add({
        title: "Record updated",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to update record",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}

export function useDeleteAcademicRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAcademicRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACADEMIC_RECORDS_QUERY_KEY });
      toast.add({
        title: "Record deleted",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to delete record",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}