export const TaskStatus = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
  BLOCKED: "BLOCKED",
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export interface IApplicationTask {
  id: string;
  applicationId: string;
  title: string;
  description: string | null;
  deadline: string | null;
  status: TaskStatus;
  dependsOnId: string | null;
  reminderSentAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateApplicationTaskPayload {
  title: string;
  description?: string;
  deadline?: string;
  dependsOnId?: string;
}

export type IUpdateApplicationTaskPayload =
  Partial<ICreateApplicationTaskPayload> & {
    dependsOnId?: string | null;
  };

export interface IUpdateApplicationTaskParams {
  applicationId: string;
  taskId: string;
  payload: IUpdateApplicationTaskPayload;
}

export interface IUpdateTaskStatusPayload {
  status: TaskStatus;
}

export interface IUpdateTaskStatusParams {
  applicationId: string;
  taskId: string;
  payload: IUpdateTaskStatusPayload;
}

export interface IDeleteApplicationTaskParams {
  applicationId: string;
  taskId: string;
}
