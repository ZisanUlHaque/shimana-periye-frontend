"use client";

import { Briefcase } from "lucide-react";
import { useGetMyExperiences } from "@/hooks/experience.hook";
import type { IExperience } from "@/types/experience.type";
import { ExperienceCard } from "./experience-card";
import { ExperienceDialog } from "./experience-dialog";

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-28 animate-pulse rounded-2xl border border-border bg-muted/40"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-14 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Briefcase className="size-7" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">
          No experience records yet
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Add your work, research assistant, or lab experience.
        </p>
      </div>
      <ExperienceDialog />
    </div>
  );
}

export function ExperienceList() {
  const { data, isLoading, isError } = useGetMyExperiences();
  const experiences: IExperience[] = data?.data ?? [];

  if (isLoading) return <ListSkeleton />;

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
        Failed to load experience records. Please try again.
      </div>
    );
  }

  if (experiences.length === 0) return <EmptyState />;

  return (
    <div className="flex flex-col gap-3">
      {experiences.map((exp) => (
        <ExperienceCard key={exp.id} experience={exp} />
      ))}
    </div>
  );
}
