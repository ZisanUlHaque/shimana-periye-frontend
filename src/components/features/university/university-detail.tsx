"use client";

import { Building2, FlaskConical, Globe, GraduationCap } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useUniversity } from "@/hooks/university.hook";
import { DeleteUniversityDialog } from "./delete-university-dialog";
import { UniversityDialog } from "./university-dialog";

interface UniversityDetailProps {
  universityId: string;
}

export function UniversityDetail({ universityId }: UniversityDetailProps) {
  const { data: university, isLoading, isError } = useUniversity(universityId);

  if (isLoading) return <Skeleton className="h-48 w-full" />;
  if (isError || !university) {
    return (
      <p className="text-sm text-destructive">Failed to load university.</p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xs">
        {university.imageUrl && (
          <div className="relative h-48 sm:h-64 w-full bg-muted/40">
            <Image
              src={university.imageUrl}
              alt={university.name}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            {!university.imageUrl && (
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Building2 className="size-7" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {university.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {university.country}
              </p>
              {university.website ? (
                <a
                  href={university.website}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline bg-primary/10 px-3 py-1 rounded-full"
                >
                  <Globe className="size-3.5" />
                  {university.website}
                </a>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <UniversityDialog university={university} />
            <DeleteUniversityDialog
              universityId={university.id}
              universityName={university.name}
            />
          </div>
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
            <p className="text-sm text-muted-foreground">
              No professors added yet.
            </p>
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
