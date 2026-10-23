export type RequirementEligibilityStatus =
  | "ELIGIBLE"
  | "NOT_ELIGIBLE"
  | "POTENTIALLY_ELIGIBLE"
  | "INSUFFICIENT_INFORMATION";

export interface IRequirementEvaluation {
  requirementId: string;
  type: string;
  detail: string;
  minValue: number | null;
  status: RequirementEligibilityStatus;
  reason: string;
}

export interface IMatchBreakdown {
  interestScore: number;
  interestMax: number;
  skillScore: number;
  skillMax: number;
  requirementScore: number;
  requirementMax: number;
}

export interface IMatchResult {
  score: number;
  breakdown: IMatchBreakdown;
  gaps: IRequirementEvaluation[];
  overallEligibility: RequirementEligibilityStatus;
}

export interface IAiMatchExplanation {
  explanation: string;
  strengths?: string[];
  weaknesses?: string[];
  recommendations?: string[];
}
