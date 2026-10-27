import type { IUniversity } from "./university.type";

export const OpportunityType = {
  PROGRAMME: "PROGRAMME",
  PROFESSOR_OPENING: "PROFESSOR_OPENING",
  LAB_POSITION: "LAB_POSITION",
  FUNDING: "FUNDING",
} as const;
export type OpportunityType =
  (typeof OpportunityType)[keyof typeof OpportunityType];

export type VerificationStatus = "VERIFIED" | "NEEDS_RECHECK";

export interface IOpportunityUniversityRef {
  id: string;
  name: string;
  country: string;
  imageUrl?: string | null;
}
export interface IOpportunityProfessorRef {
  id: string;
  name: string;
}
export interface IOpportunityLabRef {
  id: string;
  name: string;
  imageUrl?: string | null;
}

// PLACEHOLDER shapes — Professor/Lab/Requirement modules not built yet.
export interface IProfessorFull {
  id: string;
  name: string;
  universityId: string;
  [key: string]: unknown;
}
export interface ILabFull {
  id: string;
  name: string;
  universityId: string;
  imageUrl?: string | null;
  [key: string]: unknown;
}
export interface IRequirementFull {
  id: string;
  opportunityId: string;
  [key: string]: unknown;
}

// Shape from getAllOpportunities (list) — partial nested refs
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
  imageUrl?: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  university: IOpportunityUniversityRef;
  professor: IOpportunityProfessorRef | null;
  lab: IOpportunityLabRef | null;
  _count?: { requirements: number };
  verificationStatus: VerificationStatus;
}

// Shape from getOpportunityById (detail) — FULL nested objects
export interface IOpportunityDetail
  extends Omit<IOpportunity, "university" | "professor" | "lab" | "_count"> {
  university: IUniversity;
  professor: IProfessorFull | null;
  lab: ILabFull | null;
  requirements: IRequirementFull[];
}

export interface ICreateOpportunityPayload {
  type: OpportunityType;
  title: string;
  universityId: string;
  professorId?: string;
  labId?: string;
  fieldOfStudy: string;
  deadline?: string | null;
  source: string;
  lastCheckedAt: string;
  imageUrl?: string | null;
}

export interface IUpdateOpportunityPayload
  extends Partial<
    Omit<
      ICreateOpportunityPayload,
      "professorId" | "labId" | "deadline" | "imageUrl"
    >
  > {
  professorId?: string | null;
  labId?: string | null;
  deadline?: string | null;
  imageUrl?: string | null;
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

export interface IOpportunityListParams extends IOpportunityFilters {
  page?: number;
  limit?: number;
}

export interface IDeadlineChangeLog {
  id: string;
  opportunityId: string;
  oldDeadline: string | null;
  newDeadline: string | null;
  changedById: string;
  changedAt: string;
}
