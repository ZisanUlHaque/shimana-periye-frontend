"use client";

import Link from "next/link";
import { Compass, AlertTriangle, Sparkles } from "lucide-react";
import { ShortlistNotesDialog } from "./shortlist-notes-dialog";
import { OpportunityTypeBadge } from "@/components/features/opportunity/opportunity-type-badge";
import type { IShortlistListItem } from "@/types/shortlist.type";
import { RemoveShortlistDialog } from "./remove-shortlist-dialog.tsxremove-shortlist-dialog";

interface ShortlistCardProps {
  item: IShortlistListItem;
  selected?: boolean;
  onToggleSelect?: (shortlistId: string) => void;
}

export function ShortlistCard({ item, selected, onToggleSelect }: ShortlistCardProps) {
  const opportunity = item.opportunity;

  return (
    <div className="group rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-border">
      {/* Row 1: checkbox + icon/title (left) | actions (right) */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {onToggleSelect && (
            <input
              type="checkbox"
              checked={!!selected}
              onChange={() => onToggleSelect(item.shortlistId)}
              className="size-4 shrink-0 rounded border-input"
            />
          )}
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Compass className="size-4" />
          </div>
          <Link
            href={`/student/opportunities/${opportunity.id}`}
            className="min-w-0 truncate font-medium text-foreground hover:underline"
          >
            {opportunity.title}
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <ShortlistNotesDialog item={item} />
          <RemoveShortlistDialog
            shortlistId={item.shortlistId}
            opportunityTitle={opportunity.title}
          />
        </div>
      </div>

      {/* Row 2: meta (left) | badges (right) */}
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/60 pt-3">
        <span className="truncate text-sm text-muted-foreground">
          {opportunity.university?.name ?? opportunity.fieldOfStudy}
        </span>
        <div className="flex shrink-0 items-center gap-1.5">
          {item.deadlinePassed ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-medium text-destructive">
              <AlertTriangle className="size-3" />
              Deadline passed
            </span>
          ) : null}
          {typeof item.matchScore === "number" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
              <Sparkles className="size-3" />
              {item.matchScore}% match
            </span>
          ) : null}
          <OpportunityTypeBadge type={opportunity.type} />
        </div>
      </div>

      {item.notes ? (
        <p className="mt-2 truncate text-xs italic text-muted-foreground">“{item.notes}”</p>
      ) : null}
    </div>
  );
}