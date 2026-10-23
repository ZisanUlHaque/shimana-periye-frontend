export type RequirementType =
  | "MIN_GPA"
  | "DEGREE_LEVEL"
  | "FIELD_OF_STUDY"
  | "TEST_IELTS"
  | "TEST_TOEFL"
  | "TEST_GRE"
  | "TEST_GMAT"
  | "WORK_EXPERIENCE"
  | "PUBLICATION_COUNT"
  | "DOCUMENT_REQUIRED"
  | "OTHER";

export interface IRequirement {
  id: string;
  opportunityId: string;
  type: RequirementType;
  detail: string;
  minValue?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateRequirementPayload {
  type: RequirementType;
  detail: string;
  minValue?: number;
}

export interface IUpdateRequirementPayload {
  type?: RequirementType;
  detail?: string;
  minValue?: number;
}

export interface IUpdateRequirementParams {
  opportunityId: string;
  requirementId: string;
  payload: IUpdateRequirementPayload;
}
