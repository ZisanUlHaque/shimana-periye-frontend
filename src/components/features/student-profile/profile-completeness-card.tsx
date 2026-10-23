"use client";

import { useGetMyStudentProfileCompleteness } from "@/hooks/student-profile.hook";
import { CheckCircle2, Circle, Sparkles } from "lucide-react";
import Link from "next/link";

const CATEGORY_MAP: Record<
  string,
  { label: string; href: string }
> = {
  academics: {
    label: "Academic Records",
    href: "/student/profile/academic-records",
  },
  interestsAndSkills: {
    label: "Interests & Skills",
    href: "/student/profile",
  },
  documents: {
    label: "Documents (SOP/CV)",
    href: "/student/documents",
  },
  tests: {
    label: "Test Scores",
    href: "/student/profile/test-records",
  },
  publications: {
    label: "Experience & Publications",
    href: "/student/profile/publications",
  },
};

export function ProfileCompletenessCard() {
  const { data, isLoading } = useGetMyStudentProfileCompleteness();
  const completeness = data?.data;

  if (isLoading) {
    return (
      <div className="h-44 animate-pulse rounded-2xl border border-border/70 bg-muted/40" />
    );
  }

  if (!completeness) return null;

  const percentage = completeness.percentage ?? 0;
  const breakdown = completeness.breakdown ?? {};

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border/70 bg-card p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="size-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Profile Completeness
            </h3>
            <p className="text-xs text-muted-foreground">
              Complete all sections to unlock highest match accuracy
            </p>
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-primary">
            {percentage}%
          </span>
          <span className="text-xs text-muted-foreground">ready</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>

      {/* Breakdown Items */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(breakdown).map(([key, cat]: [string, any]) => {
          const meta = CATEGORY_MAP[key] ?? {
            label: key,
            href: "/student/profile",
          };
          const isDone = Boolean(cat?.done);

          return (
            <Link
              key={key}
              href={meta.href}
              className="flex items-center justify-between rounded-xl border border-border/50 bg-background/50 px-3 py-2 text-xs transition-colors hover:border-border hover:bg-muted/40"
            >
              <div className="flex items-center gap-2 truncate">
                {isDone ? (
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                ) : (
                  <Circle className="size-4 shrink-0 text-muted-foreground/50" />
                )}
                <span
                  className={
                    isDone
                      ? "truncate font-medium text-foreground"
                      : "truncate text-muted-foreground"
                  }
                >
                  {meta.label}
                </span>
              </div>
              <span className="ml-2 font-mono text-[11px] font-semibold text-muted-foreground">
                {cat?.score}/{cat?.max}%
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
