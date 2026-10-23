import {
  createExperience,
  deleteExperience,
  getMyExperiences,
  updateExperience,
} from "@/api/experience.api";
import { STUDENT_COMPLETENESS_QUERY_KEY } from "./student-profile.hook";
import { toast } from "@/components/ui/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const EXPERIENCES_QUERY_KEY = ["experiences"];

export function useGetMyExperiences() {
  return useQuery({
    queryKey: EXPERIENCES_QUERY_KEY,
    queryFn: getMyExperiences,
  });
}

export function useCreateExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPERIENCES_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: STUDENT_COMPLETENESS_QUERY_KEY,
      });
      toast.add({
        title: "Experience added",
        description: "Your work or research experience has been saved.",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to add experience",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}

export function useUpdateExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPERIENCES_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: STUDENT_COMPLETENESS_QUERY_KEY,
      });
      toast.add({
        title: "Experience updated",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to update experience",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPERIENCES_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: STUDENT_COMPLETENESS_QUERY_KEY,
      });
      toast.add({
        title: "Experience deleted",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to delete experience",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}
