"use client";

import Link from "next/link";
import { Building2, ChevronRight } from "lucide-react";
import type { IApplication } from "@/types/application.type";
import { ApplicationStatusBadge, DecisionBadge } from "./application-status-badge";

export function ApplicationCard({ application }: { application: IApplication }) {
  return (
    <Link
      href={`/student/applications/${application.id}`}
      className="group flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Building2 className="size-5" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {application.opportunity?.title ?? "Untitled Opportunity"}
          </h3>
          <p className="truncate text-xs text-muted-foreground">
            {application.opportunity?.university?.name ?? "—"}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <ApplicationStatusBadge status={application.status} />
        <DecisionBadge decision={application.decision} />
        <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}