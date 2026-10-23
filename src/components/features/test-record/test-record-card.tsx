"use client";

import { Award, Calendar, Pencil, Trash2 } from "lucide-react";
import type { ITestRecord } from "@/types/test-record.type";
import { TestRecordDialog } from "./test-record-dialog";
import { DeleteTestRecordDialog } from "./delete-test-record-dialog";
import { Button } from "@/components/ui/button";

interface TestRecordCardProps {
  record: ITestRecord;
}

export function TestRecordCard({ record }: TestRecordCardProps) {
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const actual = formatDate(record.actualDate);
  const planned = formatDate(record.plannedDate);

  return (
    <div className="group relative flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-all duration-200 hover:border-border hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Award className="size-5" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {record.testType}
            </h3>
            <p className="truncate text-xs text-muted-foreground">
              {actual
                ? `Completed on ${actual}`
                : planned
                ? `Planned on ${planned}`
                : "Score recorded"}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <TestRecordDialog
            testRecord={record}
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
          <DeleteTestRecordDialog
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

      <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="size-3.5" />
          <span>
            {actual
              ? "Verified Score"
              : planned
              ? "Upcoming Exam"
              : "Self Reported"}
          </span>
        </div>

        {record.score?.overall !== undefined ? (
          <span className="shrink-0 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Score: {record.score.overall}
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            Pending Score
          </span>
        )}
      </div>
    </div>
  );
}
