import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import {
  createOpportunity,
  getAllOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity,
  getDeadlineChangeLogs,
} from "@/api/opportunity.api";
import type {
  ICreateOpportunityPayload,
  IUpdateOpportunityParams,
  IOpportunityFilters,
} from "@/types/opportunity.type";

export const OPPORTUNITIES_QUERY_KEY = (filters?: IOpportunityFilters) =>
  ["opportunities", filters ?? {}] as const;
export const OPPORTUNITY_QUERY_KEY = (id: string) => ["opportunities", id] as const;
export const OPPORTUNITY_DEADLINE_LOGS_QUERY_KEY = (id: string) =>
  ["opportunities", id, "deadline-logs"] as const;

export const useGetAllOpportunities = (filters?: IOpportunityFilters) =>
  useQuery({
    queryKey: OPPORTUNITIES_QUERY_KEY(filters),
    queryFn: () => getAllOpportunities(filters),
  });

export const useGetOpportunityById = (id: string) =>
  useQuery({
    queryKey: OPPORTUNITY_QUERY_KEY(id),
    queryFn: () => getOpportunityById(id),
    enabled: Boolean(id),
  });

export const useGetDeadlineChangeLogs = (id: string) =>
  useQuery({
    queryKey: OPPORTUNITY_DEADLINE_LOGS_QUERY_KEY(id),
    queryFn: () => getDeadlineChangeLogs(id),
    enabled: Boolean(id),
  });

export const useCreateOpportunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateOpportunityPayload) => createOpportunity(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
      toast.add({ title: "Opportunity created", description: "It is now visible to students.", type: "success" });
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to create opportunity",
        description: err?.data?.message || err?.message || "Something went wrong.",
        type: "error",
      });
    },
  });
};

export const useUpdateOpportunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: IUpdateOpportunityParams) => updateOpportunity(params),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
      queryClient.invalidateQueries({ queryKey: OPPORTUNITY_QUERY_KEY(variables.id) });
      toast.add({ title: "Opportunity updated", description: "Changes saved.", type: "success" });
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to update opportunity",
        description: err?.data?.message || err?.message || "Something went wrong.",
        type: "error",
      });
    },
  });
};

export const useDeleteOpportunity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteOpportunity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
      toast.add({ title: "Opportunity deleted", description: "It has been removed.", type: "success" });
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to delete opportunity",
        description: err?.data?.message || err?.message || "Something went wrong.",
        type: "error",
      });
    },
  });
};