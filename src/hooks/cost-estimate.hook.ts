import {
  getCostEstimate,
  upsertCostEstimate,
} from "@/api/cost-estimate.api";
import { toast } from "@/components/ui/toast";
import type { IUpsertCostEstimatePayload } from "@/types/cost-estimate.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const COST_ESTIMATE_QUERY_KEY = ["cost-estimates"];

export function useGetCostEstimate(applicationId: string) {
  return useQuery({
    queryKey: [...COST_ESTIMATE_QUERY_KEY, applicationId],
    queryFn: () => getCostEstimate(applicationId),
    enabled: Boolean(applicationId),
  });
}

export function useUpsertCostEstimate(applicationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IUpsertCostEstimatePayload) =>
      upsertCostEstimate(applicationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...COST_ESTIMATE_QUERY_KEY, applicationId],
      });
      toast.add({
        title: "Cost estimate saved",
        description: "Your financial calculations have been updated.",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to save estimate",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}
