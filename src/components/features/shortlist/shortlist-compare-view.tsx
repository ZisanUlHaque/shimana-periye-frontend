"use client";

import { Scale, AlertTriangle, Sparkles } from "lucide-react";
import { useShortlistCompare } from "@/hooks/shortlist.hook";
import { OpportunityTypeBadge } from "@/components/features/opportunity/opportunity-type-badge";
import { Skeleton } from "@/components/ui/skeleton";

interface ShortlistCompareViewProps {
  ids: string[];
}

export function ShortlistCompareView({ ids }: ShortlistCompareViewProps) {
  const isValidCount = ids.length >= 2 && ids.length <= 5;
  const { data, isLoading, isError } = useShortlistCompare(ids);

  if (!isValidCount) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-16 text-center">
        <Scale className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Select between 2 and 5 shortlisted opportunities to compare.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ids.map((id) => (
          <Skeleton key={id} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  if (isError || !data?.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-16 text-center">
        <Scale className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Could not load comparison.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((item) => (
        <div key={item.shortlistId} className="space-y-3 rounded-xl border border-border/60 bg-card p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground">{item.opportunity.title}</h3>
            <OpportunityTypeBadge type={item.opportunity.type} />
          </div>

          {item.deadlinePassed ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-medium text-destructive">
              <AlertTriangle className="size-3" />
              Deadline passed
            </span>
          ) : null}

          {typeof item.matchScore === "number" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
              <Sparkles className="size-3" />
              {item.matchScore}% match
            </span>
          ) : null}

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">University</dt>
              <dd className="text-right text-foreground">
                {item.opportunity.university?.name ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Field</dt>
              <dd className="text-right text-foreground">{item.opportunity.fieldOfStudy}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Deadline</dt>
              <dd className="text-right text-foreground">
                {item.deadline ? new Date(item.deadline).toLocaleDateString() : "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Country</dt>
              <dd className="text-right text-foreground">
                {item.opportunity.university?.country ?? "—"}
              </dd>
            </div>
          </dl>

          {item.notes ? (
            <p className="border-t border-border/60 pt-2 text-xs italic text-muted-foreground">
              “{item.notes}”
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}