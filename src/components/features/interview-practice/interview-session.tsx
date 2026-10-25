"use client";

import { useState } from "react";
import {
  useGenerateInterviewQuestions,
  useEvaluateInterviewAnswer,
} from "@/hooks/interview-practice.hook";
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Brain,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type {
  IInterviewQuestion,
  IEvaluateAnswerResponse,
} from "@/types/interview-practice.type";

interface InterviewSessionProps {
  applicationId: string;
}

export function InterviewSession({ applicationId }: InterviewSessionProps) {
  const {
    mutate: generate,
    isPending: isGenerating,
    data: genData,
  } = useGenerateInterviewQuestions();

  const {
    mutate: evaluate,
    isPending: isEvaluating,
    data: evalData,
  } = useEvaluateInterviewAnswer();

  const questions: IInterviewQuestion[] =
    (genData?.data?.questions as IInterviewQuestion[]) ?? [];
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [evaluations, setEvaluations] = useState<
    Record<number, IEvaluateAnswerResponse>
  >({});

  const activeQuestion = questions[activeQuestionIndex];

  const handleEvaluate = () => {
    if (!activeQuestion || !answerText.trim()) return;

    evaluate(
      {
        applicationId,
        payload: {
          question: activeQuestion.question,
          answer: answerText.trim(),
          category: activeQuestion.category,
        },
      },
      {
        onSuccess: (res: any) => {
          if (res?.data) {
            setEvaluations((prev) => ({
              ...prev,
              [activeQuestion.id]: res.data,
            }));
          }
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Initiation Header */}
      {questions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Brain className="size-7" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">
            Generate AI Mock Interview Questions
          </h3>
          <p className="mt-1.5 text-xs text-muted-foreground max-w-md">
            Our AI interviewer analyzes this application's target university, program,
            and field of study to generate customized technical, behavioral, and research
            fit questions.
          </p>
          <Button
            size="sm"
            onClick={() => generate(applicationId)}
            disabled={isGenerating}
            className="mt-6 gap-2"
          >
            {isGenerating ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            Start AI Mock Interview
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Question Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-4">
            {questions.map((q, idx) => {
              const isEvaluated = Boolean(evaluations[q.id]);
              const isActive = idx === activeQuestionIndex;

              return (
                <Button
                  key={q.id}
                  size="sm"
                  variant={isActive ? "default" : "outline"}
                  onClick={() => {
                    setActiveQuestionIndex(idx);
                    setAnswerText(evaluations[q.id]?.studentAnswer ?? "");
                  }}
                  className="gap-1.5 text-xs"
                >
                  <span>Q{idx + 1}</span>
                  {isEvaluated && <CheckCircle2 className="size-3.5 text-green-500" />}
                </Button>
              );
            })}
          </div>

          {/* Active Question Box */}
          {activeQuestion && (
            <div className="flex flex-col gap-5 rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge variant="outline" className="text-xs">
                  {activeQuestion.category.replace(/_/g, " ")}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Question {activeQuestionIndex + 1} of {questions.length}
                </span>
              </div>

              <h3 className="text-base font-bold text-foreground leading-snug">
                "{activeQuestion.question}"
              </h3>

              {/* Sample Key Points (Hints) */}
              {activeQuestion.sampleKeyPoints?.length > 0 && (
                <div className="flex flex-col gap-1.5 rounded-xl bg-muted/40 p-3.5 text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <HelpCircle className="size-3.5 text-primary" />
                    Key Talking Points to Include:
                  </span>
                  <ul className="list-disc list-inside space-y-0.5 text-muted-foreground pl-1">
                    {activeQuestion.sampleKeyPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Student Response Textarea */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-foreground">
                  Your Answer:
                </label>
                <Textarea
                  rows={6}
                  placeholder="Type your response here as you would speak it in the interview..."
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  disabled={isEvaluating}
                  className="text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-muted-foreground">
                  Aim for 150–350 words using concrete examples and the STAR method.
                </span>
                <Button
                  size="sm"
                  onClick={handleEvaluate}
                  disabled={isEvaluating || answerText.trim().length < 10}
                  className="gap-2 text-xs"
                >
                  {isEvaluating ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                  Evaluate My Answer
                </Button>
              </div>

              {/* Evaluation Result */}
              {evaluations[activeQuestion.id] && (
                <div className="mt-4 flex flex-col gap-4 rounded-xl border border-primary/20 bg-primary/5 p-5 text-xs">
                  <div className="flex items-center justify-between border-b border-primary/10 pb-3">
                    <span className="font-bold text-primary flex items-center gap-1.5 text-sm">
                      <Sparkles className="size-4" />
                      AI Score & Evaluation
                    </span>
                    <Badge variant="outline" className="font-extrabold text-sm px-2.5 py-0.5">
                      {evaluations[activeQuestion.id].score} / 10
                    </Badge>
                  </div>

                  <p className="text-foreground leading-relaxed">
                    {evaluations[activeQuestion.id].feedback}
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-primary/10">
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-green-600 flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5" />
                        Key Strengths:
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                        {evaluations[activeQuestion.id].strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-amber-600 flex items-center gap-1.5">
                        <TrendingUp className="size-3.5" />
                        Areas for Improvement:
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                        {evaluations[activeQuestion.id].improvements.map((imp, i) => (
                          <li key={i}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
