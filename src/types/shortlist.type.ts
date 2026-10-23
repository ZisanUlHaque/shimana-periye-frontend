import type { IOpportunity } from "./opportunity.type";

export interface IShortlistRaw {
  id: string;
  studentProfileId: string;
  opportunityId: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

// MentorFeedback module not yet shared — placeholder shape
export interface IShortlistMentorFeedback {
  id: string;
  comment: string;
  createdAt: string;
  [key: string]: unknown;
}

export interface IShortlistOpportunity extends IOpportunity {
  fundings?: unknown[]; // Funding module not yet built — placeholder
  requirements?: unknown[]; // Requirement module not yet built — placeholder
}

// Shape returned by POST /shortlist (addToShortlist)
export interface IShortlistCreateResult extends IShortlistRaw {
  deadlinePassed: boolean;
}

// Shape returned by GET /shortlist (getMyShortlist) — comparison-ready projection,
// NOT the raw Shortlist row. No top-level `id`/`opportunityId`.
export interface IShortlistListItem {
  shortlistId: string;
  opportunity: IShortlistOpportunity;
  notes?: string | null;
  matchScore?: number | null; // MatchingService — Matching module not yet shared
  deadline: string | null;
  deadlinePassed: boolean;
  fundings?: unknown[];
  mentorFeedback: IShortlistMentorFeedback[];
}

// Shape returned by GET /shortlist/compare
export interface IShortlistCompareItem extends IShortlistListItem {
  costEstimate?: unknown | null; // CostEstimate module not yet shared
  gaps?: unknown[]; // MatchGap not yet shared
}

// Shape returned by GET /shortlist/student/:studentProfileId (mentor view) — raw rows
export interface IShortlistMentorViewItem extends IShortlistRaw {
  opportunity: IShortlistOpportunity;
  mentorFeedback: IShortlistMentorFeedback[];
}

export interface ICreateShortlistPayload {
  opportunityId: string;
  notes?: string;
}

export interface IUpdateShortlistPayload {
  notes?: string;
}