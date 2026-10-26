"use client";

import { Building2, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { IUniversity } from "@/types/university.type";
import { DeleteUniversityDialog } from "./delete-university-dialog";
import { UniversityDialog } from "./university-dialog";

interface UniversityCardProps {
  university: IUniversity;
  isAdmin?: boolean;
}

export function UniversityCard({ university, isAdmin }: UniversityCardProps) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 flex flex-col justify-between">
      {/* Top Banner or Header */}
      {university.imageUrl && (
        <div className="relative h-28 w-full overflow-hidden bg-muted/40 border-b border-border/50">
          <Image
            src={university.imageUrl}
            alt={university.name}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      )}

      <div className="p-4 flex flex-col gap-3">
        {/* Row 1: icon/avatar + title (left) | actions (right) */}
        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/admin/universities/${university.id}`}
            className="flex min-w-0 items-center gap-2.5"
          >
            {!university.imageUrl ? (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="size-5" />
              </div>
            ) : null}
            <span className="truncate font-bold text-foreground group-hover:text-primary transition-colors">
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
        <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-3">
          <span className="truncate text-xs text-muted-foreground font-medium">
            {university.country}
          </span>

          {university.website ? (
            <a
              href={university.website}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex shrink-0 items-center gap-1 rounded-full bg-muted/70 px-2.5 py-0.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-medium"
            >
              <Globe className="size-3" />
              Website
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
