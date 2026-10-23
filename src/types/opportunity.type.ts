export const OpportunityType = {
  PROGRAMME: "PROGRAMME",
  PROFESSOR_OPENING: "PROFESSOR_OPENING",
  LAB_POSITION: "LAB_POSITION",
  FUNDING: "FUNDING",
} as const;

export type OpportunityType = (typeof OpportunityType)[keyof typeof OpportunityType];

export interface IOpportunityUniversitySummary {
  id: string;
  name: string;
  country: string;
}

export interface IOpportunity {
  id: string;
  type: OpportunityType;
  title: string;
  universityId: string;
  professorId: string | null;
  labId: string | null;
  fieldOfStudy: string;
  deadline: string | null;
  source: string;
  lastCheckedAt: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  university?: IOpportunityUniversitySummary;
  professor?: { id: string; name: string } | null;
  lab?: { id: string; name: string } | null;
}

export interface ICreateOpportunityPayload {
  type: OpportunityType;
  title: string;
  universityId: string;
  professorId?: string;
  labId?: string;
  fieldOfStudy: string;
  deadline?: string;
  source: string;
  lastCheckedAt: string;
}

export interface IUpdateOpportunityPayload {
  type?: OpportunityType;
  title?: string;
  professorId?: string | null;
  labId?: string | null;
  fieldOfStudy?: string;
  deadline?: string | null;
  source?: string;
  lastCheckedAt?: string;
}

export interface IUpdateOpportunityParams {
  id: string;
  payload: IUpdateOpportunityPayload;
}

export interface IOpportunityFilters {
  searchTerm?: string;
  type?: OpportunityType;
  universityId?: string;
  fieldOfStudy?: string;
  country?: string;
  deadlineFrom?: string;
  deadlineTo?: string;
}

export interface IDeadlineChangeLog {
  id: string;
  opportunityId: string;
  oldDeadline: string | null;
  newDeadline: string | null;
  changedById: string;
  changedAt: string;
}