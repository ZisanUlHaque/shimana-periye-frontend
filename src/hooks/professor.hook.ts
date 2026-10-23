import {
  createProfessor,
  deleteProfessor,
  getAllProfessors,
  getProfessorById,
  updateProfessor,
} from "@/api/professor.api";
import { toast } from "@/components/ui/toast";
import type { IProfessorFilters } from "@/types/professor.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const PROFESSORS_QUERY_KEY = ["professors"];

export function useProfessors(filters?: IProfessorFilters) {
  return useQuery({
    queryKey: [...PROFESSORS_QUERY_KEY, filters],
    queryFn: () => getAllProfessors(filters),
  });
}

export function useProfessor(id: string) {
  return useQuery({
    queryKey: [...PROFESSORS_QUERY_KEY, id],
    queryFn: () => getProfessorById(id),
    enabled: Boolean(id),
  });
}

export function useCreateProfessor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProfessor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFESSORS_QUERY_KEY });
      toast.add({
        title: "Professor created",
        description: "Professor record has been saved.",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to create professor",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}

export function useUpdateProfessor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfessor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFESSORS_QUERY_KEY });
      toast.add({
        title: "Professor updated",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to update professor",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}

export function useDeleteProfessor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProfessor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFESSORS_QUERY_KEY });
      toast.add({
        title: "Professor deleted",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to delete professor",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}
