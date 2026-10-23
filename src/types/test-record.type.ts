export type TestType = "IELTS" | "TOEFL" | "GRE" | "GMAT" | "OTHER";

export interface ITestScore {
  overall: number;
  [section: string]: number | undefined;
}

export interface ITestRecord {
  id: string;
  studentProfileId: string;
  testType: TestType;
  score?: ITestScore | null;
  plannedDate?: string | null;
  actualDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateTestRecordPayload {
  testType: TestType;
  score?: ITestScore;
  plannedDate?: string;
  actualDate?: string;
}

export interface IUpdateTestRecordPayload {
  score?: ITestScore;
  plannedDate?: string;
  actualDate?: string;
}

export interface IUpdateTestRecordParams {
  id: string;
  payload: IUpdateTestRecordPayload;
}
