"use client";

import { useMyReadiness } from "@/hooks/readiness.hook";
import {
  Gauge,
  CheckCircle2,
  CircleDashed,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function ReadinessDashboard() {
  const { data, isLoading } = useMyReadiness();
  const readiness = data?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-44 rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>
    );
  }

  const score = readiness?.totalScore ?? 0;
  const level = readiness?.level ?? "GETTING_STARTED";
  const items = readiness?.items ?? [];

  const levelColor =
    score >= 80
      ? "text-green-600 bg-green-500/10 border-green-500/20"
      : score >= 50
      ? "text-primary bg-primary/10 border-primary/20"
      : "text-amber-600 bg-amber-500/10 border-amber-500/20";

  return (
    <div className="flex flex-col gap-6">
      {/* Overall Score Header Card */}
      <div className="flex flex-col gap-6 rounded-2xl border border-border/70 bg-card p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <div className="relative flex size-24 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <span className="text-3xl font-extrabold">{score}%</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-foreground">
                Application Readiness Score
              </h3>
              <Badge variant="outline" className={`text-xs ${levelColor}`}>
                {level.replace(/_/g, " ")}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed max-w-xl">
              Composite score computed directly from your completed academic records,
              standardized test scores, CV & SOP documents, recommendations, and
              applications.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <Link href="/student/profile">
            <Button size="sm" className="w-full gap-1.5 text-xs">
              Improve Profile
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
          <Link href="/student/documents">
            <Button size="sm" variant="outline" className="w-full text-xs">
              Upload CV / SOP
            </Button>
          </Link>
        </div>
      </div>

      {/* Progress Bars for Individual Items */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">
            Readiness Checklist & Breakdown
          </h4>
          <span className="text-xs text-muted-foreground">
            {items.filter((i: any) => i.completed).length} of {items.length} completed
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item: any) => {
            const percentage = Math.round((item.earned / item.max) * 100);

            return (
              <div
                key={item.key}
                className={`flex flex-col justify-between rounded-xl border p-4 transition-all ${
                  item.completed
                    ? "border-green-500/30 bg-green-500/5"
                    : "border-border/60 bg-muted/20"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {item.completed ? (
                      <CheckCircle2 className="size-4 shrink-0 text-green-600" />
                    ) : (
                      <CircleDashed className="size-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className="text-xs font-semibold text-foreground">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    {item.earned}/{item.max} pts
                  </span>
                </div>

                <div className="mt-3 relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      item.completed ? "bg-green-600" : "bg-primary"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
