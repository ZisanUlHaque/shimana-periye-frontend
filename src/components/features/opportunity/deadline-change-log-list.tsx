"use client";

import { History } from "lucide-react";
import { useGetDeadlineChangeLogs } from "@/hooks/opportunity.hook";
import { ListState } from "@/components/shared/list-state.tsxlist-state";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function DeadlineChangeLogList({ opportunityId }: { opportunityId: string }) {
  const { data, isLoading, isError } = useGetDeadlineChangeLogs(opportunityId);
  const logs = data?.data ?? [];

  return (
    <ListState
      isLoading={isLoading}
      isError={isError}
      items={logs}
      skeletonCount={2}
      skeletonClassName="h-14"
      emptyIcon={History}
      emptyTitle="No deadline changes"
      emptyDescription="This opportunity's deadline has not been modified."
      errorMessage="Failed to load deadline history."
    >
      {(items) => (
        <div className="flex flex-col gap-2">
          {items.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-3 text-sm"
            >
              <span className="text-muted-foreground">
                {formatDate(log.oldDeadline)} <span className="mx-1.5">→</span>{" "}
                <span className="font-medium text-foreground">{formatDate(log.newDeadline)}</span>
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(log.changedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          ))}
        </div>
      )}
    </ListState>
  );
}