"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OpportunityApi } from "@/api/opportunity.api";
import { toast } from "@/components/ui/toast";
import type {
  ICreateOpportunityPayload,
  IOpportunityListParams,
  IUpdateOpportunityPayload,
} from "@/types/opportunity.type";

export const OPPORTUNITIES_QUERY_KEY = (params?: IOpportunityListParams) =>
  ["opportunities", params] as const;
export const OPPORTUNITY_QUERY_KEY = (id: string) => ["opportunity", id] as const;
export const DEADLINE_LOGS_QUERY_KEY = (id: string) =>
  ["opportunity-deadline-logs", id] as const;

export const useOpportunities = (params?: IOpportunityListParams) =>
  useQuery({
    queryKey: OPPORTUNITIES_QUERY_KEY(params),
    queryFn: async () => {
      const res = await OpportunityApi.getAllOpportunities(params);
      return { data: res.data, meta: res.meta };
    },
  });

export const useOpportunity = (id: string) =>
  useQuery({
    queryKey: OPPORTUNITY_QUERY_KEY(id),
    queryFn: async () => (await OpportunityApi.getOpportunityById(id)).data,
    enabled: !!id,
  });

export const useOpportunityDeadlineLogs = (id: string) =>
  useQuery({
    queryKey: DEADLINE_LOGS_QUERY_KEY(id),
    queryFn: async () => (await OpportunityApi.getDeadlineChangeLogs(id)).data,
    enabled: !!id,
  });

export const useCreateOpportunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateOpportunityPayload) =>
      OpportunityApi.createOpportunity(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
      toast.add({ title: "Opportunity created", type: "success" });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to create opportunity",
        description: error?.data?.message ?? "Something went wrong",
        type: "error",
      });
    },
  });
};

export const useUpdateOpportunity = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IUpdateOpportunityPayload) =>
      OpportunityApi.updateOpportunity(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
      queryClient.invalidateQueries({ queryKey: OPPORTUNITY_QUERY_KEY(id) });
      queryClient.invalidateQueries({ queryKey: DEADLINE_LOGS_QUERY_KEY(id) });
      toast.add({ title: "Opportunity updated", type: "success" });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to update opportunity",
        description: error?.data?.message ?? "Something went wrong",
        type: "error",
      });
    },
  });
};

export const useDeleteOpportunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => OpportunityApi.deleteOpportunity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
      toast.add({ title: "Opportunity deleted", type: "success" });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to delete opportunity",
        description: error?.data?.message ?? "Something went wrong",
        type: "error",
      });
    },
  });
};