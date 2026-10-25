import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import {
  getMyFundings,
  createFunding,
  updateFunding,
  updateFundingStatus,
  deleteFunding,
  getCatalogFundingsForOpportunity,
} from "@/api/funding.api";
import type {
  ICreateFundingPayload,
  IUpdateFundingPayload,
  IUpdateFundingStatusPayload,
} from "@/types/funding.type";

export const FUNDING_KEYS = {
  my: ["fundings", "my"] as const,
  opportunity: (oppId: string) => ["fundings", "opportunity", oppId] as const,
};

export function useMyFundings() {
  return useQuery({
    queryKey: FUNDING_KEYS.my,
    queryFn: getMyFundings,
  });
}

export function useOpportunityFundings(oppId: string) {
  return useQuery({
    queryKey: FUNDING_KEYS.opportunity(oppId),
    queryFn: () => getCatalogFundingsForOpportunity(oppId),
    enabled: Boolean(oppId),
  });
}

export function useCreateFunding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateFundingPayload) => createFunding(payload),
    onSuccess: () => {
      toast.add({ title: "Funding record added!", type: "success" });
      queryClient.invalidateQueries({ queryKey: FUNDING_KEYS.my });
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to add funding record",
        description: err?.message,
        type: "error",
      });
    },
  });
}

export function useUpdateFunding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: IUpdateFundingPayload }) =>
      updateFunding(id, payload),
    onSuccess: () => {
      toast.add({ title: "Funding record updated!", type: "success" });
      queryClient.invalidateQueries({ queryKey: FUNDING_KEYS.my });
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to update funding",
        description: err?.message,
        type: "error",
      });
    },
  });
}

export function useUpdateFundingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: IUpdateFundingStatusPayload;
    }) => updateFundingStatus(id, payload),
    onSuccess: () => {
      toast.add({ title: "Funding status updated!", type: "success" });
      queryClient.invalidateQueries({ queryKey: FUNDING_KEYS.my });
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to update status",
        description: err?.message,
        type: "error",
      });
    },
  });
}

export function useDeleteFunding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFunding(id),
    onSuccess: () => {
      toast.add({ title: "Funding record removed", type: "success" });
      queryClient.invalidateQueries({ queryKey: FUNDING_KEYS.my });
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to delete funding",
        description: err?.message,
        type: "error",
      });
    },
  });
}
