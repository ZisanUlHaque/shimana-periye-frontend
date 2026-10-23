"use client";

import Link from "next/link";
import { Building2, Globe } from "lucide-react";
import { UniversityDialog } from "./university-dialog";
import { DeleteUniversityDialog } from "./delete-university-dialog";
import type { IUniversity } from "@/types/university.type";

interface UniversityCardProps {
  university: IUniversity;
  isAdmin?: boolean;
}

export function UniversityCard({ university, isAdmin }: UniversityCardProps) {
  return (
    <div className="group rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-border">
      {/* Row 1: icon + title (left) | actions (right) */}
      <div className="flex items-center justify-between gap-2">
        <Link
          href={`/admin/universities/${university.id}`}
          className="flex min-w-0 items-center gap-2"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="size-4" />
          </div>
          <span className="truncate font-medium text-foreground">
            {university.name}
          </span>
        </Link>

        {isAdmin && (
          <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <UniversityDialog university={university} />
            <DeleteUniversityDialog
              universityId={university.id}
              universityName={university.name}
            />
          </div>
        )}
      </div>

      {/* Row 2: meta (left) | website badge (right) */}
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/60 pt-3">
        <span className="truncate text-sm text-muted-foreground">
          {university.country}
        </span>

        {university.website ? (
          <a
            href={university.website}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Globe className="size-3" />
            Website
          </a>
        ) : null}
      </div>
    </div>
  );
}