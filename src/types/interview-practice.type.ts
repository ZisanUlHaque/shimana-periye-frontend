export type InterviewCategory =
  | "BEHAVIORAL"
  | "TECHNICAL"
  | "RESEARCH_FIT"
  | "MOTIVATION";

export interface IInterviewQuestion {
  id: number;
  category: InterviewCategory;
  question: string;
  sampleKeyPoints: string[];
}

export interface IGenerateQuestionsResponse {
  applicationId: string;
  opportunityTitle: string;
  universityName: string;
  interviewDate?: string | null;
  totalQuestions: number;
  questions: IInterviewQuestion[];
}

export interface IEvaluateAnswerPayload {
  question: string;
  answer: string;
  category?: InterviewCategory;
}

export interface IEvaluateAnswerResponse {
  applicationId: string;
  question: string;
  studentAnswer: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}
