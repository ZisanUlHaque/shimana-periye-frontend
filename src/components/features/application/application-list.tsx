"use client";

import Link from "next/link";
import { FolderKanban } from "lucide-react";
import { useGetMyApplications } from "@/hooks/application.hook";
import { ApplicationCard } from "./application-card";
import { Button } from "@/components/ui/button";

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted/60" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/70 py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <FolderKanban className="size-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">No applications yet</p>
        <p className="text-xs text-muted-foreground">
          Start an application from an opportunity's page.
        </p>
      </div>
<Button nativeButton={false} render={<Link href="/student/opportunities" />}>
  Browse Opportunities
</Button>
    </div>
  );
}

export function ApplicationList() {
  const { data, isLoading, isError } = useGetMyApplications();
  const applications = data?.data ?? [];

  if (isLoading) return <ListSkeleton />;
  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
        Failed to load applications. Please try again.
      </div>
    );
  }
  if (applications.length === 0) return <EmptyState />;

  return (
    <div className="flex flex-col gap-3">
      {applications.map((app) => (
        <ApplicationCard key={app.id} application={app} />
      ))}
    </div>
  );
}