export type RecommendationStatus =
  | "NOT_REQUESTED"
  | "REQUESTED"
  | "SUBMITTED"
  | "DECLINED";

export interface IRecommendationRequest {
  id: string;
  studentProfileId: string;
  applicationId?: string | null;
  professorName: string;
  professorEmail?: string | null;
  status: RecommendationStatus;
  followUpAt?: string | null;
  createdAt: string;
  updatedAt: string;
  application?: {
    id: string;
    opportunity?: {
      id: string;
      title: string;
    };
  } | null;
}

export interface ICreateRecommendationRequestPayload {
  applicationId?: string;
  professorName: string;
  professorEmail?: string;
  followUpAt?: string;
}

export interface IUpdateRecommendationRequestPayload {
  professorName?: string;
  professorEmail?: string;
  followUpAt?: string | null;
}

export interface IUpdateRecommendationStatusPayload {
  status: RecommendationStatus;
}

export interface IUpdateRecommendationRequestParams {
  id: string;
  payload: IUpdateRecommendationRequestPayload;
}

export interface IUpdateRecommendationStatusParams {
  id: string;
  status: RecommendationStatus;
}
