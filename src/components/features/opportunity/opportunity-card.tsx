"use client";

import {
  Award,
  Building2,
  CalendarClock,
  FlaskConical,
  GraduationCap,
  Pencil,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { IOpportunity, OpportunityType } from "@/types/opportunity.type";
import { DeleteOpportunityDialog } from "./delete-opportunity-dialog";
import { OpportunityDialog } from "./opportunity-dialog";
import { OpportunityTypeBadge } from "./opportunity-type-badge";

interface OpportunityCardProps {
  opportunity: IOpportunity;
  isAdmin?: boolean;
}

export function OpportunityCard({
  opportunity,
  isAdmin = false,
}: OpportunityCardProps) {
  const deadline = opportunity.deadline
    ? new Date(opportunity.deadline).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const getFallbackIcon = (type: OpportunityType) => {
    switch (type) {
      case "FUNDING":
        return Award;
      case "LAB_POSITION":
        return FlaskConical;
      default:
        return GraduationCap;
    }
  };

  const Icon = getFallbackIcon(opportunity.type);

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5">
      {/* Top Media Strip if Opportunity has imageUrl */}
      {opportunity.imageUrl && (
        <div className="relative h-32 w-full overflow-hidden bg-muted/40 border-b border-border/50">
          <Image
            src={opportunity.imageUrl}
            alt={opportunity.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <div className="absolute top-2.5 right-2.5 z-10">
            <OpportunityTypeBadge type={opportunity.type} />
          </div>
        </div>
      )}

      <div className="p-5 flex flex-col gap-3.5 flex-1 justify-between">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/${isAdmin ? "admin" : "student"}/opportunities/${opportunity.id}`}
            className="flex min-w-0 items-start gap-3 flex-1"
          >
            {!opportunity.imageUrl && (
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                {opportunity.title}
              </h3>
              <p className="truncate text-xs text-muted-foreground mt-1 flex items-center gap-1 font-medium">
                <Building2 className="size-3 shrink-0" />
                <span className="truncate">
                  {opportunity.university?.name ?? "—"}
                </span>
                <span>·</span>
                <span className="text-foreground/80 font-semibold">
                  {opportunity.fieldOfStudy}
                </span>
              </p>
            </div>
          </Link>

          {isAdmin && (
            <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <OpportunityDialog
                opportunity={opportunity}
                trigger={
                  <button
                    type="button"
                    className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
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
              <span className="inline-flex items-center gap-1.5 font-medium">
                <CalendarClock className="size-3.5 text-primary" />
                <span>Deadline: {deadline}</span>
              </span>
            ) : (
              <span className="italic text-muted-foreground/70">
                Rolling deadline
              </span>
            )}
          </div>
          {!opportunity.imageUrl && (
            <OpportunityTypeBadge type={opportunity.type} />
          )}
        </div>
      </div>
    </div>
  );
}
