"use client";

import {
  Award,
  Building2,
  CalendarClock,
  FlaskConical,
  GraduationCap,
  Link as LinkIcon,
} from "lucide-react";
import Image from "next/image";
import { StartApplicationDialog } from "@/components/features/application/start-application-dialog";
import { OpportunityMatchSection } from "@/components/features/matching/opportunity-match-section";
import { OpportunityRequirementsManager } from "@/components/features/requirement/opportunity-requirements-manager";
import { ShortlistButton } from "@/components/features/shortlist/shortlist-button";
import { useGetMe } from "@/hooks/auth.hook";
import { useOpportunity } from "@/hooks/opportunity.hook";
import { useIsOpportunityShortlisted } from "@/hooks/shortlist.hook";
import { DeadlineChangeLogList } from "./deadline-change-log";
import { OpportunityTypeBadge } from "./opportunity-type-badge";
import { VerificationStatusBadge } from "./verification-status-badge";

export function OpportunityDetail({
  opportunityId,
}: {
  opportunityId: string;
}) {
  const {
    data: opportunity,
    isLoading,
    isError,
  } = useOpportunity(opportunityId);
  const { isShortlisted } = useIsOpportunityShortlisted(opportunityId);
  const { data: currentUser } = useGetMe();

  if (isLoading)
    return <div className="h-48 animate-pulse rounded-2xl bg-muted/60" />;
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
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs">
        {/* Top Header Banner if present */}
        {opportunity.imageUrl && (
          <div className="relative h-48 sm:h-64 w-full bg-muted/40">
            <Image
              src={opportunity.imageUrl}
              alt={opportunity.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          </div>
        )}

        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {!opportunity.imageUrl && (
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {opportunity.type === "FUNDING" ? (
                    <Award className="size-5" />
                  ) : opportunity.type === "LAB_POSITION" ? (
                    <FlaskConical className="size-5" />
                  ) : (
                    <GraduationCap className="size-5" />
                  )}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-foreground leading-snug">
                  {opportunity.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5 font-medium">
                  <Building2 className="size-3.5" />
                  <span>{opportunity.university?.name ?? "—"}</span>
                  <span>·</span>
                  <span className="text-foreground/80 font-semibold">
                    {opportunity.fieldOfStudy}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <VerificationStatusBadge
                status={opportunity.verificationStatus}
              />
              <OpportunityTypeBadge type={opportunity.type} />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 border-t border-border/60 pt-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <CalendarClock className="size-3.5 text-primary" />
              Deadline: {deadline}
            </span>
            {isSourceUrl ? (
              <a
                href={opportunity.source}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold"
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
      </div>

      {/* Match Result & Gap Analysis (Student View) */}
      {!isAdmin && <OpportunityMatchSection opportunityId={opportunity.id} />}

      {/* Opportunity Requirements Manager */}
      <OpportunityRequirementsManager
        opportunityId={opportunity.id}
        isAdmin={isAdmin}
      />
    </div>
  );
}
