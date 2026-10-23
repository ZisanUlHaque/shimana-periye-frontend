export type OutreachStatus =
  | "PENDING"
  | "SUBMITTED"
  | "REPLIED"
  | "ACCEPTED"
  | "REJECTED";

export interface IOutreachLog {
  id: string;
  studentProfileId: string;
  professorId?: string | null;
  opportunityId?: string | null;
  status: OutreachStatus;
  emailSentAt?: string | null;
  followUpAt?: string | null;
  replyAt?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  professor?: {
    id: string;
    name: string;
    email?: string | null;
    university?: {
      id: string;
      name: string;
    };
  } | null;
  opportunity?: {
    id: string;
    title: string;
  } | null;
}

export interface ICreateOutreachLogPayload {
  professorId?: string;
  opportunityId?: string;
  emailSentAt?: string;
  followUpAt?: string;
  notes?: string;
}

export interface IUpdateOutreachLogPayload {
  emailSentAt?: string | null;
  followUpAt?: string | null;
  notes?: string;
}

export interface IUpdateOutreachLogParams {
  id: string;
  payload: IUpdateOutreachLogPayload;
}

export interface IMarkReplyReceivedPayload {
  replyAt?: string;
}
