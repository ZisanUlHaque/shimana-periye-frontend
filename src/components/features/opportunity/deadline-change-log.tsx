"use client";

import { History } from "lucide-react";
import { ListState } from "@/components/shared/list-state";
import { useOpportunityDeadlineLogs } from "@/hooks/opportunity.hook";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function DeadlineChangeLogList({
  opportunityId,
}: {
  opportunityId: string;
}) {
  const { data, isLoading, isError } =
    useOpportunityDeadlineLogs(opportunityId);

  return (
    <ListState
      isLoading={isLoading}
      isError={isError}
      items={data ?? []}
      emptyIcon={History}
      emptyTitle="No deadline changes"
      emptyDescription="This opportunity's deadline has not been changed yet."
      errorMessage="Failed to load deadline change history."
    >
      {(logs) => (
        <ul className="space-y-2">
          {logs.map((log) => (
            <li
              key={log.id}
              className="rounded-md border border-border/60 px-3 py-2 text-xs text-muted-foreground"
            >
              <span className="font-medium text-foreground">
                {formatDate(log.oldDeadline)}
              </span>
              {" → "}
              <span className="font-medium text-foreground">
                {formatDate(log.newDeadline)}
              </span>
              <span className="ml-2 text-muted-foreground/70">
                {new Date(log.changedAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </ListState>
  );
}
