"use client";

import { Calendar, Link2, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IApplicationTask } from "@/types/application-task.type";
import { ApplicationTaskDialog } from "./application-task-dialog";
import { DeleteApplicationTaskDialog } from "./delete-application-task-dialog";
import { useUpdateTaskStatus } from "@/hooks/application-task.hook";

const STATUS_META: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  IN_PROGRESS: { label: "In Progress", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  COMPLETED: { label: "Completed", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  CANCELLED: { label: "Cancelled", className: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
};

interface ApplicationTaskCardProps {
  task: IApplicationTask;
  applicationId: string;
  availableTasks?: IApplicationTask[];
  readOnly?: boolean;
}

export function ApplicationTaskCard({
  task,
  applicationId,
  availableTasks = [],
  readOnly = false,
}: ApplicationTaskCardProps) {
  const { mutate: updateStatus } = useUpdateTaskStatus(applicationId);

  const meta = STATUS_META[task.status] ?? STATUS_META.PENDING;
  const isOverdue =
    task.deadline && task.status !== "COMPLETED" && new Date(task.deadline).getTime() < Date.now();

  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm">
      {/* Top row: title/description (left) | edit/delete actions (right) */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-foreground">{task.title}</h3>
          {task.description && (
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
          )}
        </div>

        {!readOnly && (
          <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <ApplicationTaskDialog
              applicationId={applicationId}
              task={task}
              availableTasks={availableTasks}
              trigger={
                <button className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                  <Pencil className="size-3.5" />
                </button>
              }
            />
            <DeleteApplicationTaskDialog applicationId={applicationId} taskId={task.id} />
          </div>
        )}
      </div>

      {/* Bottom row: deadline/dependency meta (left) | status badge/select (right) */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {task.deadline && (
            <span className={cn("inline-flex items-center gap-1", isOverdue && "font-medium text-destructive")}>
              <Calendar className="size-3.5" />
              {new Date(task.deadline).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
              {isOverdue && " (overdue)"}
            </span>
          )}
          {task.dependsOnId && (
            <span className="inline-flex items-center gap-1">
              <Link2 className="size-3.5" />
              Depends on another task
            </span>
          )}
        </div>

        {readOnly ? (
          <span
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold",
              meta.className
            )}
          >
            {meta.label}
          </span>
        ) : (
          <select
            value={task.status}
            onChange={(e) => updateStatus({ taskId: task.id, payload: { status: e.target.value as any } })}
            className={cn(
              "cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-semibold outline-none",
              meta.className
            )}
          >
            {Object.entries(STATUS_META).map(([value, m]) => (
              <option key={value} value={value}>
                {m.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}