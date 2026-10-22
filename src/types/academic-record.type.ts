export interface IAcademicRecord {
  id: string;
  studentProfileId: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  gpa: number | null;
  startYear: number | null;
  endYear: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateAcademicRecordPayload {
  degree: string;
  institution: string;
  fieldOfStudy: string;
  gpa?: number;
  startYear?: number;
  endYear?: number;
}

export type IUpdateAcademicRecordPayload =
  Partial<ICreateAcademicRecordPayload>;

export interface IUpdateAcademicRecordParams {
  id: string;
  payload: IUpdateAcademicRecordPayload;
}