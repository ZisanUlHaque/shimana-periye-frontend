export interface IExperience {
  id: string;
  studentProfileId: string;
  role: string;
  organization: string;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateExperiencePayload {
  role: string;
  organization: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export type IUpdateExperiencePayload = Partial<ICreateExperiencePayload>;

export interface IUpdateExperienceParams {
  id: string;
  payload: IUpdateExperiencePayload;
}
