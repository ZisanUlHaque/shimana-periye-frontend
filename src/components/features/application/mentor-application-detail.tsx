"use client";

import { Calendar, Building2 } from "lucide-react";
import { ApplicationStatusBadge, DecisionBadge } from "./application-status-badge";
import { MentorApplicationTaskList } from "@/components/features/application-task/mentor-application-task-list";
import { useGetApplicationForMentor } from "@/hooks";

export function MentorApplicationDetail({ applicationId }: { applicationId: string }) {
  const { data, isLoading, isError } = useGetApplicationForMentor(applicationId);
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
            {application.decision && <DecisionBadge decision={application.decision} />}
          </div>
        </div>

        {application.interviewDate && (
          <div className="mt-4 flex gap-4 border-t border-border/60 pt-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              Interview:{" "}
              {new Date(application.interviewDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Checklist</h3>
        <MentorApplicationTaskList applicationId={application.id} />
      </div>
    </div>
  );
}