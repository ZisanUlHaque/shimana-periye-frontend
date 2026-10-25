import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { generateQuestions, evaluateAnswer } from "@/api/interview-practice.api";
import type { IEvaluateAnswerPayload } from "@/types/interview-practice.type";

export function useGenerateInterviewQuestions() {
  return useMutation({
    mutationFn: (applicationId: string) => generateQuestions(applicationId),
    onSuccess: () => {
      toast.add({
        title: "AI interview questions generated!",
        type: "success",
      });
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to generate questions",
        description: err?.message,
        type: "error",
      });
    },
  });
}

export function useEvaluateInterviewAnswer() {
  return useMutation({
    mutationFn: ({
      applicationId,
      payload,
    }: {
      applicationId: string;
      payload: IEvaluateAnswerPayload;
    }) => evaluateAnswer(applicationId, payload),
    onSuccess: () => {
      toast.add({ title: "Answer evaluated!", type: "success" });
    },
    onError: (err: any) => {
      toast.add({
        title: "Failed to evaluate answer",
        description: err?.message,
        type: "error",
      });
    },
  });
}
