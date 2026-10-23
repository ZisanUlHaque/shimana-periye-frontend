"use client";

import { useState } from "react";
import {
  useGetMatchResult,
  useRecomputeMatchResult,
  useGetAiMatchExplanation,
} from "@/hooks/matching.hook";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  RefreshCw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";

export function OpportunityMatchSection({
  opportunityId,
}: {
  opportunityId: string;
}) {
  const { data, isLoading } = useGetMatchResult(opportunityId);
  const matchResult = data?.data;

  const { mutate: recompute, isPending: isRecomputing } =
    useRecomputeMatchResult(opportunityId);
  const { mutate: runAi, isPending: isAiPending, data: aiRes } =
    useGetAiMatchExplanation(opportunityId);

  const [aiText, setAiText] = useState<string | null>(null);

  const handleAiExplain = () => {
    runAi(undefined as any, {
      onSuccess: (res: any) => {
        setAiText(res?.data?.explanation ?? "Analysis complete.");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="h-44 animate-pulse rounded-2xl border border-border/70 bg-muted/40" />
    );
  }

  if (!matchResult) return null;

  const score = matchResult.score ?? 0;
  const rawGaps: any[] = matchResult.gaps ?? [];
  const overallEligibility: string =
    matchResult.overallEligibility ?? "ELIGIBLE";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-base">
            {score}%
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Candidate Fit & Eligibility
            </h4>
            <p className="text-xs text-muted-foreground">
              Overall Status:{" "}
              <span className="font-semibold text-foreground">
                {typeof overallEligibility === "string"
                  ? overallEligibility.replace(/_/g, " ")
                  : "CALCULATED"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => recompute()}
            disabled={isRecomputing}
            className="gap-1.5 text-xs"
          >
            <RefreshCw
              className={`size-3.5 ${isRecomputing ? "animate-spin" : ""}`}
            />
            Recalculate
          </Button>

          <Button
            size="sm"
            onClick={handleAiExplain}
            disabled={isAiPending}
            className="gap-1.5 text-xs"
          >
            <Sparkles className="size-3.5" />
            {isAiPending ? "Explaining..." : "AI Fit Explanation"}
          </Button>
        </div>
      </div>

      {/* AI Explanation Banner */}
      {(aiText || (aiRes as any)?.data) && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-xs text-foreground whitespace-pre-wrap leading-relaxed">
          <span className="font-semibold text-primary block mb-1">
            AI Requirement Insights:
          </span>
          {aiText || (aiRes as any)?.data?.explanation}
        </div>
      )}

      {/* Requirement Gap Analysis List */}
      {rawGaps.length > 0 && (
        <div className="flex flex-col gap-2 pt-2 border-t border-border/60">
          <span className="text-xs font-semibold text-foreground">
            Requirement Gap Breakdown
          </span>
          <div className="flex flex-col gap-1.5">
            {rawGaps.map((gap, i) => {
              const statusStr =
                gap.status ??
                (gap.description?.startsWith("[NOT_ELIGIBLE]")
                  ? "NOT_ELIGIBLE"
                  : gap.description?.startsWith("[POTENTIALLY_ELIGIBLE]")
                  ? "POTENTIALLY_ELIGIBLE"
                  : "ELIGIBLE");

              const detailText =
                gap.requirement?.detail ||
                gap.detail ||
                gap.requirement?.type ||
                gap.type ||
                "Requirement";

              const reasonText = gap.description || gap.reason || "";

              return (
                <div
                  key={gap.id ?? i}
                  className="flex items-start gap-2.5 rounded-lg border border-border/50 bg-background/50 p-2.5 text-xs"
                >
                  {statusStr === "ELIGIBLE" ? (
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  ) : statusStr === "NOT_ELIGIBLE" ? (
                    <XCircle className="size-4 text-destructive shrink-0" />
                  ) : (
                    <AlertTriangle className="size-4 text-amber-500 shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-medium text-foreground truncate">
                        {detailText}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                        {typeof statusStr === "string"
                          ? statusStr.replace(/_/g, " ")
                          : "GAP"}
                      </span>
                    </div>
                    {reasonText && (
                      <p className="mt-0.5 text-muted-foreground text-[11px]">
                        {reasonText}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
