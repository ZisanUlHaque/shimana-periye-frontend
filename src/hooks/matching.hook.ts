import {
  getAiMatchExplanation,
  getMatchResult,
  recomputeMatchResult,
} from "@/api/matching.api";
import { toast } from "@/components/ui/toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const MATCHING_QUERY_KEY = ["matching"];

export function useGetMatchResult(opportunityId: string) {
  return useQuery({
    queryKey: [...MATCHING_QUERY_KEY, opportunityId],
    queryFn: () => getMatchResult(opportunityId),
    enabled: Boolean(opportunityId),
  });
}

export function useRecomputeMatchResult(opportunityId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => recomputeMatchResult(opportunityId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...MATCHING_QUERY_KEY, opportunityId],
      });
      toast.add({
        title: "Match score recomputed",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Recompute failed",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}

export function useGetAiMatchExplanation(opportunityId: string) {
  return useMutation({
    mutationFn: () => getAiMatchExplanation(opportunityId),
    onError: (error: any) => {
      toast.add({
        title: "AI Explanation failed",
        description: error?.message ?? "Could not generate fit explanation.",
        type: "error",
      });
    },
  });
}
