"use client";

import { GraduationCap, Pencil, Trash2 } from "lucide-react";
import type { IAcademicRecord } from "@/types/academic-record.type";
import { AcademicRecordDialog } from "./academic-record-dialog";
import { DeleteAcademicRecordDialog } from "./delete-academic-record-dialog";
import { Button } from "@/components/ui/button";

interface AcademicRecordCardProps {
  record: IAcademicRecord;
}

export function AcademicRecordCard({ record }: AcademicRecordCardProps) {
  const duration =
    record.startYear && record.endYear
      ? `${record.startYear} — ${record.endYear}`
      : record.startYear
      ? `${record.startYear} — Present`
      : null;

  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm">
      {/* Top row: icon + title block (left) | action buttons (right) */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <GraduationCap className="size-5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {record.degree}
            </h3>
            <p className="truncate text-xs text-muted-foreground">
              {record.fieldOfStudy}
            </p>
          </div>
        </div>

        {/* Action buttons — reserved own space, no overlap with badge */}
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <AcademicRecordDialog
            record={record}
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
          <DeleteAcademicRecordDialog
            id={record.id}
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

      {/* Bottom row: institution + duration (left) | GPA badge (right) */}
      <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-3">
        <div className="min-w-0 text-xs text-muted-foreground">
          <span className="truncate">{record.institution}</span>
          {duration && (
            <>
              <span className="mx-1.5">•</span>
              <span>{duration}</span>
            </>
          )}
        </div>

        {record.gpa != null && (
          <span className="shrink-0 whitespace-nowrap rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            GPA {record.gpa.toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
}