"use client";

import { Calendar, Building2, Coins, CheckSquare, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetApplicationById } from "@/hooks/application.hook";
import { ApplicationStatusBadge, DecisionBadge } from "./application-status-badge";
import { UpdateApplicationStatusDialog } from "./update-application-status-dialog";
import { RecordInterviewDialog } from "./record-interview-dialog";
import { RecordDecisionDialog } from "./record-decision-dialog";
import { ApplicationTaskList } from "@/components/features/application-task/application-task-list";

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ApplicationDetail({ applicationId }: { applicationId: string }) {
  const { data, isLoading, isError } = useGetApplicationById(applicationId);
  const application = data?.data;

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-2xl bg-muted/60" />;
  }

  if (isError || !application) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
        Failed to load this application.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                {application.opportunity?.title ?? "Untitled Opportunity"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {application.opportunity?.university?.name ?? "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ApplicationStatusBadge status={application.status} />
            <DecisionBadge decision={application.decision} />
          </div>
        </div>

        {(application.submittedAt || application.interviewDate || application.offerResponseDeadline) && (
          <div className="mt-4 flex flex-wrap gap-4 border-t border-border/60 pt-4 text-xs text-muted-foreground">
            {application.submittedAt && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                Submitted: {formatDate(application.submittedAt)}
              </span>
            )}
            {application.interviewDate && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                Interview: {formatDate(application.interviewDate)}
              </span>
            )}
            {application.offerResponseDeadline && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                Offer deadline: {formatDate(application.offerResponseDeadline)}
              </span>
            )}
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
          <UpdateApplicationStatusDialog
            applicationId={application.id}
            currentStatus={application.status}
          />
          {(application.status === "INTERVIEW" || application.status === "SUBMITTED") && (
            <RecordInterviewDialog
              applicationId={application.id}
              defaultDate={application.interviewDate}
            />
          )}
          {application.status === "DECISION" && (
            <RecordDecisionDialog applicationId={application.id} />
          )}

          {/* Quick Hub Links for this Application */}
          <Link href={`/student/applications/${application.id}/cost-estimate`}>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <Coins className="size-3.5" />
              Cost Estimator
            </Button>
          </Link>
          <Link href={`/student/applications/${application.id}/tasks`}>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <CheckSquare className="size-3.5" />
              Manage Tasks
            </Button>
          </Link>
          <Link href={`/student/interview-practice/${application.id}`}>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <Sparkles className="size-3.5" />
              Mock Interview
            </Button>
          </Link>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Application Checklist</h3>
        <ApplicationTaskList applicationId={application.id} />
      </div>
    </div>
  );
}
