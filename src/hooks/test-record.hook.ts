import {
  createTestRecord,
  deleteTestRecord,
  getMyTestRecords,
  updateTestRecord,
} from "@/api/test-record.api";
import { STUDENT_COMPLETENESS_QUERY_KEY } from "./student-profile.hook";
import { toast } from "@/components/ui/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const TEST_RECORDS_QUERY_KEY = ["test-records"];

export function useGetMyTestRecords() {
  return useQuery({
    queryKey: TEST_RECORDS_QUERY_KEY,
    queryFn: getMyTestRecords,
  });
}

export function useCreateTestRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTestRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEST_RECORDS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: STUDENT_COMPLETENESS_QUERY_KEY,
      });
      toast.add({
        title: "Test score added",
        description: "Your test record has been saved.",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to add test record",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}

export function useUpdateTestRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTestRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEST_RECORDS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: STUDENT_COMPLETENESS_QUERY_KEY,
      });
      toast.add({
        title: "Test score updated",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to update test record",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}

export function useDeleteTestRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTestRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEST_RECORDS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: STUDENT_COMPLETENESS_QUERY_KEY,
      });
      toast.add({
        title: "Test score deleted",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to delete test record",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}
