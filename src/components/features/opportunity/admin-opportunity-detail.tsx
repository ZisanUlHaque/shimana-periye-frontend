"use client";

import { Building2, CalendarClock, Link as LinkIcon, Pencil } from "lucide-react";
import { OpportunityTypeBadge } from "./opportunity-type-badge";
import { OpportunityDialog } from "./opportunity-dialog";
import { DeleteOpportunityDialog } from "./delete-opportunity-dialog";
import { DeadlineChangeLogList } from "./deadline-change-log";
import { useOpportunity } from "@/hooks/opportunity.hook";
import { Button } from "@/components/ui/button";

export function AdminOpportunityDetail({ opportunityId }: { opportunityId: string }) {
  const { data: opportunity, isLoading, isError } = useOpportunity(opportunityId);

  if (isLoading) return <div className="h-48 animate-pulse rounded-2xl bg-muted/60" />;
  if (isError || !opportunity) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
        Failed to load this opportunity.
      </div>
    );
  }

  const deadline = opportunity.deadline
    ? new Date(opportunity.deadline).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Not specified";

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">{opportunity.title}</h2>
            <p className="text-sm text-muted-foreground">
              {opportunity.university?.name ?? "—"} · {opportunity.fieldOfStudy}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <OpportunityTypeBadge type={opportunity.type} />
          <OpportunityDialog
            opportunity={opportunity}
            trigger={
              <Button
                size="icon"
                variant="outline"
                className="size-8 text-muted-foreground hover:text-foreground"
              >
                <Pencil className="size-4" />
              </Button>
            }
          />
          <DeleteOpportunityDialog id={opportunity.id} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 border-t border-border/60 pt-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <CalendarClock className="size-3.5" />
          Deadline: {deadline}
        </span>
        <a
          href={opportunity.source}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-primary hover:underline"
        >
          <LinkIcon className="size-3.5" />
          View source
        </a>
      </div>

      <div className="mt-4 border-t border-border/60 pt-4">
        <h3 className="mb-2 text-sm font-semibold text-foreground">Deadline Change History</h3>
        <DeadlineChangeLogList opportunityId={opportunity.id} />
      </div>
    </div>
  );
}
