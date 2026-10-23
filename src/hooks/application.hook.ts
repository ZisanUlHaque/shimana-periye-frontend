import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import {
  startApplication,
  getMyApplications,
  getApplicationById,
  updateApplicationStatus,
  recordInterview,
  recordDecision,
  getApplicationForMentor,
} from "@/api/application.api";
import type {
  IStartApplicationPayload,
  IUpdateApplicationStatusParams,
  IRecordDecisionParams,
  IRecordInterviewParams,
} from "@/types/application.type";

export const APPLICATIONS_QUERY_KEY = ["applications"];
export const APPLICATION_QUERY_KEY = (id: string) => ["applications", id];
export const APPLICATION_MENTOR_QUERY_KEY = (id: string) => ["applications", "mentor", id];

export const useGetMyApplications = () => {
  return useQuery({
    queryKey: APPLICATIONS_QUERY_KEY,
    queryFn: getMyApplications,
  });
};

export const useGetApplicationById = (id: string) => {
  return useQuery({
    queryKey: APPLICATION_QUERY_KEY(id),
    queryFn: () => getApplicationById(id),
    enabled: Boolean(id),
  });
};

export const useGetApplicationForMentor = (id: string) => {
  return useQuery({
    queryKey: APPLICATION_MENTOR_QUERY_KEY(id),
    queryFn: () => getApplicationForMentor(id),
    enabled: Boolean(id),
  });
};

export const useStartApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IStartApplicationPayload) => startApplication(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATIONS_QUERY_KEY });
      toast.add({
        title: "Application started",
        description: "You can now work through the required tasks.",
        type: "success",
      });
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to start application",
        description: err?.data?.message || err?.message || "Something went wrong.",
        type: "error",
      });
    },
  });
};

export const useUpdateApplicationStatus = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IUpdateApplicationStatusParams["payload"]) =>
      updateApplicationStatus({ id, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_QUERY_KEY(id) });
      queryClient.invalidateQueries({ queryKey: APPLICATIONS_QUERY_KEY });
      toast.add({ title: "Status updated", description: "Application status changed.", type: "success" });
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to update status",
        description: err?.data?.message || err?.message || "Something went wrong.",
        type: "error",
      });
    },
  });
};

export const useRecordInterview = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IRecordInterviewParams["payload"]) => recordInterview({ id, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_QUERY_KEY(id) });
      queryClient.invalidateQueries({ queryKey: APPLICATIONS_QUERY_KEY });
      toast.add({ title: "Interview recorded", description: "Interview date has been saved.", type: "success" });
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to record interview",
        description: err?.data?.message || err?.message || "Something went wrong.",
        type: "error",
      });
    },
  });
};

export const useRecordDecision = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IRecordDecisionParams["payload"]) => recordDecision({ id, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_QUERY_KEY(id) });
      queryClient.invalidateQueries({ queryKey: APPLICATIONS_QUERY_KEY });
      toast.add({ title: "Decision recorded", description: "The decision has been saved.", type: "success" });
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to record decision",
        description: err?.data?.message || err?.message || "Something went wrong.",
        type: "error",
      });
    },
  });
};