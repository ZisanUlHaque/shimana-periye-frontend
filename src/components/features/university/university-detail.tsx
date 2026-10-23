"use client";

import { Globe, GraduationCap, FlaskConical } from "lucide-react";
import { useUniversity } from "@/hooks/university.hook";
import { UniversityDialog } from "./university-dialog";
import { DeleteUniversityDialog } from "./delete-university-dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface UniversityDetailProps {
  universityId: string;
}

export function UniversityDetail({ universityId }: UniversityDetailProps) {
  const { data: university, isLoading, isError } = useUniversity(universityId);

  if (isLoading) return <Skeleton className="h-48 w-full" />;
  if (isError || !university) {
    return <p className="text-sm text-destructive">Failed to load university.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-2 rounded-xl border border-border/60 bg-card p-5">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{university.name}</h2>
          <p className="text-sm text-muted-foreground">{university.country}</p>
          {university.website ? (
            <a
              href={university.website}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <Globe className="size-3.5" />
              {university.website}
            </a>
          ) : null}
        </div>
        <div className="flex items-center gap-1">
          <UniversityDialog university={university} />
          <DeleteUniversityDialog universityId={university.id} universityName={university.name} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-card p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <GraduationCap className="size-4" />
            Professors ({university.professors?.length ?? 0})
          </h3>
          {university.professors?.length ? (
            <ul className="space-y-1.5">
              {university.professors.map((p) => (
                <li key={p.id} className="text-sm text-muted-foreground">
                  {p.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No professors added yet.</p>
          )}
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <FlaskConical className="size-4" />
            Labs ({university.labs?.length ?? 0})
          </h3>
          {university.labs?.length ? (
            <ul className="space-y-1.5">
              {university.labs.map((l) => (
                <li key={l.id} className="text-sm text-muted-foreground">
                  {l.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No labs added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}