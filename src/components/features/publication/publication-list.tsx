"use client";

import { BookOpen } from "lucide-react";
import { useGetMyPublications } from "@/hooks/publication.hook";
import type { IPublication } from "@/types/publication.type";
import { PublicationCard } from "./publication-card";
import { PublicationDialog } from "./publication-dialog";

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-24 animate-pulse rounded-2xl border border-border bg-muted/40"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-14 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <BookOpen className="size-7" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">
          No publications yet
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Add your conference papers, journals, or preprints.
        </p>
      </div>
      <PublicationDialog />
    </div>
  );
}

export function PublicationList() {
  const { data, isLoading, isError } = useGetMyPublications();
  const publications: IPublication[] = data?.data ?? [];

  if (isLoading) return <ListSkeleton />;

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
        Failed to load publications. Please try again.
      </div>
    );
  }

  if (publications.length === 0) return <EmptyState />;

  return (
    <div className="flex flex-col gap-3">
      {publications.map((pub) => (
        <PublicationCard key={pub.id} publication={pub} />
      ))}
    </div>
  );
}
