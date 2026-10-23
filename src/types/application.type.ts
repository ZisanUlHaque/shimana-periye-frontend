export const ApplicationStatus = {
  DRAFT: "DRAFT",
  IN_PROGRESS: "IN_PROGRESS",
  SUBMITTED: "SUBMITTED",
  INTERVIEW: "INTERVIEW",
  DECISION: "DECISION",
  CLOSED: "CLOSED",
} as const;

export type ApplicationStatus = (typeof ApplicationStatus)[keyof typeof ApplicationStatus];

export const Decision = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  WAITLISTED: "WAITLISTED",
} as const;

export type Decision = (typeof Decision)[keyof typeof Decision];

export const APPLICATION_STATUS_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  DRAFT: ["IN_PROGRESS"],
  IN_PROGRESS: ["SUBMITTED"],
  SUBMITTED: ["INTERVIEW", "DECISION", "CLOSED"],
  INTERVIEW: ["DECISION", "CLOSED"],
  DECISION: ["CLOSED"],
  CLOSED: [],
};

export interface IApplicationOpportunitySummary {
  id: string;
  title: string;
  type?: string;
  university?: {
    id: string;
    name: string;
  } | null;
}

export interface IApplication {
  id: string;
  studentProfileId: string;
  opportunityId: string;
  status: ApplicationStatus;
  submittedAt: string | null;
  decision: Decision;
  interviewDate: string | null;
  offerResponseDeadline: string | null;
  createdAt: string;
  updatedAt: string;
  opportunity?: IApplicationOpportunitySummary;
}

export interface IStartApplicationPayload {
  opportunityId: string;
}

export interface IUpdateApplicationStatusPayload {
  status: ApplicationStatus;
}

export interface IUpdateApplicationStatusParams {
  id: string;
  payload: IUpdateApplicationStatusPayload;
}

export interface IRecordDecisionPayload {
  decision: Decision;
  offerResponseDeadline?: string;
}

export interface IRecordDecisionParams {
  id: string;
  payload: IRecordDecisionPayload;
}

export interface IRecordInterviewPayload {
  interviewDate: string;
}

export interface IRecordInterviewParams {
  id: string;
  payload: IRecordInterviewPayload;
}