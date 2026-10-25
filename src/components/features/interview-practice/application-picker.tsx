"use client";

import { useGetMyApplications } from "@/hooks/application.hook";
import { Building2, Calendar, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function ApplicationPicker() {
  const { data, isLoading } = useGetMyApplications();
  const applications = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-44 rounded-2xl" />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Building2 className="size-6" />
        </div>
        <h4 className="mt-4 text-sm font-semibold text-foreground">
          No applications created yet
        </h4>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm">
          Start an application from an opportunity to practice custom mock interview questions.
        </p>
        <Link href="/student/opportunities" className="mt-4">
          <Button size="sm">Browse Opportunities</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {applications.map((app: any) => (
        <div
          key={app.id}
          className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-5 shadow-xs transition-shadow hover:shadow-md"
        >
          <div>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-[11px] capitalize">
                {app.status.toLowerCase().replace(/_/g, " ")}
              </Badge>
              {app.interviewDate && (
                <span className="flex items-center gap-1 text-[11px] text-amber-600 font-medium">
                  <Calendar className="size-3" />
                  {new Date(app.interviewDate).toLocaleDateString()}
                </span>
              )}
            </div>

            <h4 className="mt-3 text-sm font-semibold text-foreground">
              {app.opportunity?.title ?? "Application"}
            </h4>

            <p className="mt-1 text-xs text-muted-foreground">
              {app.opportunity?.university?.name ?? "University"} · {app.opportunity?.fieldOfStudy}
            </p>
          </div>

          <div className="mt-5 border-t border-border/60 pt-3">
            <Link href={`/student/interview-practice/${app.id}`}>
              <Button size="sm" className="w-full gap-1.5 text-xs">
                <Sparkles className="size-3.5" />
                Practice Interview
                <ArrowRight className="size-3.5 ml-auto" />
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
