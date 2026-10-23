import {
  createPublication,
  deletePublication,
  getMyPublications,
  updatePublication,
} from "@/api/publication.api";
import { STUDENT_COMPLETENESS_QUERY_KEY } from "./student-profile.hook";
import { toast } from "@/components/ui/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const PUBLICATIONS_QUERY_KEY = ["publications"];

export function useGetMyPublications() {
  return useQuery({
    queryKey: PUBLICATIONS_QUERY_KEY,
    queryFn: getMyPublications,
  });
}

export function useCreatePublication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPublication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PUBLICATIONS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: STUDENT_COMPLETENESS_QUERY_KEY,
      });
      toast.add({
        title: "Publication added",
        description: "Your publication record has been saved.",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to add publication",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}

export function useUpdatePublication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePublication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PUBLICATIONS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: STUDENT_COMPLETENESS_QUERY_KEY,
      });
      toast.add({
        title: "Publication updated",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to update publication",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}

export function useDeletePublication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePublication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PUBLICATIONS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: STUDENT_COMPLETENESS_QUERY_KEY,
      });
      toast.add({
        title: "Publication deleted",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to delete publication",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}
