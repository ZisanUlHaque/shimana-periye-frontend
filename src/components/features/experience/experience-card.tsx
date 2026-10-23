"use client";

import { Briefcase, Calendar, Pencil, Trash2 } from "lucide-react";
import type { IExperience } from "@/types/experience.type";
import { ExperienceDialog } from "./experience-dialog";
import { DeleteExperienceDialog } from "./delete-experience-dialog";
import { Button } from "@/components/ui/button";

interface ExperienceCardProps {
  experience: IExperience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const start = formatDate(experience.startDate);
  const end = formatDate(experience.endDate);
  const duration = start ? `${start} — ${end ?? "Present"}` : null;

  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Briefcase className="size-5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {experience.role}
            </h3>
            <p className="truncate text-xs font-medium text-muted-foreground">
              {experience.organization}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <ExperienceDialog
            experience={experience}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-muted-foreground hover:text-foreground"
              >
                <Pencil className="size-3.5" />
              </Button>
            }
          />
          <DeleteExperienceDialog
            id={experience.id}
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </Button>
            }
          />
        </div>
      </div>

      {experience.description && (
        <p className="line-clamp-3 text-xs text-muted-foreground">
          {experience.description}
        </p>
      )}

      {duration && (
        <div className="flex items-center gap-1.5 border-t border-border/60 pt-3 text-xs text-muted-foreground">
          <Calendar className="size-3.5" />
          <span>{duration}</span>
        </div>
      )}
    </div>
  );
}
