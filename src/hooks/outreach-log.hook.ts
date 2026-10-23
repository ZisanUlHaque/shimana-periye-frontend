import {
  createOutreachLog,
  deleteOutreachLog,
  getMyOutreachLogs,
  markOutreachReplyReceived,
  updateOutreachLog,
} from "@/api/outreach-log.api";
import { toast } from "@/components/ui/toast";
import type {
  ICreateOutreachLogPayload,
  IMarkReplyReceivedPayload,
  IUpdateOutreachLogParams,
} from "@/types/outreach-log.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const OUTREACH_LOGS_QUERY_KEY = ["outreach-logs"];

export function useGetMyOutreachLogs() {
  return useQuery({
    queryKey: OUTREACH_LOGS_QUERY_KEY,
    queryFn: getMyOutreachLogs,
  });
}

export function useCreateOutreachLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateOutreachLogPayload) =>
      createOutreachLog(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OUTREACH_LOGS_QUERY_KEY });
      toast.add({
        title: "Outreach logged",
        description: "Professor contact attempt has been recorded.",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to log outreach",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}

export function useUpdateOutreachLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: IUpdateOutreachLogParams) => updateOutreachLog(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OUTREACH_LOGS_QUERY_KEY });
      toast.add({
        title: "Outreach log updated",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to update outreach",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}

export function useMarkOutreachReplyReceived() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload?: IMarkReplyReceivedPayload;
    }) => markOutreachReplyReceived(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OUTREACH_LOGS_QUERY_KEY });
      toast.add({
        title: "Reply recorded",
        description: "Professor response has been marked.",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to record reply",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}

export function useDeleteOutreachLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteOutreachLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OUTREACH_LOGS_QUERY_KEY });
      toast.add({
        title: "Outreach log deleted",
        type: "success",
      });
    },
    onError: (error: any) => {
      toast.add({
        title: "Failed to delete outreach log",
        description: error?.message ?? "Something went wrong.",
        type: "error",
      });
    },
  });
}
