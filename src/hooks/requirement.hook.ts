import {
  createRequirement,
  deleteRequirement,
  getRequirementsByOpportunity,
  updateRequirement,
} from "@/api/requirement.api";
import { toast } from "@/components/ui/toast";
import type {
  ICreateRequirementPayload,
  IUpdateRequirementParams,
} from "@/types/requirement.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const REQUIREMENTS_QUERY_KEY = ["requirements"];

export function useRequirements(opportunityId: string) {
  return useQuery({
    queryKey: [...REQUIREMENTS_QUERY_KEY, opportunityId],
    queryFn: () => getRequirementsByOpportunity(opportunityId),
    enabled: Boolean(opportunityId),
  });
}

export function useCreateRequirement(opportunityId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateRequirementPayload) =>
      createRequirement(opportunityId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...REQUIREMENTS_QUERY_KEY, opportunityId],
      });
      toast.add({
        title: "Requirement added",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to add requirement",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}

export function useUpdateRequirement(opportunityId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: IUpdateRequirementParams) => updateRequirement(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...REQUIREMENTS_QUERY_KEY, opportunityId],
      });
      toast.add({
        title: "Requirement updated",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to update requirement",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}

export function useDeleteRequirement(opportunityId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requirementId: string) =>
      deleteRequirement(opportunityId, requirementId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...REQUIREMENTS_QUERY_KEY, opportunityId],
      });
      toast.add({
        title: "Requirement deleted",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to delete requirement",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}
