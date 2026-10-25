import apiClient from "@/lib/apiClient";
import type { IApiResponse } from "@/types/api.type";
import type {
  IGenerateQuestionsResponse,
  IEvaluateAnswerPayload,
  IEvaluateAnswerResponse,
} from "@/types/interview-practice.type";

export function generateQuestions(applicationId: string) {
  return apiClient<IApiResponse<IGenerateQuestionsResponse>>(
    `/interview-practice/${applicationId}/generate`,
    {
      method: "POST",
    }
  );
}

export function evaluateAnswer(
  applicationId: string,
  payload: IEvaluateAnswerPayload
) {
  return apiClient<IApiResponse<IEvaluateAnswerResponse>>(
    `/interview-practice/${applicationId}/evaluate`,
    {
      method: "POST",
      body: payload,
    }
  );
}
