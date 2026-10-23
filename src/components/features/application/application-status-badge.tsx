import { cn } from "@/lib/utils";
import { ApplicationStatus, Decision } from "@/types/application.type";

const STATUS_META: Record<ApplicationStatus, { label: string; className: string }> = {
  DRAFT: { label: "Draft", className: "bg-muted text-muted-foreground" },
  IN_PROGRESS: { label: "In Progress", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  SUBMITTED: { label: "Submitted", className: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
  INTERVIEW: { label: "Interview", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  DECISION: { label: "Decision", className: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" },
  CLOSED: { label: "Closed", className: "bg-slate-500/10 text-slate-600 dark:text-slate-400" },
};

export { STATUS_META as APPLICATION_STATUS_META };

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  const meta = STATUS_META[status] ?? STATUS_META.DRAFT;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold",
        meta.className
      )}
    >
      {meta.label}
    </span>
  );
}

const DECISION_META: Record<Decision, { label: string; className: string } | null> = {
  PENDING: null, // not rendered — default/no-decision-yet state
  ACCEPTED: { label: "Accepted", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  REJECTED: { label: "Rejected", className: "bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  WAITLISTED: { label: "Waitlisted", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
};

export function DecisionBadge({ decision }: { decision: Decision }) {
  const meta = DECISION_META[decision];
  if (!meta) return null;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold",
        meta.className
      )}
    >
      {meta.label}
    </span>
  );
}