import apiClient from "@/lib/apiClient";
import type { IApiResponse } from "@/types/api.type";
import type {
  ICreateOutreachLogPayload,
  IMarkReplyReceivedPayload,
  IUpdateOutreachLogParams,
  IOutreachLog,
} from "@/types/outreach-log.type";

export function getMyOutreachLogs() {
  return apiClient<IApiResponse<IOutreachLog[]>>("/outreach-logs");
}

export function createOutreachLog(payload: ICreateOutreachLogPayload) {
  const reqData: any = {};
  if (payload.professorId && payload.professorId.trim() !== "") {
    reqData.professorId = payload.professorId.trim();
  }
  if (payload.opportunityId && payload.opportunityId.trim() !== "") {
    reqData.opportunityId = payload.opportunityId.trim();
  }
  if (payload.emailSentAt && payload.emailSentAt.trim() !== "") {
    reqData.emailSentAt = new Date(payload.emailSentAt).toISOString();
  }
  if (payload.followUpAt && payload.followUpAt.trim() !== "") {
    reqData.followUpAt = new Date(payload.followUpAt).toISOString();
  }
  if (payload.notes) {
    reqData.notes = payload.notes;
  }

  return apiClient("/outreach-logs", {
    method: "POST",
    body: {
      body: reqData,
      ...reqData,
    },
  });
}

export function updateOutreachLog({ id, payload }: IUpdateOutreachLogParams) {
  const reqData: any = {};
  if (payload.emailSentAt !== undefined) {
    reqData.emailSentAt = payload.emailSentAt ? new Date(payload.emailSentAt).toISOString() : null;
  }
  if (payload.followUpAt !== undefined) {
    reqData.followUpAt = payload.followUpAt ? new Date(payload.followUpAt).toISOString() : null;
  }
  if (payload.notes !== undefined) {
    reqData.notes = payload.notes;
  }

  return apiClient(`/outreach-logs/${id}`, {
    method: "PATCH",
    body: {
      body: reqData,
      ...reqData,
    },
  });
}

export function markOutreachReplyReceived(
  id: string,
  payload?: IMarkReplyReceivedPayload,
) {
  const reqData: any = {};
  if (payload?.replyAt) {
    reqData.replyAt = new Date(payload.replyAt).toISOString();
  }

  return apiClient(`/outreach-logs/${id}/reply-received`, {
    method: "PATCH",
    body: {
      body: reqData,
      ...reqData,
    },
  });
}

export function deleteOutreachLog(id: string) {
  return apiClient(`/outreach-logs/${id}`, {
    method: "DELETE",
  });
}
