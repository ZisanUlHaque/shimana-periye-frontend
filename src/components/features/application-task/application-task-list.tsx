"use client";

import { ListChecks } from "lucide-react";
import { useGetApplicationTasks } from "@/hooks/application-task.hook";
import { ApplicationTaskCard } from "./application-task-card";
import { ApplicationTaskDialog } from "./application-task-dialog";

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted/60" />
      ))}
    </div>
  );
}

function EmptyState({ applicationId }: { applicationId: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/70 py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <ListChecks className="size-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">No tasks yet</p>
        <p className="text-xs text-muted-foreground">
          Break this application down into actionable tasks.
        </p>
      </div>
      <ApplicationTaskDialog applicationId={applicationId} />
    </div>
  );
}

interface ApplicationTaskListProps {
  applicationId: string;
}

export function ApplicationTaskList({ applicationId }: ApplicationTaskListProps) {
  const { data, isLoading, isError } = useGetApplicationTasks(applicationId);
  const tasks = data?.data ?? [];

  if (isLoading) return <ListSkeleton />;
  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
        Failed to load tasks. Please try again.
      </div>
    );
  }
  if (tasks.length === 0) return <EmptyState applicationId={applicationId} />;

  return (
    <div className="flex flex-col gap-3">
      {tasks.map((task) => (
        <ApplicationTaskCard key={task.id} task={task} applicationId={applicationId} availableTasks={tasks} />
      ))}
    </div>
  );
}