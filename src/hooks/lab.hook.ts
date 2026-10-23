import {
  createLab,
  deleteLab,
  getAllLabs,
  getLabById,
  updateLab,
} from "@/api/lab.api";
import { toast } from "@/components/ui/toast";
import type { ILabFilters } from "@/types/lab.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const LABS_QUERY_KEY = ["labs"];

export function useLabs(filters?: ILabFilters) {
  return useQuery({
    queryKey: [...LABS_QUERY_KEY, filters],
    queryFn: () => getAllLabs(filters),
  });
}

export function useLab(id: string) {
  return useQuery({
    queryKey: [...LABS_QUERY_KEY, id],
    queryFn: () => getLabById(id),
    enabled: Boolean(id),
  });
}

export function useCreateLab() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLab,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LABS_QUERY_KEY });
      toast.add({
        title: "Lab created",
        description: "Research lab record has been saved.",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to create lab",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}

export function useUpdateLab() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLab,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LABS_QUERY_KEY });
      toast.add({
        title: "Lab updated",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to update lab",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}

export function useDeleteLab() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLab,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LABS_QUERY_KEY });
      toast.add({
        title: "Lab deleted",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to delete lab",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}
