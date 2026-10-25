"use client";

import { Building2, CalendarClock, Link as LinkIcon } from "lucide-react";
import { OpportunityTypeBadge } from "./opportunity-type-badge";
import { VerificationStatusBadge } from "./verification-status-badge";
import { StartApplicationDialog } from "@/components/features/application/start-application-dialog";
import { ShortlistButton } from "@/components/features/shortlist/shortlist-button";
import { useIsOpportunityShortlisted } from "@/hooks/shortlist.hook";
import { useOpportunity } from "@/hooks/opportunity.hook";
import { useGetMe } from "@/hooks/auth.hook";
import { DeadlineChangeLogList } from "./deadline-change-log";

import { OpportunityMatchSection } from "@/components/features/matching/opportunity-match-section";
import { OpportunityRequirementsManager } from "@/components/features/requirement/opportunity-requirements-manager";

export function OpportunityDetail({ opportunityId }: { opportunityId: string }) {
  const { data: opportunity, isLoading, isError } = useOpportunity(opportunityId);
  const { isShortlisted } = useIsOpportunityShortlisted(opportunityId);
  const { data: currentUser } = useGetMe();

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

  const isAdmin = currentUser?.role === "ADMIN";
  const isSourceUrl = /^https?:\/\//i.test(opportunity.source);

  return (
    <div className="flex flex-col gap-6">
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
            <VerificationStatusBadge status={opportunity.verificationStatus} />
            <OpportunityTypeBadge type={opportunity.type} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 border-t border-border/60 pt-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarClock className="size-3.5" />
            Deadline: {deadline}
          </span>
          {isSourceUrl ? (
            <a
              href={opportunity.source}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-primary hover:underline"
            >
              <LinkIcon className="size-3.5" />
              View source
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <LinkIcon className="size-3.5" />
              Source: {opportunity.source}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
          <ShortlistButton opportunityId={opportunity.id} />
          {isShortlisted ? (
            <StartApplicationDialog
              opportunityId={opportunity.id}
              opportunityTitle={opportunity.title}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Shortlist this opportunity first to start an application.
            </p>
          )}
        </div>

        {isAdmin && (
          <div className="mt-4 border-t border-border/60 pt-4">
            <DeadlineChangeLogList opportunityId={opportunity.id} />
          </div>
        )}
      </div>

      {/* Match Result & Gap Analysis (Student View) */}
      {!isAdmin && (
        <OpportunityMatchSection opportunityId={opportunity.id} />
      )}

      {/* Opportunity Requirements Manager */}
      <OpportunityRequirementsManager
        opportunityId={opportunity.id}
        isAdmin={isAdmin}
      />
    </div>
  );
}