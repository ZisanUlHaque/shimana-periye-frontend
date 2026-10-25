"use client";

import { useMentorDashboard } from "@/hooks/dashboard.hook";
import { PageHeader } from "@/components/layout/public/page-header";
import {
  ClipboardList,
  Mail,
  FileText,
  Building2,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MentorApplicationsPage() {
  const { data, isLoading } = useMentorDashboard();
  const dashboard = data?.data;
  const students = dashboard?.students ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-4 sm:p-6">
        <PageHeader
          title="Assigned Student Applications"
          description="Review progress, milestones, and documents for your assigned mentees."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <PageHeader
        title="Assigned Student Applications"
        description="Review progress, milestones, and documents for your assigned mentees."
      />

      {students.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ClipboardList className="size-6" />
          </div>
          <h4 className="mt-4 text-sm font-semibold text-foreground">
            No assigned students yet
          </h4>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm">
            When an admin assigns students to you, their applications and review
            materials will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((student: any) => (
            <div
              key={student.studentProfileId}
              className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-5 shadow-xs"
            >
              <div>
                <div className="flex items-center gap-3">
                  <Avatar className="size-11 rounded-xl">
                    <AvatarImage src={student.imageUrl ?? undefined} />
                    <AvatarFallback className="rounded-xl font-bold">
                      {student.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {student.name}
                    </h4>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Mail className="size-3" />
                      {student.email}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 rounded-xl bg-muted/40 p-3.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Applications</span>
                    <span className="font-semibold text-foreground">
                      {student.applicationCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Submitted</span>
                    <span className="font-semibold text-foreground">
                      {student.submittedApplicationCount}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border/50 pt-1.5">
                    <span className="text-muted-foreground">Documents Awaiting Review</span>
                    <span
                      className={`font-semibold ${
                        student.documentsAwaitingReview > 0
                          ? "text-amber-600"
                          : "text-foreground"
                      }`}
                    >
                      {student.documentsAwaitingReview}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2">
                <Link href={`/mentor`}>
                  <Button size="sm" variant="outline" className="w-full gap-1.5 text-xs">
                    <FileText className="size-3.5" />
                    View Student Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
