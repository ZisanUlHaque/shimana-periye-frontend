"use client";

import { Building2, FlaskConical, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteLab } from "@/hooks/lab.hook";
import type { ILab } from "@/types/lab.type";
import { LabDialog } from "./lab-dialog";

export function LabCard({
  lab,
  isAdmin = false,
}: {
  lab: ILab;
  isAdmin?: boolean;
}) {
  const { mutate: deleteLabFn, isPending } = useDeleteLab();

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      {/* Top Banner if Lab has image */}
      {lab.imageUrl && (
        <div className="relative h-28 w-full overflow-hidden bg-muted/40 border-b border-border/50">
          <Image
            src={lab.imageUrl}
            alt={lab.name}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      )}

      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            {!lab.imageUrl && (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FlaskConical className="size-5" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                {lab.name}
              </h3>
              <p className="truncate text-xs text-muted-foreground flex items-center gap-1 mt-0.5 font-medium">
                <Building2 className="size-3" />
                <span>{lab.university?.name ?? "University Lab"}</span>
              </p>
            </div>
          </div>

          {isAdmin && (
            <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <LabDialog
                lab={lab}
                trigger={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                }
              />
              <ConfirmDialog
                title="Delete Lab"
                description={`Are you sure you want to delete "${lab.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                destructive
                isPending={isPending}
                onConfirm={() => deleteLabFn(lab.id)}
                trigger={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                }
              />
            </div>
          )}
        </div>

        {/* Focus areas pills */}
        {lab.focusAreas && lab.focusAreas.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {lab.focusAreas.slice(0, 4).map((area) => (
              <span
                key={area}
                className="rounded-md bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                {area}
              </span>
            ))}
            {lab.focusAreas.length > 4 && (
              <span className="rounded-md bg-muted/40 px-1.5 py-0.5 text-[11px] text-muted-foreground">
                +{lab.focusAreas.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
