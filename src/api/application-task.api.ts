import apiClient from "@/lib/apiClient";
import type {
  IApplicationTask,
  ICreateApplicationTaskPayload,
  IUpdateApplicationTaskParams,
  IUpdateTaskStatusParams,
  IDeleteApplicationTaskParams,
} from "@/types/application-task.type";

export function createApplicationTask(
  applicationId: string,
  payload: ICreateApplicationTaskPayload
) {
  return apiClient<{ success: boolean; data: IApplicationTask }>(
    `/applications/${applicationId}/tasks`,
    { method: "POST", body: payload }
  );
}

export function getApplicationTasks(applicationId: string) {
  return apiClient<{ success: boolean; data: IApplicationTask[] }>(
    `/applications/${applicationId}/tasks`
  );
}

export function getTasksForMentor(applicationId: string) {
  return apiClient<{ success: boolean; data: IApplicationTask[] }>(
    `/applications/${applicationId}/tasks/mentor/view`
  );
}

export function updateApplicationTask({
  applicationId,
  taskId,
  payload,
}: IUpdateApplicationTaskParams) {
  return apiClient<{ success: boolean; data: IApplicationTask }>(
    `/applications/${applicationId}/tasks/${taskId}`,
    { method: "PATCH", body: payload }
  );
}

export function updateTaskStatus({
  applicationId,
  taskId,
  payload,
}: IUpdateTaskStatusParams) {
  return apiClient<{ success: boolean; data: IApplicationTask }>(
    `/applications/${applicationId}/tasks/${taskId}/status`,
    { method: "PATCH", body: payload }
  );
}

export function deleteApplicationTask({
  applicationId,
  taskId,
}: IDeleteApplicationTaskParams) {
  return apiClient<{ success: boolean; data: null }>(
    `/applications/${applicationId}/tasks/${taskId}`,
    { method: "DELETE" }
  );
}
