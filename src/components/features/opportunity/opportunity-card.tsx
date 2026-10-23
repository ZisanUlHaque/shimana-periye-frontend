"use client";

import Link from "next/link";
import { Building2, CalendarClock, Pencil } from "lucide-react";
import type { IOpportunity } from "@/types/opportunity.type";
import { OpportunityTypeBadge } from "./opportunity-type-badge";
import { OpportunityDialog } from "./opportunity-dialog";
import { DeleteOpportunityDialog } from "./delete-opportunity-dialog";

interface OpportunityCardProps {
  opportunity: IOpportunity;
  isAdmin?: boolean;
}

export function OpportunityCard({ opportunity, isAdmin = false }: OpportunityCardProps) {
  const deadline = opportunity.deadline
    ? new Date(opportunity.deadline).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <Link
          href={`/${isAdmin ? "admin" : "student"}/opportunities/${opportunity.id}`}
          className="flex min-w-0 items-start gap-3"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="size-5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-foreground">{opportunity.title}</h3>
            <p className="truncate text-xs text-muted-foreground">
              {opportunity.university?.name ?? "—"} · {opportunity.fieldOfStudy}
            </p>
          </div>
        </Link>

        {isAdmin && (
          <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <OpportunityDialog
              opportunity={opportunity}
              trigger={
                <button className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                  <Pencil className="size-3.5" />
                </button>
              }
            />
            <DeleteOpportunityDialog id={opportunity.id} />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-3">
        <div className="text-xs text-muted-foreground">
          {deadline ? (
            <span className="inline-flex items-center gap-1.5">
              <CalendarClock className="size-3.5" />
              Deadline: {deadline}
            </span>
          ) : (
            <span>No deadline specified</span>
          )}
        </div>
        <OpportunityTypeBadge type={opportunity.type} />
      </div>
    </div>
  );
}