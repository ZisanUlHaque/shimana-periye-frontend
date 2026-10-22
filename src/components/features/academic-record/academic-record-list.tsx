"use client";

import { GraduationCap } from "lucide-react";
import { useGetMyAcademicRecords } from "@/hooks/academic-record.hook";
import type { IAcademicRecord } from "@/types/academic-record.type";
import { AcademicRecordCard } from "./academic-record-card";
import { AcademicRecordDialog } from "./academic-record-dialog";

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-[104px] animate-pulse rounded-2xl border border-border bg-muted/40"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-14 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <GraduationCap className="size-7" />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">
          No academic records yet
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Add your degrees to strengthen your profile.
        </p>
      </div>
      <AcademicRecordDialog />
    </div>
  );
}

export function AcademicRecordList() {
  const { data, isLoading, isError } = useGetMyAcademicRecords();
  const records: IAcademicRecord[] = data?.data ?? [];

  if (isLoading) return <ListSkeleton />;

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
        Failed to load academic records. Please try again.
      </div>
    );
  }

  if (records.length === 0) return <EmptyState />;

  return (
    <div className="flex flex-col gap-3">
      {records.map((record) => (
        <AcademicRecordCard key={record.id} record={record} />
      ))}
    </div>
  );
}