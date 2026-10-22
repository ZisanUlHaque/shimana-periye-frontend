import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import {
  createApplicationTask,
  getApplicationTasks,
  getTasksForMentor,
  updateApplicationTask,
  updateTaskStatus,
  deleteApplicationTask,
} from "@/api/application-task.api";
import type {
  ICreateApplicationTaskPayload,
  IUpdateApplicationTaskParams,
  IUpdateTaskStatusParams,
} from "@/types/application-task.type";

export const APPLICATION_TASKS_QUERY_KEY = (applicationId: string) => [
  "application-tasks",
  applicationId,
];

export const useGetApplicationTasks = (applicationId: string) => {
  return useQuery({
    queryKey: APPLICATION_TASKS_QUERY_KEY(applicationId),
    queryFn: () => getApplicationTasks(applicationId),
    enabled: Boolean(applicationId),
  });
};

export const useGetTasksForMentor = (applicationId: string) => {
  return useQuery({
    queryKey: [...APPLICATION_TASKS_QUERY_KEY(applicationId), "mentor"],
    queryFn: () => getTasksForMentor(applicationId),
    enabled: Boolean(applicationId),
  });
};

export const useCreateApplicationTask = (applicationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateApplicationTaskPayload) =>
      createApplicationTask(applicationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_TASKS_QUERY_KEY(applicationId) });
      toast.add({ title: "Task created", description: "The task has been added.", type: "success" });
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to create task",
        description: err?.data?.message || err?.message || "Something went wrong.",
        type: "error",
      });
    },
  });
};

export const useUpdateApplicationTask = (applicationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: Omit<IUpdateApplicationTaskParams, "applicationId">) =>
      updateApplicationTask({ applicationId, ...params }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_TASKS_QUERY_KEY(applicationId) });
      toast.add({ title: "Task updated", description: "Your changes have been saved.", type: "success" });
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to update task",
        description: err?.data?.message || err?.message || "Something went wrong.",
        type: "error",
      });
    },
  });
};

export const useUpdateTaskStatus = (applicationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: Omit<IUpdateTaskStatusParams, "applicationId">) =>
      updateTaskStatus({ applicationId, ...params }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_TASKS_QUERY_KEY(applicationId) });
      toast.add({ title: "Status updated", description: "Task status changed.", type: "success" });
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

export const useDeleteApplicationTask = (applicationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => deleteApplicationTask({ applicationId, taskId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_TASKS_QUERY_KEY(applicationId) });
      toast.add({ title: "Task deleted", description: "The task has been removed.", type: "success" });
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to delete task",
        description: err?.data?.message || err?.message || "Something went wrong.",
        type: "error",
      });
    },
  });
};