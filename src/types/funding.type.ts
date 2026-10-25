export type FundingStatus = "AVAILABLE" | "APPLIED" | "AWARDED" | "REJECTED";

export interface IFunding {
  id: string;
  studentProfileId?: string | null;
  opportunityId?: string | null;
  name: string;
  amount: number;
  currency: string;
  status: FundingStatus;
  opportunity?: {
    id: string;
    title: string;
    university?: {
      name: string;
    } | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateFundingPayload {
  opportunityId?: string;
  name: string;
  amount: number;
  currency: string;
}

export interface IUpdateFundingPayload {
  name?: string;
  amount?: number;
  currency?: string;
}

export interface IUpdateFundingStatusPayload {
  status: FundingStatus;
}
