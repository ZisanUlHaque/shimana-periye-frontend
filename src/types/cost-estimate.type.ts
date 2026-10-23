export interface ICostItem {
  id: string;
  category: string;
  amount: number;
  description?: string;
}

export interface ICostEstimate {
  id: string;
  applicationId: string;
  tuitionFee: number;
  livingCost: number;
  visaAndTravelFee: number;
  healthInsurance: number;
  applicationFee: number;
  miscellaneousCost: number;
  scholarshipOrWaiver: number;
  estimatedTotal: number;
  netCost: number;
  currency: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IUpsertCostEstimatePayload {
  tuitionFee?: number;
  livingCost?: number;
  visaAndTravelFee?: number;
  healthInsurance?: number;
  applicationFee?: number;
  miscellaneousCost?: number;
  scholarshipOrWaiver?: number;
  currency?: string;
  notes?: string;
}
