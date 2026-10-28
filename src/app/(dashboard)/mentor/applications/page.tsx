"use client";

import { useState } from "react";
import { useMentorDashboard } from "@/hooks/dashboard.hook";
import { MenteeReviewDialog } from "@/components/features/mentor/mentee-review-dialog";
import { PageHeader } from "@/components/layout/public/page-header";
import {
  ClipboardList,
  Mail,
  FileText,
  Building2,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function MentorApplicationsPage() {
  const [reviewingStudent, setReviewingStudent] = useState<any>(null);
  const { data, isLoading } = useMentorDashboard();
  const dashboard = data?.data;
  const students = dashboard?.students ?? [];

  const totalApplications = students.reduce(
    (sum: number, s: any) => sum + (s.applicationCount || 0),
    0
  );
  const totalSubmitted = students.reduce(
    (sum: number, s: any) => sum + (s.submittedApplicationCount || 0),
    0
  );
  const totalAwaiting = students.reduce(
    (sum: number, s: any) => sum + (s.documentsAwaitingReview || 0),
    0
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
        <Skeleton className="h-44 rounded-3xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
      {/* ── 1. Hero Header Banner ── */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/95 to-primary/5 p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                <Users className="size-3.5" />
                Mentorship Advising Roster
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                Active Cycle
              </span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
              Assigned Student Applications & Drafts
            </h1>

            <p className="text-xs text-muted-foreground max-w-xl">
              Track your mentees' admissions milestones, evaluate their Statement of Purpose drafts, and provide critique.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/mentor">
              <Button size="sm" variant="outline" className="text-xs gap-1.5 rounded-xl h-9">
                <ClipboardList className="size-3.5" />
                Mentor Command Center
              </Button>
            </Link>
          </div>
        </div>

        {/* ── 2. Top Metric Strip ── */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border/60 pt-6 sm:grid-cols-4">
          <div className="flex flex-col rounded-2xl bg-muted/40 p-4 border border-border/50">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Assigned Scholars
            </span>
            <span className="mt-2 text-2xl font-black text-foreground">
              {students.length}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Active mentees
            </span>
          </div>

          <div className="flex flex-col rounded-2xl bg-blue-500/5 p-4 border border-blue-500/20">
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Total Applications
            </span>
            <span className="mt-2 text-2xl font-black text-blue-600 dark:text-blue-400">
              {totalApplications}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Target programs tracked
            </span>
          </div>

          <div className="flex flex-col rounded-2xl bg-emerald-500/5 p-4 border border-emerald-500/20">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Submitted to Unis
            </span>
            <span className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {totalSubmitted}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Submission stage complete
            </span>
          </div>

          <div className="flex flex-col rounded-2xl bg-amber-500/5 p-4 border border-amber-500/20">
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Review Queue
            </span>
            <span className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">
              {totalAwaiting}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Drafts needing feedback
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. Mentees Grid ── */}
      {students.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-16 text-center bg-card">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
            <ClipboardList className="size-7" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            No Assigned Students Yet
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-md">
            When administrators match students to your advising expertise, their applications, research statements, and draft materials will appear in this workspace.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((student: any) => (
            <div
              key={student.studentProfileId}
              className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-5 shadow-xs hover:border-border hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-12 rounded-xl ring-2 ring-primary/20">
                      <AvatarImage src={student.imageUrl ?? undefined} />
                      <AvatarFallback className="rounded-xl font-bold bg-primary/10 text-primary text-sm">
                        {student.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">
                        {student.name}
                      </h3>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <Mail className="size-3 text-muted-foreground" />
                        {student.email}
                      </span>
                    </div>
                  </div>

                  {student.documentsAwaitingReview > 0 && (
                    <span className="rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold">
                      {student.documentsAwaitingReview} Review{student.documentsAwaitingReview > 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-col gap-2 rounded-xl bg-muted/40 p-3.5 text-xs border border-border/40">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Target Applications</span>
                    <span className="font-bold text-foreground">
                      {student.applicationCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">University Submissions</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {student.submittedApplicationCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-border/40 pt-2">
                    <span className="text-muted-foreground">Drafts Needing Feedback</span>
                    <span
                      className={`font-bold ${
                        student.documentsAwaitingReview > 0
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-foreground"
                      }`}
                    >
                      {student.documentsAwaitingReview}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2">
                <Button
                  size="sm"
                  onClick={() => setReviewingStudent(student)}
                  className="w-full gap-1.5 text-xs h-9 bg-primary text-primary-foreground shadow-xs cursor-pointer"
                >
                  <FileText className="size-3.5" />
                  Review Documents & Progress
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Mentee Document Review & Feedback Studio Modal ── */}
      <MenteeReviewDialog
        open={Boolean(reviewingStudent)}
        onOpenChange={(open) => !open && setReviewingStudent(null)}
        student={reviewingStudent}
      />
    </div>
  );
}
