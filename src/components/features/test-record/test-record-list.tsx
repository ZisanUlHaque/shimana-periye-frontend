"use client";

import { Award } from "lucide-react";
import { useGetMyTestRecords } from "@/hooks/test-record.hook";
import type { ITestRecord } from "@/types/test-record.type";
import { TestRecordCard } from "./test-record-card";
import { TestRecordDialog } from "./test-record-dialog";

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
        <Award className="size-7" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">
          No test records yet
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Add your IELTS, TOEFL, GRE, or GMAT scores.
        </p>
      </div>
      <TestRecordDialog />
    </div>
  );
}

export function TestRecordList() {
  const { data, isLoading, isError } = useGetMyTestRecords();
  const records: ITestRecord[] = data?.data ?? [];

  if (isLoading) return <ListSkeleton />;

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
        Failed to load test records. Please try again.
      </div>
    );
  }

  if (records.length === 0) return <EmptyState />;

  return (
    <div className="flex flex-col gap-3">
      {records.map((rec) => (
        <TestRecordCard key={rec.id} record={rec} />
      ))}
    </div>
  );
}
